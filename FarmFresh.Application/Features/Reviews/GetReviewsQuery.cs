using AutoMapper;
using FarmFresh.Application.DTOs;
using FarmFresh.Application.Interfaces;
using FarmFresh.Domain.Entities;
using MediatR;

namespace FarmFresh.Application.Features.Reviews;

public record GetReviewsQuery(Guid? ProductId, Guid? FarmerProfileId) : IRequest<IEnumerable<ReviewDto>>;

public class GetReviewsQueryHandler : IRequestHandler<GetReviewsQuery, IEnumerable<ReviewDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetReviewsQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ReviewDto>> Handle(GetReviewsQuery request, CancellationToken cancellationToken)
    {
        var all = await _unitOfWork.Repository<Review>().GetAllAsync();
        var filtered = all.Where(r =>
            (request.ProductId == null || r.ProductId == request.ProductId) &&
            (request.FarmerProfileId == null || r.FarmerProfileId == request.FarmerProfileId));
        return _mapper.Map<IEnumerable<ReviewDto>>(filtered);
    }
}
