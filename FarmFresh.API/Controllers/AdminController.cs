using FarmFresh.Application.Interfaces;
using FarmFresh.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FarmFresh.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public AdminController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    // Kursne liste
    [HttpGet("exchange-rates")]
    public async Task<IActionResult> GetRates()
    {
        var rates = await _unitOfWork.Repository<ExchangeRate>().GetAllAsync();
        return Ok(rates);
    }

    [HttpPost("exchange-rates")]
    public async Task<IActionResult> SetRate([FromBody] SetRateRequest request)
    {
        var all = await _unitOfWork.Repository<ExchangeRate>().GetAllAsync();
        var existing = all.FirstOrDefault(r => r.ToCurrency == request.ToCurrency);
        if (existing != null)
        {
            existing.Rate = request.Rate;
            existing.UpdatedAt = DateTime.UtcNow;
            _unitOfWork.Repository<ExchangeRate>().Update(existing);
        }
        else
        {
            await _unitOfWork.Repository<ExchangeRate>().AddAsync(new ExchangeRate
            {
                Id = Guid.NewGuid(),
                FromCurrency = "RSD",
                ToCurrency = request.ToCurrency,
                Rate = request.Rate,
                UpdatedAt = DateTime.UtcNow
            });
        }
        await _unitOfWork.SaveChangesAsync();
        return Ok(new { success = true });
    }

    // Statistike
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var farmers = await _unitOfWork.Repository<FarmerProfile>().GetAllAsync();
        var customers = await _unitOfWork.Repository<CustomerProfile>().GetAllAsync();
        var products = await _unitOfWork.Repository<Product>().GetAllAsync();
        var orders = await _unitOfWork.Repository<Order>().GetAllAsync();

        return Ok(new
        {
            totalFarmers = farmers.Count(),
            verifiedFarmers = farmers.Count(f => f.IsVerified),
            pendingFarmers = farmers.Count(f => !f.IsVerified),
            totalCustomers = customers.Count(),
            totalProducts = products.Count(),
            totalOrders = orders.Count()
        });
    }

    public record SetRateRequest(string ToCurrency, decimal Rate);
}