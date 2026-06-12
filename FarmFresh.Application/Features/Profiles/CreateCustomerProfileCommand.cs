using FarmFresh.Application.Interfaces;
using FarmFresh.Domain.Entities;
using MediatR;

namespace FarmFresh.Application.Features.Profiles;

public record CreateCustomerProfileCommand(
    Guid UserId,
    string FullName,
    string PreferredCurrency,
    string PreferredUnits,
    string? DietaryPreferences,
    string? Allergies
) : IRequest<Guid>;

public class CreateCustomerProfileCommandHandler : IRequestHandler<CreateCustomerProfileCommand, Guid>
{
    private readonly IUnitOfWork _unitOfWork;

    public CreateCustomerProfileCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid> Handle(CreateCustomerProfileCommand request, CancellationToken cancellationToken)
{
    var profiles = await _unitOfWork.Repository<CustomerProfile>().GetAllAsync();
    var existing = profiles.FirstOrDefault(p => p.UserId == request.UserId);

    if (existing != null)
    {
        existing.FullName = request.FullName;
        existing.PreferredCurrency = request.PreferredCurrency;
        existing.PreferredUnits = request.PreferredUnits;
        existing.DietaryPreferences = request.DietaryPreferences;
        existing.Allergies = request.Allergies;
        _unitOfWork.Repository<CustomerProfile>().Update(existing);
        await _unitOfWork.SaveChangesAsync();
        return existing.Id;
    }

    var profile = new CustomerProfile
    {
        Id = Guid.NewGuid(),
        UserId = request.UserId,
        FullName = request.FullName,
        PreferredCurrency = request.PreferredCurrency,
        PreferredUnits = request.PreferredUnits,
        DietaryPreferences = request.DietaryPreferences,
        Allergies = request.Allergies
    };

    await _unitOfWork.Repository<CustomerProfile>().AddAsync(profile);
    await _unitOfWork.SaveChangesAsync();
    return profile.Id;
}
}