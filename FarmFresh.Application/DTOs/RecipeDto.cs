namespace FarmFresh.Application.DTOs;

public class RecipeDto
{
    public Guid Id { get; set; }
    public Guid CustomerProfileId { get; set; }
    public Guid ProductId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Instructions { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
