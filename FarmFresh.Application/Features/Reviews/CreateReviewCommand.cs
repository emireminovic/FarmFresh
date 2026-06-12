using FarmFresh.Application.Interfaces;
using FarmFresh.Domain.Entities;
using MediatR;

namespace FarmFresh.Application.Features.Reviews;

public record CreateReviewCommand(
    Guid CustomerProfileId,
    Guid? ProductId,
    Guid? FarmerProfileId,
    int Rating,
    string Comment,
    bool IsVerifiedPurchase,
    string? PhotoUrl
) : IRequest<Guid>;

public class CreateReviewCommandHandler : IRequestHandler<CreateReviewCommand, Guid>
{
    private readonly IUnitOfWork _unitOfWork;

    public CreateReviewCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid> Handle(CreateReviewCommand request, CancellationToken cancellationToken)
    {
        var review = new Review
        {
            Id = Guid.NewGuid(),
            CustomerProfileId = request.CustomerProfileId,
            ProductId = request.ProductId,
            FarmerProfileId = request.FarmerProfileId,
            Rating = request.Rating,
            Comment = request.Comment,
            IsVerifiedPurchase = request.IsVerifiedPurchase,
            PhotoUrl = request.PhotoUrl
        };

        await _unitOfWork.Repository<Review>().AddAsync(review);
        await _unitOfWork.SaveChangesAsync();

        return review.Id;
    }
}