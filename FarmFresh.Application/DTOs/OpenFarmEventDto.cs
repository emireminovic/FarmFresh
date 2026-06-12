namespace FarmFresh.Application.DTOs;

public class OpenFarmEventDto
{
    public Guid Id { get; set; }
    public Guid FarmerProfileId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Program { get; set; }
    public DateTime EventDate { get; set; }
    public int MaxVisitors { get; set; }
    public decimal Price { get; set; }
    public int CurrentRegistrations { get; set; }
}
