using FarmFresh.Application.Interfaces;
using FarmFresh.Domain.Entities;
using MediatR;

namespace FarmFresh.Application.Features.OpenFarm;

public record AddEventReviewCommand(
    Guid OpenFarmEventId,
    Guid CustomerProfileId,
    string Comment,
    string? PhotoUrl
) : IRequest<Guid>;

public class AddEventReviewCommandHandler : IRequestHandler<AddEventReviewCommand, Guid>
{
    private readonly IUnitOfWork _unitOfWork;

    public AddEventReviewCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid> Handle(AddEventReviewCommand request, CancellationToken cancellationToken)
    {
        var review = new EventReview
        {
            Id = Guid.NewGuid(),
            OpenFarmEventId = request.OpenFarmEventId,
            CustomerProfileId = request.CustomerProfileId,
            Comment = request.Comment,
            PhotoUrl = request.PhotoUrl,
            CreatedAt = DateTime.UtcNow
        };

        await _unitOfWork.Repository<EventReview>().AddAsync(review);
        await _unitOfWork.SaveChangesAsync();
        return review.Id;
    }
}