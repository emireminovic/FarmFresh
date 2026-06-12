namespace FarmFresh.Domain.Entities;

public class Recipe
{
    public Guid Id { get; set; }
    public Guid CustomerProfileId { get; set; }
    public Guid ProductId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Instructions { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public CustomerProfile CustomerProfile { get; set; } = null!;
    public Product Product { get; set; } = null!;
}