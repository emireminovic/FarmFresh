using FarmFresh.Application.Interfaces;
using FarmFresh.Domain.Entities;
using MediatR;

namespace FarmFresh.Application.Features.CSA;

public record UpdateCsaWeeklyBoxCommand(
    Guid SubscriptionId,
    int WeekNumber,
    DateTime DeliveryDate,
    List<CsaWeeklyBoxItemDto> Items
) : IRequest<Guid>;

public record CsaWeeklyBoxItemDto(Guid ProductId, decimal Quantity);

public class UpdateCsaWeeklyBoxCommandHandler : IRequestHandler<UpdateCsaWeeklyBoxCommand, Guid>
{
    private readonly IUnitOfWork _unitOfWork;

    public UpdateCsaWeeklyBoxCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid> Handle(UpdateCsaWeeklyBoxCommand request, CancellationToken cancellationToken)
    {
        var boxes = await _unitOfWork.Repository<CsaWeeklyBox>().GetAllAsync();
        var existing = boxes.FirstOrDefault(b =>
            b.CsaSubscriptionId == request.SubscriptionId &&
            b.WeekNumber == request.WeekNumber);

        if (existing != null)
        {
            // Obrisi stare stavke
            var oldItems = await _unitOfWork.Repository<CsaWeeklyBoxItem>().GetAllAsync();
            foreach (var item in oldItems.Where(i => i.CsaWeeklyBoxId == existing.Id))
                _unitOfWork.Repository<CsaWeeklyBoxItem>().Delete(item);

            // Dodaj nove stavke
            foreach (var item in request.Items)
                await _unitOfWork.Repository<CsaWeeklyBoxItem>().AddAsync(new CsaWeeklyBoxItem
                {
                    Id = Guid.NewGuid(),
                    CsaWeeklyBoxId = existing.Id,
                    ProductId = item.ProductId,
                    Quantity = item.Quantity
                });

            await _unitOfWork.SaveChangesAsync();
            return existing.Id;
        }
        else
        {
            // Kreiraj novu kutiju
            var box = new CsaWeeklyBox
            {
                Id = Guid.NewGuid(),
                CsaSubscriptionId = request.SubscriptionId,
                WeekNumber = request.WeekNumber,
                DeliveryDate = request.DeliveryDate,
                Items = request.Items.Select(i => new CsaWeeklyBoxItem
                {
                    Id = Guid.NewGuid(),
                    ProductId = i.ProductId,
                    Quantity = i.Quantity
                }).ToList()
            };

            await _unitOfWork.Repository<CsaWeeklyBox>().AddAsync(box);
            await _unitOfWork.SaveChangesAsync();
            return box.Id;
        }
    }
}