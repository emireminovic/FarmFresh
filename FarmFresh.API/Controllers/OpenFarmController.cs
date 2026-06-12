using FarmFresh.Application.Features.OpenFarm;
using FarmFresh.Application.Interfaces;
using FarmFresh.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FarmFresh.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class OpenFarmController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IUnitOfWork _unitOfWork;

    public OpenFarmController(IMediator mediator, IUnitOfWork unitOfWork)
    {
        _mediator = mediator;
        _unitOfWork = unitOfWork;
    }

    [HttpPost]
    [Authorize(Roles = "Farmer")]
    public async Task<IActionResult> Create(CreateOpenFarmEventCommand command)
    {
        var id = await _mediator.Send(command);
        return Ok(new { id });
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> Get([FromQuery] Guid? farmerProfileId)
    {
        var result = await _mediator.Send(new GetOpenFarmEventsQuery(farmerProfileId));
        return Ok(result);
    }

    [HttpPost("{eventId}/register")]
    public async Task<IActionResult> Register(Guid eventId, [FromBody] Guid customerProfileId)
    {
        var id = await _mediator.Send(new RegisterForEventCommand(eventId, customerProfileId));
        return Ok(new { id });
    }

    [HttpPost("{eventId}/review")]
    public async Task<IActionResult> AddReview(Guid eventId, [FromBody] AddReviewRequest request)
    {
        var id = await _mediator.Send(new AddEventReviewCommand(
            eventId,
            request.CustomerProfileId,
            request.Comment,
            request.PhotoUrl
        ));
        return Ok(new { id });
    }

    [HttpGet("{eventId}/reviews")]
    [AllowAnonymous]
    public async Task<IActionResult> GetReviews(Guid eventId)
    {
        var all = await _unitOfWork.Repository<EventReview>().GetAllAsync();
        var reviews = all.Where(r => r.OpenFarmEventId == eventId);
        return Ok(reviews);
    }

    public record AddReviewRequest(Guid CustomerProfileId, string Comment, string? PhotoUrl);


    [HttpGet("my-registrations/{customerProfileId}")]
    public async Task<IActionResult> GetMyRegistrations(Guid customerProfileId)
    {
    var all = await _unitOfWork.Repository<FarmFresh.Domain.Entities.EventRegistration>().GetAllAsync();
    var eventIds = all
        .Where(r => r.CustomerProfileId == customerProfileId)
        .Select(r => r.OpenFarmEventId)
        .ToList();
    return Ok(eventIds);
    }


}