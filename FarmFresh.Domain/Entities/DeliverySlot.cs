namespace FarmFresh.Domain.Entities;

public class DeliverySlot
{
    public Guid Id { get; set; }
    public Guid FarmerProfileId { get; set; }
    public string Type { get; set; } = string.Empty; // FarmPickup, DropPoint, HomeDelivery
    public string Location { get; set; } = string.Empty;
    public DateTime SlotTime { get; set; }
    public int MaxCapacity { get; set; }
    public int CurrentBookings { get; set; }

    public FarmerProfile FarmerProfile { get; set; } = null!;
}