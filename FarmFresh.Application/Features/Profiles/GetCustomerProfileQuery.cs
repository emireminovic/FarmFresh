using AutoMapper;
using FarmFresh.Application.DTOs;
using FarmFresh.Application.Interfaces;
using FarmFresh.Domain.Entities;
using MediatR;

namespace FarmFresh.Application.Features.Profiles;

public record GetCustomerProfileQuery(Guid UserId) : IRequest<CustomerProfileDto?>;

public class GetCustomerProfileQueryHandler : IRequestHandler<GetCustomerProfileQuery, CustomerProfileDto?>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetCustomerProfileQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<CustomerProfileDto?> Handle(GetCustomerProfileQuery request, CancellationToken cancellationToken)
    {
        var all = await _unitOfWork.Repository<CustomerProfile>().GetAllAsync();
        var profile = all.FirstOrDefault(c => c.UserId == request.UserId);
        return profile == null ? null : _mapper.Map<CustomerProfileDto>(profile);
    }
}
