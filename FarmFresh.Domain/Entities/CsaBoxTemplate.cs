namespace FarmFresh.Domain.Entities;

public class CsaBoxTemplate
{
    public Guid Id { get; set; }
    public Guid FarmerProfileId { get; set; }
    public string Name { get; set; } = "Standardna kutija";

    public FarmerProfile FarmerProfile { get; set; } = null!;
    public ICollection<CsaBoxTemplateItem> Items { get; set; } = new List<CsaBoxTemplateItem>();
}