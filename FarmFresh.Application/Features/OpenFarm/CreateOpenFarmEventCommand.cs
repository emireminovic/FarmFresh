using FarmFresh.Application.Interfaces;
using FarmFresh.Domain.Entities;
using MediatR;

namespace FarmFresh.Application.Features.OpenFarm;

public record CreateOpenFarmEventCommand(
    Guid FarmerProfileId,
    string Title,
    string Description,
    string? Program,
    DateTime EventDate,
    int MaxVisitors,
    decimal Price
) : IRequest<Guid>;

public class CreateOpenFarmEventCommandHandler : IRequestHandler<CreateOpenFarmEventCommand, Guid>
{
    private readonly IUnitOfWork _unitOfWork;

    public CreateOpenFarmEventCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid> Handle(CreateOpenFarmEventCommand request, CancellationToken cancellationToken)
    {
        var farmEvent = new OpenFarmEvent
        {
            Id = Guid.NewGuid(),
            FarmerProfileId = request.FarmerProfileId,
            Title = request.Title,
            Description = request.Description,
            Program = request.Program,
            EventDate = request.EventDate,
            MaxVisitors = request.MaxVisitors,
            Price = request.Price,
            CurrentRegistrations = 0
        };

        await _unitOfWork.Repository<OpenFarmEvent>().AddAsync(farmEvent);
        await _unitOfWork.SaveChangesAsync();

        return farmEvent.Id;
    }
}