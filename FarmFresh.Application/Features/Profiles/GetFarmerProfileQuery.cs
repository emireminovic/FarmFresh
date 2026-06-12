using AutoMapper;
using FarmFresh.Application.DTOs;
using FarmFresh.Application.Interfaces;
using FarmFresh.Domain.Entities;
using MediatR;

namespace FarmFresh.Application.Features.Profiles;

public record GetFarmerProfileQuery(Guid UserId) : IRequest<FarmerProfileDto?>;

public class GetFarmerProfileQueryHandler : IRequestHandler<GetFarmerProfileQuery, FarmerProfileDto?>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetFarmerProfileQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<FarmerProfileDto?> Handle(GetFarmerProfileQuery request, CancellationToken cancellationToken)
    {
        var all = await _unitOfWork.Repository<FarmerProfile>().GetAllAsync();
        var profile = all.FirstOrDefault(f => f.UserId == request.UserId);
        return profile == null ? null : _mapper.Map<FarmerProfileDto>(profile);
    }
}
