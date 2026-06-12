using FarmFresh.Application.Features.Reviews;
using FarmFresh.Application.Interfaces;
using FarmFresh.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FarmFresh.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class ReviewsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IUnitOfWork _unitOfWork;

    public ReviewsController(IMediator mediator, IUnitOfWork unitOfWork)
    {
        _mediator = mediator;
        _unitOfWork = unitOfWork;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateReviewCommand command)
    {
        // Provjeri da li je kupac kupio proizvod
        bool isVerified = false;
        if (command.ProductId.HasValue)
        {
            var orders = await _unitOfWork.Repository<OrderItem>().GetAllAsync();
            isVerified = orders.Any(oi => oi.ProductId == command.ProductId);
        }
        var commandWithVerification = command with { IsVerifiedPurchase = isVerified };
        var id = await _mediator.Send(commandWithVerification);
        return Ok(new { id });
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> Get([FromQuery] Guid? productId, [FromQuery] Guid? farmerProfileId)
    {
        var result = await _mediator.Send(new GetReviewsQuery(productId, farmerProfileId));
        return Ok(result);
    }
}