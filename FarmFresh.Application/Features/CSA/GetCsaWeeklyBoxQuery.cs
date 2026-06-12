using AutoMapper;
using FarmFresh.Application.DTOs;
using FarmFresh.Application.Interfaces;
using MediatR;

namespace FarmFresh.Application.Features.CSA;

public record GetCsaWeeklyBoxQuery(Guid SubscriptionId, int WeekNumber) : IRequest<CsaWeeklyBoxDto?>;

public class GetCsaWeeklyBoxQueryHandler : IRequestHandler<GetCsaWeeklyBoxQuery, CsaWeeklyBoxDto?>
{
    private readonly ICsaRepository _csaRepository;
    private readonly IMapper _mapper;

    public GetCsaWeeklyBoxQueryHandler(ICsaRepository csaRepository, IMapper mapper)
    {
        _csaRepository = csaRepository;
        _mapper = mapper;
    }

    public async Task<CsaWeeklyBoxDto?> Handle(GetCsaWeeklyBoxQuery request, CancellationToken cancellationToken)
    {
        var box = await _csaRepository.GetWeeklyBoxWithItemsAsync(request.SubscriptionId, request.WeekNumber);
        return box == null ? null : _mapper.Map<CsaWeeklyBoxDto>(box);
    }
}
