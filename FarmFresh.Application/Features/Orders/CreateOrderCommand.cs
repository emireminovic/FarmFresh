using FarmFresh.Application.Interfaces;
using FarmFresh.Domain.Entities;
using MediatR;

namespace FarmFresh.Application.Features.Orders;

public record CreateOrderCommand(
    string DeliveryType,
    string Currency,
    Guid UserId,
    List<OrderItemDto> Items
) : IRequest<Guid>;

public record OrderItemDto(
    Guid ProductId,
    Guid FarmerProfileId,
    decimal Quantity,
    decimal UnitPrice,
    string Unit
);

public class CreateOrderCommandHandler : IRequestHandler<CreateOrderCommand, Guid>
{
    private readonly IUnitOfWork _unitOfWork;

    public CreateOrderCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
    {
        var profiles = await _unitOfWork.Repository<CustomerProfile>().GetAllAsync();
        var profile = profiles.FirstOrDefault(p => p.UserId == request.UserId);

        if (profile == null)
        {
            profile = new CustomerProfile
            {
                Id = Guid.NewGuid(),
                UserId = request.UserId,
                FullName = "Korisnik",
                PreferredCurrency = request.Currency,
                PreferredUnits = "metric"
            };
            await _unitOfWork.Repository<CustomerProfile>().AddAsync(profile);
            await _unitOfWork.SaveChangesAsync();
        }

        
        decimal rate = 1m;
        if (request.Currency != "RSD")
        {
            var exchangeRates = await _unitOfWork.Repository<ExchangeRate>().GetAllAsync();
            var rateEntity = exchangeRates.FirstOrDefault(r => r.ToCurrency == request.Currency);
            if (rateEntity != null)
                rate = rateEntity.Rate;
            else
                rate = request.Currency == "EUR" ? 0.0085m : request.Currency == "USD" ? 0.0092m : 1m;
        }

        
        var itemsInRsd = request.Items.Select(i => i with
        {
            UnitPrice = Math.Round(i.UnitPrice / rate, 2)
        }).ToList();

        var order = new Order
        {
            Id = Guid.NewGuid(),
            CustomerProfileId = profile.Id,
            DeliveryType = request.DeliveryType,
            Currency = "RSD",
            Status = "Pending",
            TotalAmount = itemsInRsd.Sum(i => i.Quantity * i.UnitPrice)
        };

        var subOrders = itemsInRsd
            .GroupBy(i => i.FarmerProfileId)
            .Select(g => new SubOrder
            {
                Id = Guid.NewGuid(),
                OrderId = order.Id,
                FarmerProfileId = g.Key,
                DeliveryType = request.DeliveryType,
                Status = "Pending",
                TotalAmount = g.Sum(i => i.Quantity * i.UnitPrice),
                Items = g.Select(i => new OrderItem
                {
                    Id = Guid.NewGuid(),
                    ProductId = i.ProductId,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice,
                    Unit = i.Unit
                }).ToList()
            }).ToList();

        order.SubOrders = subOrders;

        await _unitOfWork.Repository<Order>().AddAsync(order);
        await _unitOfWork.SaveChangesAsync();

        return order.Id;
    }
}