namespace FarmFresh.Domain.Entities;

public class Order
{
    public Guid Id { get; set; }
    public Guid CustomerProfileId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string Status { get; set; } = "Pending";
    public string DeliveryType { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public string Currency { get; set; } = "RSD";

    public CustomerProfile CustomerProfile { get; set; } = null!;
    public ICollection<SubOrder> SubOrders { get; set; } = new List<SubOrder>();
}