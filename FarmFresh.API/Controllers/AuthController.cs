using FarmFresh.Application.Features.Auth;
using FarmFresh.Application.Interfaces;
using FarmFresh.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FarmFresh.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IUnitOfWork _unitOfWork;

    public AuthController(IMediator mediator, IUnitOfWork unitOfWork)
    {
        _mediator = mediator;
        _unitOfWork = unitOfWork;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterCommand command)
    {
        var id = await _mediator.Send(command);
        return Ok(new { id });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] string refreshToken)
    {
        var result = await _mediator.Send(new RefreshTokenCommand(refreshToken));
        return Ok(result);
    }

    [HttpPost("revoke")]
    [Authorize]
    public async Task<IActionResult> Revoke([FromBody] string refreshToken)
    {
        var tokens = await _unitOfWork.Repository<RefreshToken>().GetAllAsync();
        var token = tokens.FirstOrDefault(t => t.Token == refreshToken);
        if (token == null) return NotFound();
        token.IsRevoked = true;
        _unitOfWork.Repository<RefreshToken>().Update(token);
        await _unitOfWork.SaveChangesAsync();
        return Ok(new { success = true });
    }
}