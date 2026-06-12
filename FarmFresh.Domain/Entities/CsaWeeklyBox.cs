namespace FarmFresh.Domain.Entities;

public class CsaWeeklyBox
{
    public Guid Id { get; set; }
    public Guid CsaSubscriptionId { get; set; }
    public int WeekNumber { get; set; }
    public DateTime DeliveryDate { get; set; }

    public CsaSubscription Subscription { get; set; } = null!;
    public ICollection<CsaWeeklyBoxItem> Items { get; set; } = new List<CsaWeeklyBoxItem>();
}