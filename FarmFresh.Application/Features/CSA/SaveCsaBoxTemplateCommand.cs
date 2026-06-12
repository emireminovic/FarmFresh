using FarmFresh.Application.Interfaces;
using FarmFresh.Domain.Entities;
using MediatR;

namespace FarmFresh.Application.Features.CSA;

public record SaveCsaBoxTemplateCommand(
    Guid FarmerProfileId,
    string Name,
    List<CsaBoxTemplateItemDto> Items
) : IRequest<Guid>;

public record CsaBoxTemplateItemDto(Guid ProductId, decimal Quantity);

public class SaveCsaBoxTemplateCommandHandler : IRequestHandler<SaveCsaBoxTemplateCommand, Guid>
{
    private readonly IUnitOfWork _unitOfWork;

    public SaveCsaBoxTemplateCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid> Handle(SaveCsaBoxTemplateCommand request, CancellationToken cancellationToken)
    {
        var all = await _unitOfWork.Repository<CsaBoxTemplate>().GetAllAsync();
        var existing = all.FirstOrDefault(t => t.FarmerProfileId == request.FarmerProfileId);

        if (existing != null)
        {
            // Obrisi stare stavke
            var oldItems = await _unitOfWork.Repository<CsaBoxTemplateItem>().GetAllAsync();
            foreach (var item in oldItems.Where(i => i.CsaBoxTemplateId == existing.Id))
                _unitOfWork.Repository<CsaBoxTemplateItem>().Delete(item);

            existing.Name = request.Name;
            _unitOfWork.Repository<CsaBoxTemplate>().Update(existing);

            foreach (var item in request.Items)
                await _unitOfWork.Repository<CsaBoxTemplateItem>().AddAsync(new CsaBoxTemplateItem
                {
                    Id = Guid.NewGuid(),
                    CsaBoxTemplateId = existing.Id,
                    ProductId = item.ProductId,
                    Quantity = item.Quantity
                });

            await _unitOfWork.SaveChangesAsync();
            return existing.Id;
        }
        else
        {
            var template = new CsaBoxTemplate
            {
                Id = Guid.NewGuid(),
                FarmerProfileId = request.FarmerProfileId,
                Name = request.Name,
                Items = request.Items.Select(i => new CsaBoxTemplateItem
                {
                    Id = Guid.NewGuid(),
                    ProductId = i.ProductId,
                    Quantity = i.Quantity
                }).ToList()
            };

            await _unitOfWork.Repository<CsaBoxTemplate>().AddAsync(template);
            await _unitOfWork.SaveChangesAsync();
            return template.Id;
        }
    }
}