namespace FarmFresh.Domain.Entities;

public class ExchangeRate
{
    public Guid Id { get; set; }
    public string FromCurrency { get; set; } = "RSD";
    public string ToCurrency { get; set; } = string.Empty;
    public decimal Rate { get; set; }
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}