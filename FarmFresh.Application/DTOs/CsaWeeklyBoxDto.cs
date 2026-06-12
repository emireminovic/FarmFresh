namespace FarmFresh.Application.DTOs;

public class CsaWeeklyBoxItemDtoModel
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public decimal Quantity { get; set; }
}

public class CsaWeeklyBoxDto
{
    public Guid Id { get; set; }
    public Guid CsaSubscriptionId { get; set; }
    public int WeekNumber { get; set; }
    public DateTime DeliveryDate { get; set; }
    public List<CsaWeeklyBoxItemDtoModel> Items { get; set; } = new();
}
