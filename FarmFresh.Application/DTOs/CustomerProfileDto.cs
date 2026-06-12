namespace FarmFresh.Application.DTOs;

public class CustomerProfileDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string PreferredCurrency { get; set; } = "RSD";
    public string PreferredUnits { get; set; } = "metric";
    public string? DietaryPreferences { get; set; }
    public string? Allergies { get; set; }
}
