using FarmFresh.Application.Features.Orders;
using FarmFresh.Application.Interfaces;
using FarmFresh.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FarmFresh.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IUnitOfWork _unitOfWork;

    public OrdersController(IMediator mediator, IUnitOfWork unitOfWork)
    {
        _mediator = mediator;
        _unitOfWork = unitOfWork;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateOrderCommand command)
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null) return Unauthorized();
        var userId = Guid.Parse(userIdClaim);
        var cmd = command with { UserId = userId };
        var id = await _mediator.Send(cmd);
        return Ok(new { id });
    }

    [HttpGet("my/{userId}")]
    public async Task<IActionResult> GetMyOrders(Guid userId)
    {
        var result = await _mediator.Send(new GetOrdersQuery(userId));
        return Ok(result);
    }

    [HttpGet("farmer/{farmerProfileId}")]
    [Authorize(Roles = "Farmer")]
    public async Task<IActionResult> GetFarmerOrders(Guid farmerProfileId)
    {
        var subOrders = await _unitOfWork.Repository<SubOrder>().GetAllAsync();
        var farmerSubOrders = subOrders
            .Where(s => s.FarmerProfileId == farmerProfileId)
            .ToList();
        return Ok(farmerSubOrders);
    }
}