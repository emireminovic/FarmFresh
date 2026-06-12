using FarmFresh.Application.Interfaces;
using FarmFresh.Domain.Entities;
using MediatR;

namespace FarmFresh.Application.Features.Profiles;

public record CreateFarmerProfileCommand(
    Guid UserId,
    string FarmName,
    string Description,
    string Location,
    double Latitude,
    double Longitude,
    int YearsOfWork,
    string? Certificates,
    bool IsOpenFarm,
    string? Photos
) : IRequest<Guid>;

public class CreateFarmerProfileCommandHandler : IRequestHandler<CreateFarmerProfileCommand, Guid>
{
    private readonly IUnitOfWork _unitOfWork;

    public CreateFarmerProfileCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid> Handle(CreateFarmerProfileCommand request, CancellationToken cancellationToken)
    {
        var profiles = await _unitOfWork.Repository<FarmerProfile>().GetAllAsync();
        var existing = profiles.FirstOrDefault(p => p.UserId == request.UserId);

        if (existing != null)
        {
            existing.FarmName = request.FarmName;
            existing.Description = request.Description;
            existing.Location = request.Location;
            existing.Latitude = request.Latitude;
            existing.Longitude = request.Longitude;
            existing.YearsOfWork = request.YearsOfWork;
            existing.Certificates = request.Certificates;
            existing.IsOpenFarm = request.IsOpenFarm;
            existing.Photos = request.Photos;
            _unitOfWork.Repository<FarmerProfile>().Update(existing);
            await _unitOfWork.SaveChangesAsync();
            return existing.Id;
        }

        var profile = new FarmerProfile
        {
            Id = Guid.NewGuid(),
            UserId = request.UserId,
            FarmName = request.FarmName,
            Description = request.Description,
            Location = request.Location,
            Latitude = request.Latitude,
            Longitude = request.Longitude,
            YearsOfWork = request.YearsOfWork,
            Certificates = request.Certificates,
            IsOpenFarm = request.IsOpenFarm,
            Photos = request.Photos,
            IsVerified = false
        };

        await _unitOfWork.Repository<FarmerProfile>().AddAsync(profile);
        await _unitOfWork.SaveChangesAsync();
        return profile.Id;
    }
}