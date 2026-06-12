using FarmFresh.Application.Features.Orders;
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

    public OrdersController(IMediator mediator)
    {
        _mediator = mediator;
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
}