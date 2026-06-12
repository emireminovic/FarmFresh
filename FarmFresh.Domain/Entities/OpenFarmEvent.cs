namespace FarmFresh.Domain.Entities;

public class OpenFarmEvent
{
    public Guid Id { get; set; }
    public Guid FarmerProfileId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime EventDate { get; set; }
    public int MaxVisitors { get; set; }
    public decimal Price { get; set; }
    public int CurrentRegistrations { get; set; }

    public FarmerProfile FarmerProfile { get; set; } = null!;
    public ICollection<EventRegistration> Registrations { get; set; } = new List<EventRegistration>();

    public string? Program { get; set; }
    public ICollection<EventReview> Reviews { get; set; } = new List<EventReview>();

}