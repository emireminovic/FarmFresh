namespace FarmFresh.Application.DTOs;

public class OrderDto
{
    public Guid Id { get; set; }
    public Guid CustomerProfileId { get; set; }
    public string Status { get; set; } = string.Empty;
    public string DeliveryType { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public string Currency { get; set; } = "RSD";
    public DateTime CreatedAt { get; set; }
}
