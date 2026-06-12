namespace FarmFresh.Application.DTOs;

public class CsaSubscriptionDto
{
    public Guid Id { get; set; }
    public Guid CustomerProfileId { get; set; }
    public Guid FarmerProfileId { get; set; }
    public int DurationWeeks { get; set; }
    public decimal WeeklyPrice { get; set; }
    public DateTime StartDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime? PausedUntil { get; set; }
}
