using FarmFresh.Application.Interfaces;
using FarmFresh.Domain.Entities;
using MediatR;

namespace FarmFresh.Application.Features.Recipes;

public record CreateRecipeCommand(
    Guid CustomerProfileId,
    Guid ProductId,
    string Title,
    string Instructions
) : IRequest<Guid>;

public class CreateRecipeCommandHandler : IRequestHandler<CreateRecipeCommand, Guid>
{
    private readonly IUnitOfWork _unitOfWork;

    public CreateRecipeCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid> Handle(CreateRecipeCommand request, CancellationToken cancellationToken)
    {
        var recipe = new Recipe
        {
            Id = Guid.NewGuid(),
            CustomerProfileId = request.CustomerProfileId,
            ProductId = request.ProductId,
            Title = request.Title,
            Instructions = request.Instructions
        };

        await _unitOfWork.Repository<Recipe>().AddAsync(recipe);
        await _unitOfWork.SaveChangesAsync();

        return recipe.Id;
    }
}