namespace FarmFresh.Domain.Entities;

public class OrderItem
{
    public Guid Id { get; set; }
    public Guid SubOrderId { get; set; }
    public Guid ProductId { get; set; }
    public decimal Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public string Unit { get; set; } = string.Empty;

    public SubOrder SubOrder { get; set; } = null!;
    public Product Product { get; set; } = null!;
}