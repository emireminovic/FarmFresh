using FarmFresh.Application.Interfaces;
using FarmFresh.Domain.Entities;
using MediatR;

namespace FarmFresh.Application.Features.Products;

public record CreateProductCommand(
    Guid FarmerProfileId,
    string Name,
    string Description,
    string Category,
    decimal Price,
    string Unit,
    string GrowingMethod,
    string? Note,
    string? Status,
    DateTime? AvailableFrom,
    string? ImageUrl 
) : IRequest<Guid>;

public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, Guid>
{
    private readonly IUnitOfWork _unitOfWork;

    public CreateProductCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        var product = new Product
        {
            Id = Guid.NewGuid(),
            FarmerProfileId = request.FarmerProfileId,
            Name = request.Name,
            Description = request.Description,
            Category = request.Category,
            Price = request.Price,
            Unit = request.Unit,
            GrowingMethod = request.GrowingMethod,
            Note = request.Note,
            Status = request.Status ?? "Available",
            AvailableFrom = request.AvailableFrom,
            ImageUrl = request.ImageUrl
        };

        await _unitOfWork.Repository<Product>().AddAsync(product);
        await _unitOfWork.SaveChangesAsync();

        return product.Id;
    }
}