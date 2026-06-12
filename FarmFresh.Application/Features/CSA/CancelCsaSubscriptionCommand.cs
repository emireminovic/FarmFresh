using FarmFresh.Application.Interfaces;
using FarmFresh.Domain.Entities;
using MediatR;

namespace FarmFresh.Application.Features.CSA;

public record CancelCsaSubscriptionCommand(Guid SubscriptionId) : IRequest<bool>;

public class CancelCsaSubscriptionCommandHandler : IRequestHandler<CancelCsaSubscriptionCommand, bool>
{
    private readonly IUnitOfWork _unitOfWork;

    public CancelCsaSubscriptionCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(CancelCsaSubscriptionCommand request, CancellationToken cancellationToken)
    {
        var all = await _unitOfWork.Repository<CsaSubscription>().GetAllAsync();
        var sub = all.FirstOrDefault(s => s.Id == request.SubscriptionId);
        if (sub == null) return false;

        sub.Status = "Cancelled";
        sub.PausedUntil = null;
        _unitOfWork.Repository<CsaSubscription>().Update(sub);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }
}