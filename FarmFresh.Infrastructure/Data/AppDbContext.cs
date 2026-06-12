using FarmFresh.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace FarmFresh.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<FarmerProfile> FarmerProfiles => Set<FarmerProfile>();
    public DbSet<CustomerProfile> CustomerProfiles => Set<CustomerProfile>();
    public DbSet<Address> Addresses => Set<Address>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<SubOrder> SubOrders => Set<SubOrder>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<CsaSubscription> CsaSubscriptions => Set<CsaSubscription>();
    public DbSet<DeliverySlot> DeliverySlots => Set<DeliverySlot>();
    public DbSet<OpenFarmEvent> OpenFarmEvents => Set<OpenFarmEvent>();
    public DbSet<EventRegistration> EventRegistrations => Set<EventRegistration>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<Recipe> Recipes => Set<Recipe>();
    public DbSet<CsaWeeklyBox> CsaWeeklyBoxes => Set<CsaWeeklyBox>();
    public DbSet<CsaWeeklyBoxItem> CsaWeeklyBoxItems => Set<CsaWeeklyBoxItem>();
    public DbSet<CsaBoxTemplate> CsaBoxTemplates => Set<CsaBoxTemplate>();       // ← NOVO
    public DbSet<CsaBoxTemplateItem> CsaBoxTemplateItems => Set<CsaBoxTemplateItem>(); // ← NOVO

    public DbSet<EventReview> EventReviews => Set<EventReview>();

    public DbSet<ExchangeRate> ExchangeRates => Set<ExchangeRate>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<CsaWeeklyBox>(b =>
        {
            b.HasKey(x => x.Id);
            b.HasOne(x => x.Subscription)
                .WithMany(x => x.WeeklyBoxes)
                .HasForeignKey(x => x.CsaSubscriptionId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<CsaWeeklyBoxItem>(b =>
        {
            b.HasKey(x => x.Id);
            b.HasOne(x => x.Box)
                .WithMany(x => x.Items)
                .HasForeignKey(x => x.CsaWeeklyBoxId)
                .OnDelete(DeleteBehavior.Cascade);
            b.HasOne(x => x.Product)
                .WithMany()
                .HasForeignKey(x => x.ProductId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ← NOVO
        modelBuilder.Entity<CsaBoxTemplate>(b =>
        {
            b.HasKey(x => x.Id);
            b.HasOne(x => x.FarmerProfile)
                .WithMany()
                .HasForeignKey(x => x.FarmerProfileId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<CsaBoxTemplateItem>(b =>
        {
            b.HasKey(x => x.Id);
            b.HasOne(x => x.Template)
                .WithMany(x => x.Items)
                .HasForeignKey(x => x.CsaBoxTemplateId)
                .OnDelete(DeleteBehavior.Cascade);
            b.HasOne(x => x.Product)
                .WithMany()
                .HasForeignKey(x => x.ProductId)
                .OnDelete(DeleteBehavior.Cascade);
        });


        modelBuilder.Entity<EventReview>(b =>
        {
         b.HasKey(x => x.Id);
        b.HasOne(x => x.OpenFarmEvent)
        .WithMany(x => x.Reviews)
        .HasForeignKey(x => x.OpenFarmEventId)
        .OnDelete(DeleteBehavior.Cascade);
        b.HasOne(x => x.CustomerProfile)
        .WithMany()
        .HasForeignKey(x => x.CustomerProfileId)
        .OnDelete(DeleteBehavior.Cascade);
        });

    }
}
