namespace FarmFresh.Domain.Entities;

public class EventRegistration
{
    public Guid Id { get; set; }
    public Guid OpenFarmEventId { get; set; }
    public Guid CustomerProfileId { get; set; }
    public DateTime RegisteredAt { get; set; } = DateTime.UtcNow;

    public OpenFarmEvent OpenFarmEvent { get; set; } = null!;
    public CustomerProfile CustomerProfile { get; set; } = null!;
}