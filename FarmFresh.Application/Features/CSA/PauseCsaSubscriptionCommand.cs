using FarmFresh.Application.Interfaces;
using FarmFresh.Domain.Entities;
using MediatR;

namespace FarmFresh.Application.Features.CSA;

public record PauseCsaSubscriptionCommand(
    Guid SubscriptionId,
    DateTime PausedUntil
) : IRequest<bool>;

public class PauseCsaSubscriptionCommandHandler : IRequestHandler<PauseCsaSubscriptionCommand, bool>
{
    private readonly IUnitOfWork _unitOfWork;

    public PauseCsaSubscriptionCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(PauseCsaSubscriptionCommand request, CancellationToken cancellationToken)
    {
        var all = await _unitOfWork.Repository<CsaSubscription>().GetAllAsync();
        var sub = all.FirstOrDefault(s => s.Id == request.SubscriptionId);
        if (sub == null) return false;

        sub.Status = "Paused";
        sub.PausedUntil = request.PausedUntil;
        _unitOfWork.Repository<CsaSubscription>().Update(sub);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }
}