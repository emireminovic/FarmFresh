using FarmFresh.Application.Interfaces;
using FarmFresh.Domain.Entities;
using FarmFresh.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FarmFresh.Infrastructure.Repositories;

public class CsaRepository : ICsaRepository
{
    private readonly AppDbContext _context;

    public CsaRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<CsaBoxTemplate?> GetTemplateWithItemsAsync(Guid farmerProfileId)
    {
        return await _context.CsaBoxTemplates
            .Include(t => t.Items)
            .FirstOrDefaultAsync(t => t.FarmerProfileId == farmerProfileId);
    }

    public async Task<CsaWeeklyBox?> GetWeeklyBoxWithItemsAsync(Guid subscriptionId, int weekNumber)
    {
        return await _context.CsaWeeklyBoxes
            .Include(b => b.Items)
            .FirstOrDefaultAsync(b => b.CsaSubscriptionId == subscriptionId && b.WeekNumber == weekNumber);
    }
}