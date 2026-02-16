using Microsoft.EntityFrameworkCore;
using video_game_catalogue_aspnet_angular.Server.Data.DTO;

namespace video_game_catalogue_aspnet_angular.Server.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Game> Games { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure table and constraints if needed
            modelBuilder.Entity<Game>(eb =>
            {
                eb.HasKey(g => g.Id);
                eb.Property(g => g.Title).HasMaxLength(100).IsRequired();
            });
        }
    }
}
