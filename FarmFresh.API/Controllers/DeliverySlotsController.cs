using FarmFresh.Application.Interfaces;
using FarmFresh.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FarmFresh.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class DeliverySlotsController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public DeliverySlotsController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    [HttpPost]
    [Authorize(Roles = "Farmer")]
    public async Task<IActionResult> Create([FromBody] CreateSlotRequest request)
    {
        var slot = new DeliverySlot
        {
            Id = Guid.NewGuid(),
            FarmerProfileId = request.FarmerProfileId,
            Type = request.Type,
            Location = request.Location,
            SlotTime = request.SlotTime,
            MaxCapacity = request.MaxCapacity,
            CurrentBookings = 0
        };
        await _unitOfWork.Repository<DeliverySlot>().AddAsync(slot);
        await _unitOfWork.SaveChangesAsync();
        return Ok(new { id = slot.Id });
    }

    [HttpGet("{farmerProfileId}")]
    [AllowAnonymous]
    public async Task<IActionResult> Get(Guid farmerProfileId)
    {
        var all = await _unitOfWork.Repository<DeliverySlot>().GetAllAsync();
        var slots = all.Where(s => s.FarmerProfileId == farmerProfileId && s.SlotTime > DateTime.UtcNow && s.CurrentBookings < s.MaxCapacity);
        return Ok(slots);
    }

    [HttpPost("{id}/book")]
    public async Task<IActionResult> Book(Guid id)
    {
        var all = await _unitOfWork.Repository<DeliverySlot>().GetAllAsync();
        var slot = all.FirstOrDefault(s => s.Id == id);
        if (slot == null) return NotFound();
        if (slot.CurrentBookings >= slot.MaxCapacity) return BadRequest(new { error = "Slot je popunjen." });
        slot.CurrentBookings++;
        _unitOfWork.Repository<DeliverySlot>().Update(slot);
        await _unitOfWork.SaveChangesAsync();
        return Ok(new { success = true });
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Farmer")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var all = await _unitOfWork.Repository<DeliverySlot>().GetAllAsync();
        var slot = all.FirstOrDefault(s => s.Id == id);
        if (slot == null) return NotFound();
        _unitOfWork.Repository<DeliverySlot>().Delete(slot);
        await _unitOfWork.SaveChangesAsync();
        return Ok(new { success = true });
    }

    public record CreateSlotRequest(Guid FarmerProfileId, string Type, string Location, DateTime SlotTime, int MaxCapacity);
}