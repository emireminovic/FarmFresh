namespace FarmFresh.Domain.Entities;

public class CsaWeeklyBoxItem
{
    public Guid Id { get; set; }
    public Guid CsaWeeklyBoxId { get; set; }
    public Guid ProductId { get; set; }
    public decimal Quantity { get; set; }

    public CsaWeeklyBox Box { get; set; } = null!;
    public Product Product { get; set; } = null!;
}