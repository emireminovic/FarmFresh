namespace FarmFresh.Domain.Entities;

public class SubOrder
{
    public Guid Id { get; set; }
    public Guid OrderId { get; set; }
    public Guid FarmerProfileId { get; set; }
    public string DeliveryType { get; set; } = string.Empty;
    public string Status { get; set; } = "Pending";
    public decimal TotalAmount { get; set; }

    public Order Order { get; set; } = null!;
    public FarmerProfile FarmerProfile { get; set; } = null!;
    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}