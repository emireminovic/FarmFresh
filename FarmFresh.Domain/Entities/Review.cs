namespace FarmFresh.Domain.Entities;

public class Review
{
    public Guid Id { get; set; }
    public Guid CustomerProfileId { get; set; }
    public Guid? ProductId { get; set; }
    public Guid? FarmerProfileId { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public bool IsVerifiedPurchase { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public CustomerProfile CustomerProfile { get; set; } = null!;
    public Product? Product { get; set; }
    public FarmerProfile? FarmerProfile { get; set; }
    public string? PhotoUrl { get; set; }
    
}