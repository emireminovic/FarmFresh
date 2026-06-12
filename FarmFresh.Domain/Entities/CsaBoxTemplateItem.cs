namespace FarmFresh.Domain.Entities;

public class CsaBoxTemplateItem
{
    public Guid Id { get; set; }
    public Guid CsaBoxTemplateId { get; set; }
    public Guid ProductId { get; set; }
    public decimal Quantity { get; set; }

    public CsaBoxTemplate Template { get; set; } = null!;
    public Product Product { get; set; } = null!;
}