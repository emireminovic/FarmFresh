using AutoMapper;
using FarmFresh.Application.DTOs;
using FarmFresh.Application.Interfaces;
using FarmFresh.Domain.Entities;
using MediatR;

namespace FarmFresh.Application.Features.Orders;

public record GetOrdersQuery(Guid UserId) : IRequest<IEnumerable<OrderDto>>;

public class GetOrdersQueryHandler : IRequestHandler<GetOrdersQuery, IEnumerable<OrderDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetOrdersQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<IEnumerable<OrderDto>> Handle(GetOrdersQuery request, CancellationToken cancellationToken)
    {
        var profiles = await _unitOfWork.Repository<CustomerProfile>().GetAllAsync();
        var profile = profiles.FirstOrDefault(p => p.UserId == request.UserId);
        if (profile == null) return Enumerable.Empty<OrderDto>();

        var orders = await _unitOfWork.Repository<Order>().GetAllAsync();
        var filtered = orders.Where(o => o.CustomerProfileId == profile.Id).OrderByDescending(o => o.CreatedAt);
        return _mapper.Map<IEnumerable<OrderDto>>(filtered);
    }
}
