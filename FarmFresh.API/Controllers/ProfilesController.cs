using FarmFresh.Application.Features.Profiles;
using FarmFresh.Application.Interfaces;
using FarmFresh.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FarmFresh.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class ProfilesController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IUnitOfWork _unitOfWork;

    public ProfilesController(IMediator mediator, IUnitOfWork unitOfWork)
    {
        _mediator = mediator;
        _unitOfWork = unitOfWork;
    }

    [HttpPost("farmer")]
    public async Task<IActionResult> CreateFarmer(CreateFarmerProfileCommand command)
    {
        var id = await _mediator.Send(command);
        return Ok(new { id });
    }

    [HttpPost("customer")]
    public async Task<IActionResult> CreateCustomer(CreateCustomerProfileCommand command)
    {
        var id = await _mediator.Send(command);
        return Ok(new { id });
    }

    [HttpGet("farmer/{userId}")]
    public async Task<IActionResult> GetFarmer(Guid userId)
    {
        var result = await _mediator.Send(new GetFarmerProfileQuery(userId));
        return Ok(result);
    }

    [HttpGet("customer/{userId}")]
    public async Task<IActionResult> GetCustomer(Guid userId)
    {
        var result = await _mediator.Send(new GetCustomerProfileQuery(userId));
        return Ok(result);
    }

    [HttpGet("farmers")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllFarmers()
    {
        var result = await _unitOfWork.Repository<FarmerProfile>().GetAllAsync();
        return Ok(result);
    }

    [HttpPost("farmer/{id}/verify")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> VerifyFarmer(Guid id)
    {
        var all = await _unitOfWork.Repository<FarmerProfile>().GetAllAsync();
        var farmer = all.FirstOrDefault(f => f.Id == id);
        if (farmer == null) return NotFound();
        farmer.IsVerified = true;
        _unitOfWork.Repository<FarmerProfile>().Update(farmer);
        await _unitOfWork.SaveChangesAsync();
        return Ok(new { success = true });
    }

    [HttpPost("farmer/{id}/unverify")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UnverifyFarmer(Guid id)
    {
        var all = await _unitOfWork.Repository<FarmerProfile>().GetAllAsync();
        var farmer = all.FirstOrDefault(f => f.Id == id);
        if (farmer == null) return NotFound();
        farmer.IsVerified = false;
        _unitOfWork.Repository<FarmerProfile>().Update(farmer);
        await _unitOfWork.SaveChangesAsync();
        return Ok(new { success = true });
    }

    [HttpGet("customer/{userId}/addresses")]
public async Task<IActionResult> GetAddresses(Guid userId)
{
    var customer = await _mediator.Send(new GetCustomerProfileQuery(userId));
    if (customer == null) return NotFound();
    var all = await _unitOfWork.Repository<Address>().GetAllAsync();
    var addresses = all.Where(a => a.CustomerProfileId == customer.Id);
    return Ok(addresses);
}

[HttpPost("customer/address")]
public async Task<IActionResult> AddAddress([FromBody] AddAddressRequest request)
{
    var address = new Address
    {
        Id = Guid.NewGuid(),
        CustomerProfileId = request.CustomerProfileId,
        Street = request.Street,
        City = request.City,
        PostalCode = request.PostalCode
    };
    await _unitOfWork.Repository<Address>().AddAsync(address);
    await _unitOfWork.SaveChangesAsync();
    return Ok(new { id = address.Id });
}

[HttpDelete("customer/address/{id}")]
public async Task<IActionResult> DeleteAddress(Guid id)
{
    var all = await _unitOfWork.Repository<Address>().GetAllAsync();
    var address = all.FirstOrDefault(a => a.Id == id);
    if (address == null) return NotFound();
    _unitOfWork.Repository<Address>().Delete(address);
    await _unitOfWork.SaveChangesAsync();
    return Ok(new { success = true });
}

public record AddAddressRequest(Guid CustomerProfileId, string Street, string City, string PostalCode);

}
