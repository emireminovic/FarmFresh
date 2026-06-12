namespace FarmFresh.Domain.Entities;

public class Address
{
    public Guid Id { get; set; }
    public Guid CustomerProfileId { get; set; }
    public string Street { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;

    public CustomerProfile CustomerProfile { get; set; } = null!;
}