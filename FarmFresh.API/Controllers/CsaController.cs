using FarmFresh.Application.Features.CSA;
using FarmFresh.Application.Interfaces;
using FarmFresh.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FarmFresh.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class CsaController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IUnitOfWork _unitOfWork;

    public CsaController(IMediator mediator, IUnitOfWork unitOfWork)
    {
        _mediator = mediator;
        _unitOfWork = unitOfWork;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateCsaSubscriptionCommand command)
    {
        var id = await _mediator.Send(command);
        return Ok(new { id });
    }

    [HttpGet("{customerProfileId}")]
    public async Task<IActionResult> Get(Guid customerProfileId)
    {
        var result = await _mediator.Send(new GetCsaSubscriptionsQuery(customerProfileId));
        return Ok(result);
    }

    [HttpPost("{id}/pause")]
    public async Task<IActionResult> Pause(Guid id, [FromBody] DateTime pausedUntil)
    {
        var result = await _mediator.Send(new PauseCsaSubscriptionCommand(id, pausedUntil));
        if (!result) return NotFound();
        return Ok(new { success = true });
    }

    [HttpPost("{id}/cancel")]
    public async Task<IActionResult> Cancel(Guid id)
    {
        var result = await _mediator.Send(new CancelCsaSubscriptionCommand(id));
        if (!result) return NotFound();
        return Ok(new { success = true });
    }

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var all = await _unitOfWork.Repository<CsaSubscription>().GetAllAsync();
        var sub = all.FirstOrDefault(s => s.Id == id);
        if (sub == null) return NotFound();
        if (sub.Status != "Cancelled") return BadRequest(new { error = "Možete obrisati samo otkazane pretplate." });
        _unitOfWork.Repository<CsaSubscription>().Delete(sub);
        await _unitOfWork.SaveChangesAsync();
        return Ok(new { success = true });
    }

    [HttpGet("{subscriptionId}/box/{weekNumber}")]
    public async Task<IActionResult> GetWeeklyBox(Guid subscriptionId, int weekNumber)
    {
        var result = await _mediator.Send(new GetCsaWeeklyBoxQuery(subscriptionId, weekNumber));
        return Ok(result);
    }

    [HttpPost("{subscriptionId}/box/{weekNumber}")]
    public async Task<IActionResult> UpdateWeeklyBox(
        Guid subscriptionId,
        int weekNumber,
        [FromBody] UpdateWeeklyBoxRequest request)
    {
        var id = await _mediator.Send(new UpdateCsaWeeklyBoxCommand(
            subscriptionId,
            weekNumber,
            request.DeliveryDate,
            request.Items
        ));
        return Ok(new { id });
    }

    [HttpGet("template/{farmerProfileId}")]
    public async Task<IActionResult> GetTemplate(Guid farmerProfileId)
    {
        var result = await _mediator.Send(new GetCsaBoxTemplateQuery(farmerProfileId));
        return Ok(result);
    }

    [HttpPost("template")]
    [Authorize(Roles = "Farmer")]
    public async Task<IActionResult> SaveTemplate([FromBody] SaveTemplateRequest request)
    {
        var id = await _mediator.Send(new SaveCsaBoxTemplateCommand(
            request.FarmerProfileId,
            request.Name,
            request.Items
        ));
        return Ok(new { id });
    }

    public record UpdateWeeklyBoxRequest(DateTime DeliveryDate, List<CsaWeeklyBoxItemDto> Items);
    public record SaveTemplateRequest(Guid FarmerProfileId, string Name, List<CsaBoxTemplateItemDto> Items);
}
