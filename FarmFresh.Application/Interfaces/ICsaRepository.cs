using FarmFresh.Domain.Entities;

namespace FarmFresh.Application.Interfaces;

public interface ICsaRepository
{
    Task<CsaBoxTemplate?> GetTemplateWithItemsAsync(Guid farmerProfileId);
    Task<CsaWeeklyBox?> GetWeeklyBoxWithItemsAsync(Guid subscriptionId, int weekNumber);
}