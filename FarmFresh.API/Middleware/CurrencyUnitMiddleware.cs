using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using FarmFresh.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FarmFresh.API.Middleware;

public class CurrencyUnitMiddleware
{
    private readonly RequestDelegate _next;
    private static Dictionary<string, decimal> _cachedRates = new()
    {
        { "RSD", 1m }, { "EUR", 0.0085m }, { "USD", 0.0092m }
    };
    private static DateTime _lastRefresh = DateTime.MinValue;

    
    private static readonly Dictionary<string, (decimal Factor, string NewUnit)> MetricToImperial = new()
    {
        { "kg",    (2.20462m,  "lb")  },
        { "gram",  (0.003527m, "oz")  },
        { "litar", (0.264172m, "gal") },
    };

    public CurrencyUnitMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, AppDbContext db)
    {
        try
        {
            if (DateTime.UtcNow - _lastRefresh > TimeSpan.FromHours(24))
            {
                var dbRates = await db.ExchangeRates.ToListAsync();
                if (dbRates.Any())
                {
                    _cachedRates = new Dictionary<string, decimal> { { "RSD", 1m } };
                    foreach (var r in dbRates)
                        _cachedRates[r.ToCurrency] = r.Rate;
                }
                _lastRefresh = DateTime.UtcNow;
            }
        }
        catch { }

        var currency = GetCurrency(context);
        var units = GetUnits(context);

        var originalBody = context.Response.Body;
        using var memStream = new MemoryStream();
        context.Response.Body = memStream;

        try
        {
            await _next(context);
        }
        catch
        {
            context.Response.Body = originalBody;
            throw;
        }

        memStream.Seek(0, SeekOrigin.Begin);
        var responseBody = await new StreamReader(memStream).ReadToEndAsync();

        if (context.Response.ContentType?.Contains("application/json") == true)
            responseBody = ConvertResponse(responseBody, currency, units);

        var bytes = Encoding.UTF8.GetBytes(responseBody);
        context.Response.Body = originalBody;
        context.Response.ContentLength = bytes.Length;
        await context.Response.Body.WriteAsync(bytes);
    }

    private string GetCurrency(HttpContext context)
    {
        if (context.Request.Headers.TryGetValue("X-Currency", out var header))
            return header.ToString().ToUpper();
        var claim = context.User.FindFirst("currency")?.Value;
        return claim?.ToUpper() ?? "RSD";
    }

    private string GetUnits(HttpContext context)
    {
        if (context.Request.Headers.TryGetValue("X-Units", out var header))
            return header.ToString().ToLower();
        var claim = context.User.FindFirst("units")?.Value;
        return claim?.ToLower() ?? "metric";
    }

    private string ConvertResponse(string json, string currency, string units)
    {
        try
        {
            var node = JsonNode.Parse(json);
            if (node != null) ConvertNode(node, currency, units);
            return node?.ToJsonString() ?? json;
        }
        catch { return json; }
    }

    private void ConvertNode(JsonNode node, string currency, string units)
    {
        if (node is JsonObject obj)
        {
            foreach (var key in obj.Select(k => k.Key).ToList())
            {
                var lower = key.ToLower();

               
                if ((lower.Contains("price") || lower.Contains("amount") || lower.Contains("total"))
                    && obj[key] is JsonValue val && val.TryGetValue<decimal>(out var amount))
                {
                    var rate = _cachedRates.GetValueOrDefault(currency, 1m);
                    obj[key + "Original"] = amount;
                    obj["currencyOriginal"] = "RSD";
                    obj[key] = Math.Round(amount * rate, 2);
                    obj["currency"] = currency;
                }
                
                else if (lower == "unit" && units == "imperial"
                    && obj[key] is JsonValue unitVal
                    && unitVal.TryGetValue<string>(out var unitStr)
                    && unitStr != null
                    && MetricToImperial.TryGetValue(unitStr.ToLower(), out var conversion))
                {
                    obj["unitOriginal"] = unitStr;
                    obj[key] = conversion.NewUnit;

                    // Konvertuj quantity ako postoji u istom objektu
                    foreach (var qKey in new[] { "quantity", "weeklyPrice" })
                    {
                        if (obj[qKey] is JsonValue qVal && qVal.TryGetValue<decimal>(out var qty))
                        {
                            obj[qKey + "Original"] = qty;
                            obj[qKey] = Math.Round(qty * conversion.Factor, 3);
                        }
                    }

                   
                    foreach (var pKey in new[] { "price", "unitPrice" })
                    {
                        if (obj[pKey] is JsonValue pVal && pVal.TryGetValue<decimal>(out var price))
                        {
                            obj[pKey + "PerUnitOriginal"] = price;
                            obj[pKey] = Math.Round(price / conversion.Factor, 2);
                        }
                    }
                }
                else if (obj[key] is JsonObject || obj[key] is JsonArray)
                    ConvertNode(obj[key]!, currency, units);
            }
        }
        else if (node is JsonArray arr)
        {
            foreach (var item in arr)
                if (item != null) ConvertNode(item, currency, units);
        }
    }
}