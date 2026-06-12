namespace FarmFresh.Application.DTOs;

public class CsaBoxTemplateItemDtoModel
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public decimal Quantity { get; set; }
}

public class CsaBoxTemplateDto
{
    public Guid Id { get; set; }
    public Guid FarmerProfileId { get; set; }
    public string Name { get; set; } = string.Empty;
    public List<CsaBoxTemplateItemDtoModel> Items { get; set; } = new();
}
