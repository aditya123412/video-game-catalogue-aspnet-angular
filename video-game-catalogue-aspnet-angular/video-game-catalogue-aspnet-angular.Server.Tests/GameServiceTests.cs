using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Xunit;
using video_game_catalogue_aspnet_angular.Server.Data;
using video_game_catalogue_aspnet_angular.Server.Data.DTO;
using video_game_catalogue_aspnet_angular.Server.Services;
using System.Linq;

namespace video_game_catalogue_aspnet_angular.Server.Tests
{
    public class GameServiceTests
    {
        private ApplicationDbContext CreateContext(string dbName)
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: dbName)
                .Options;

            var ctx = new ApplicationDbContext(options);
            return ctx;
        }

        [Fact]
        public async Task CreateAndGetGame()
        {
            var name = System.Guid.NewGuid().ToString();
            using var ctx = CreateContext(name);
            var svc = new GameService(ctx);

            var g = new Game { Title = "T1", Description = "D1", Genre = "Arcade", Publisher = "P1", year = 2020, price = 9.99f };
            var created = await svc.CreateAsync(g);
            Assert.NotNull(created);
            Assert.True(created.Id != 0);

            var fetched = await svc.GetByIdAsync(created.Id);
            Assert.NotNull(fetched);
            Assert.Equal("T1", fetched.Title);
        }

        [Fact]
        public async Task SearchAndFilters()
        {
            var name = System.Guid.NewGuid().ToString();
            using var ctx = CreateContext(name);
            var svc = new GameService(ctx);

            var a = await svc.CreateAsync(new Game { Title = "Space", Genre = "Arcade", Publisher = "P1", year = 2000, price = 1 });
            var b = await svc.CreateAsync(new Game { Title = "Space 2", Genre = "Arcade", Publisher = "P2", year = 2001, price = 2 });
            var c = await svc.CreateAsync(new Game { Title = "Other", Genre = "Action", Publisher = "P1", year = 2005, price = 3 });

            var search = await svc.SearchAsync("Space", null, null);
            Assert.Equal(2, search.Count);

            var filters = await svc.GetFiltersAsync();
            Assert.Contains("Arcade", filters.Genres);
            Assert.Contains("P1", filters.Publishers);
        }

        [Fact]
        public async Task GetAll_Update_Delete()
        {
            var name = System.Guid.NewGuid().ToString();
            using var ctx = CreateContext(name);
            var svc = new GameService(ctx);

            var g1 = await svc.CreateAsync(new Game { Title = "One", Genre = "G1", Publisher = "Pub1", year = 2010, price = 5 });
            var g2 = await svc.CreateAsync(new Game { Title = "Two", Genre = "G2", Publisher = "Pub2", year = 2011, price = 6 });

            var all = await svc.GetAllAsync();
            Assert.Equal(2, all.Count);

            // Update g1
            g1.Title = "One Updated";
            var updated = await svc.UpdateAsync(g1);
            Assert.True(updated);
            var fetched = await svc.GetByIdAsync(g1.Id);
            Assert.Equal("One Updated", fetched.Title);

            // Delete g2
            var deleted = await svc.DeleteAsync(g2.Id);
            Assert.True(deleted);
            var after = await svc.GetAllAsync();
            Assert.Single(after);
        }
    }
}
