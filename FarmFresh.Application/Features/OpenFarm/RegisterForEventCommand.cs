using FarmFresh.Application.Interfaces;
using FarmFresh.Domain.Entities;
using MediatR;

namespace FarmFresh.Application.Features.OpenFarm;

public record RegisterForEventCommand(
    Guid OpenFarmEventId,
    Guid CustomerProfileId
) : IRequest<Guid>;

public class RegisterForEventCommandHandler : IRequestHandler<RegisterForEventCommand, Guid>
{
    private readonly IUnitOfWork _unitOfWork;

    public RegisterForEventCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

   public async Task<Guid> Handle(RegisterForEventCommand request, CancellationToken cancellationToken)
{
    var events = await _unitOfWork.Repository<OpenFarmEvent>().GetAllAsync();
    var farmEvent = events.FirstOrDefault(e => e.Id == request.OpenFarmEventId)
        ?? throw new KeyNotFoundException("Event not found");

    if (farmEvent.CurrentRegistrations >= farmEvent.MaxVisitors)
        throw new Exception("Event is full");

    // ← NOVO: provjeri duplikat
    var registrations = await _unitOfWork.Repository<EventRegistration>().GetAllAsync();
    var alreadyRegistered = registrations.Any(r => 
        r.OpenFarmEventId == request.OpenFarmEventId && 
        r.CustomerProfileId == request.CustomerProfileId);
    
    if (alreadyRegistered)
        throw new Exception("Already registered");

    var registration = new EventRegistration
    {
        Id = Guid.NewGuid(),
        OpenFarmEventId = request.OpenFarmEventId,
        CustomerProfileId = request.CustomerProfileId,
        RegisteredAt = DateTime.UtcNow
    };

    farmEvent.CurrentRegistrations++;
    _unitOfWork.Repository<OpenFarmEvent>().Update(farmEvent);
    await _unitOfWork.Repository<EventRegistration>().AddAsync(registration);
    await _unitOfWork.SaveChangesAsync();

    return registration.Id;
}
}