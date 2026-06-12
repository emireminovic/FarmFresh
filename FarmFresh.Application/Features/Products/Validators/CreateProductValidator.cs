using FluentValidation;

namespace FarmFresh.Application.Features.Products;

public class CreateProductValidator : AbstractValidator<CreateProductCommand>
{
    public CreateProductValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Price).GreaterThan(0);
        RuleFor(x => x.Unit).NotEmpty();
        RuleFor(x => x.Category).NotEmpty();
        RuleFor(x => x.FarmerProfileId).NotEmpty();
    }
}