using FarmFresh.Application.Features.Products;
using FarmFresh.Application.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FarmFresh.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class ProductsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IUnitOfWork _unitOfWork;

    public ProductsController(IMediator mediator, IUnitOfWork unitOfWork)
    {
        _mediator = mediator;
        _unitOfWork = unitOfWork;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll()
    {
        var products = await _mediator.Send(new GetProductsQuery());
        return Ok(products);
    }

    [HttpPost]
    [Authorize(Roles = "Farmer")]
    public async Task<IActionResult> Create(CreateProductCommand command)
    {
        var id = await _mediator.Send(command);
        return Ok(new { id });
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid id)
    {
        var products = await _unitOfWork.Repository<FarmFresh.Domain.Entities.Product>().GetAllAsync();
        var product = products.FirstOrDefault(p => p.Id == id);
        if (product == null) return NotFound();
        _unitOfWork.Repository<FarmFresh.Domain.Entities.Product>().Delete(product);
        await _unitOfWork.SaveChangesAsync();
        return Ok(new { success = true });
    }
}