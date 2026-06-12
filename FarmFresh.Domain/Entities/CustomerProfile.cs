namespace FarmFresh.Domain.Entities;

public class CustomerProfile
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string PreferredCurrency { get; set; } = "RSD";
    public string PreferredUnits { get; set; } = "metric";
    public string? DietaryPreferences { get; set; }
    public string? Allergies { get; set; }

    public User User { get; set; } = null!;
    public ICollection<Address> Addresses { get; set; } = new List<Address>();
}