namespace FarmFresh.Domain.Entities;

public class Product
{
    public Guid Id { get; set; }
    public Guid FarmerProfileId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Unit { get; set; } = string.Empty;
    public string Status { get; set; } = "Available";
    public string GrowingMethod { get; set; } = string.Empty;
    public string? Note { get; set; }
    public DateTime? AvailableFrom { get; set; }

    public string? ImageUrl { get; set; }

    public FarmerProfile FarmerProfile { get; set; } = null!;
}