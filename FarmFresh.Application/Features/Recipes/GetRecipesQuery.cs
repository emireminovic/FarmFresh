using AutoMapper;
using FarmFresh.Application.DTOs;
using FarmFresh.Application.Interfaces;
using FarmFresh.Domain.Entities;
using MediatR;

namespace FarmFresh.Application.Features.Recipes;

public record GetRecipesQuery(Guid ProductId) : IRequest<IEnumerable<RecipeDto>>;

public class GetRecipesQueryHandler : IRequestHandler<GetRecipesQuery, IEnumerable<RecipeDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetRecipesQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<IEnumerable<RecipeDto>> Handle(GetRecipesQuery request, CancellationToken cancellationToken)
    {
        var all = await _unitOfWork.Repository<Recipe>().GetAllAsync();
        if (request.ProductId == Guid.Empty) return _mapper.Map<IEnumerable<RecipeDto>>(all);
        return _mapper.Map<IEnumerable<RecipeDto>>(all.Where(r => r.ProductId == request.ProductId));
    }
}
