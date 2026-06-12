namespace FarmFresh.Domain.Entities;

public class EventReview
{
    public Guid Id { get; set; }
    public Guid OpenFarmEventId { get; set; }
    public Guid CustomerProfileId { get; set; }
    public string Comment { get; set; } = string.Empty;
    public string? PhotoUrl { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public OpenFarmEvent OpenFarmEvent { get; set; } = null!;
    public CustomerProfile CustomerProfile { get; set; } = null!;
}