using AutoMapper;
using FarmFresh.Application.DTOs;
using FarmFresh.Application.Interfaces;
using FarmFresh.Domain.Entities;
using MediatR;

namespace FarmFresh.Application.Features.OpenFarm;

public record GetOpenFarmEventsQuery(Guid? FarmerProfileId) : IRequest<IEnumerable<OpenFarmEventDto>>;

public class GetOpenFarmEventsQueryHandler : IRequestHandler<GetOpenFarmEventsQuery, IEnumerable<OpenFarmEventDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetOpenFarmEventsQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<IEnumerable<OpenFarmEventDto>> Handle(GetOpenFarmEventsQuery request, CancellationToken cancellationToken)
    {
        var all = await _unitOfWork.Repository<OpenFarmEvent>().GetAllAsync();
        if (request.FarmerProfileId.HasValue)
            all = all.Where(e => e.FarmerProfileId == request.FarmerProfileId);
        return _mapper.Map<IEnumerable<OpenFarmEventDto>>(all);
    }
}
