using FarmFresh.Application.Interfaces;
using FarmFresh.Domain.Entities;
using MediatR;

namespace FarmFresh.Application.Features.CSA;

public record CreateCsaSubscriptionCommand(
    Guid CustomerProfileId,
    Guid FarmerProfileId,
    int DurationWeeks,
    decimal WeeklyPrice,
    DateTime StartDate
) : IRequest<Guid>;

public class CreateCsaSubscriptionCommandHandler : IRequestHandler<CreateCsaSubscriptionCommand, Guid>
{
    private readonly IUnitOfWork _unitOfWork;

    public CreateCsaSubscriptionCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid> Handle(CreateCsaSubscriptionCommand request, CancellationToken cancellationToken)
    {
        var subscription = new CsaSubscription
        {
            Id = Guid.NewGuid(),
            CustomerProfileId = request.CustomerProfileId,
            FarmerProfileId = request.FarmerProfileId,
            DurationWeeks = request.DurationWeeks,
            WeeklyPrice = request.WeeklyPrice,
            StartDate = request.StartDate,
            Status = "Active"
        };

        await _unitOfWork.Repository<CsaSubscription>().AddAsync(subscription);

        // Auto-popuni nedelje farmer-ovim templateom ako postoji
        var templates = await _unitOfWork.Repository<CsaBoxTemplate>().GetAllAsync();
        var template = templates.FirstOrDefault(t => t.FarmerProfileId == request.FarmerProfileId);

        if (template != null)
        {
            var templateItems = await _unitOfWork.Repository<CsaBoxTemplateItem>().GetAllAsync();
            var items = templateItems.Where(i => i.CsaBoxTemplateId == template.Id).ToList();

            for (int week = 1; week <= request.DurationWeeks; week++)
            {
                var deliveryDate = request.StartDate.AddDays((week - 1) * 7);
                var box = new CsaWeeklyBox
                {
                    Id = Guid.NewGuid(),
                    CsaSubscriptionId = subscription.Id,
                    WeekNumber = week,
                    DeliveryDate = deliveryDate,
                    Items = items.Select(i => new CsaWeeklyBoxItem
                    {
                        Id = Guid.NewGuid(),
                        ProductId = i.ProductId,
                        Quantity = i.Quantity
                    }).ToList()
                };
                await _unitOfWork.Repository<CsaWeeklyBox>().AddAsync(box);
            }
        }

        await _unitOfWork.SaveChangesAsync();
        return subscription.Id;
    }
}
