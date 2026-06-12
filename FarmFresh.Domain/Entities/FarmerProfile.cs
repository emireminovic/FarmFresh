namespace FarmFresh.Domain.Entities;

public class FarmerProfile
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string FarmName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public int YearsOfWork { get; set; }
    public bool IsVerified { get; set; }

    public string? Photos { get; set; } 
    public string? Certificates { get; set; }
    public bool IsOpenFarm { get; set; }

    public User User { get; set; } = null!;
    public ICollection<Product> Products { get; set; } = new List<Product>();
}