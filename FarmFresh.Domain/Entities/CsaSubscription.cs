namespace FarmFresh.Domain.Entities;

public class CsaSubscription
{
    public Guid Id { get; set; }
    public Guid CustomerProfileId { get; set; }
    public Guid FarmerProfileId { get; set; }
    public int DurationWeeks { get; set; } // 3, 6, ili 12
    public decimal WeeklyPrice { get; set; }
    public string Status { get; set; } = "Active"; // Active, Paused, Cancelled
    public DateTime StartDate { get; set; }
    public DateTime? PausedUntil { get; set; }

    public CustomerProfile CustomerProfile { get; set; } = null!;
    public FarmerProfile FarmerProfile { get; set; } = null!;

    public ICollection<CsaWeeklyBox> WeeklyBoxes { get; set; } = new List<CsaWeeklyBox>();
}