using FarmFresh.Application.Interfaces;
using FarmFresh.Domain.Entities;
using MediatR;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace FarmFresh.Application.Features.Auth;

public record RefreshTokenCommand(string RefreshToken) : IRequest<LoginResult>;

public class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, LoginResult>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IConfiguration _configuration;

    public RefreshTokenCommandHandler(IUnitOfWork unitOfWork, IConfiguration configuration)
    {
        _unitOfWork = unitOfWork;
        _configuration = configuration;
    }

    public async Task<LoginResult> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        var tokens = await _unitOfWork.Repository<RefreshToken>().GetAllAsync();
        var existing = tokens.FirstOrDefault(t => t.Token == request.RefreshToken)
            ?? throw new Exception("Invalid refresh token");

        if (existing.ExpiresAt < DateTime.UtcNow)
            throw new Exception("Refresh token expired");

        if (existing.IsRevoked)
            throw new Exception("Refresh token revoked");

        var users = await _unitOfWork.Repository<User>().GetAllAsync();
        var user = users.FirstOrDefault(u => u.Id == existing.UserId)
            ?? throw new Exception("User not found");

        // Rotacija — stari token se revokuje
        existing.IsRevoked = true;
        _unitOfWork.Repository<RefreshToken>().Update(existing);

        // Novi refresh token
        var newRefreshToken = new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Token = Convert.ToBase64String(System.Security.Cryptography.RandomNumberGenerator.GetBytes(64)),
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            IsRevoked = false
        };
        await _unitOfWork.Repository<RefreshToken>().AddAsync(newRefreshToken);
        await _unitOfWork.SaveChangesAsync();

        var accessToken = GenerateAccessToken(user, _configuration);
        return new LoginResult(accessToken, newRefreshToken.Token);
    }

    private string GenerateAccessToken(User user, IConfiguration config)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role),
            new Claim("currency", "RSD"),
            new Claim("units", "metric")
        };
        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(60),
            signingCredentials: creds);
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}