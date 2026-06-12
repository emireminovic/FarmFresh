using AutoMapper;
using FarmFresh.Application.DTOs;
using FarmFresh.Application.Interfaces;
using MediatR;

namespace FarmFresh.Application.Features.CSA;

public record GetCsaBoxTemplateQuery(Guid FarmerProfileId) : IRequest<CsaBoxTemplateDto?>;

public class GetCsaBoxTemplateQueryHandler : IRequestHandler<GetCsaBoxTemplateQuery, CsaBoxTemplateDto?>
{
    private readonly ICsaRepository _csaRepository;
    private readonly IMapper _mapper;

    public GetCsaBoxTemplateQueryHandler(ICsaRepository csaRepository, IMapper mapper)
    {
        _csaRepository = csaRepository;
        _mapper = mapper;
    }

    public async Task<CsaBoxTemplateDto?> Handle(GetCsaBoxTemplateQuery request, CancellationToken cancellationToken)
    {
        var template = await _csaRepository.GetTemplateWithItemsAsync(request.FarmerProfileId);
        return template == null ? null : _mapper.Map<CsaBoxTemplateDto>(template);
    }
}
