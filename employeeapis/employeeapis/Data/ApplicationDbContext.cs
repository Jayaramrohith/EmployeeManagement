using employeeapis.Models;
using Microsoft.EntityFrameworkCore;

namespace employeeapis.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Employee> Employees => Set<Employee>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Employee>(entity =>
        {
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.Email).HasMaxLength(150);
            entity.Property(e => e.Department).HasMaxLength(100);
            entity.Property(e => e.Salary).HasColumnType("decimal(18,2)");
            entity.HasIndex(e => e.Email).IsUnique();
        });

    }
    public DbSet<User> Users { get; set; }
}
