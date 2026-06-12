namespace FarmFresh.Application.DTOs;

public class ReviewDto
{
    public Guid Id { get; set; }
    public Guid CustomerProfileId { get; set; }
    public Guid? ProductId { get; set; }
    public Guid? FarmerProfileId { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public bool IsVerifiedPurchase { get; set; }
    public string? PhotoUrl { get; set; }
    public DateTime CreatedAt { get; set; }
}
