using AutoMapper;
using FarmFresh.Application.DTOs;
using FarmFresh.Application.Interfaces;
using FarmFresh.Domain.Entities;
using MediatR;

namespace FarmFresh.Application.Features.CSA;

public record GetCsaSubscriptionsQuery(Guid CustomerProfileId) : IRequest<IEnumerable<CsaSubscriptionDto>>;

public class GetCsaSubscriptionsQueryHandler : IRequestHandler<GetCsaSubscriptionsQuery, IEnumerable<CsaSubscriptionDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetCsaSubscriptionsQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<IEnumerable<CsaSubscriptionDto>> Handle(GetCsaSubscriptionsQuery request, CancellationToken cancellationToken)
    {
        var all = await _unitOfWork.Repository<CsaSubscription>().GetAllAsync();
        var filtered = all.Where(s => s.CustomerProfileId == request.CustomerProfileId);
        return _mapper.Map<IEnumerable<CsaSubscriptionDto>>(filtered);
    }
}
