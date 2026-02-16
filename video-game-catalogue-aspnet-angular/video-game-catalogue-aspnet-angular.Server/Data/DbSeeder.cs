using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using video_game_catalogue_aspnet_angular.Server.Data.DTO;

namespace video_game_catalogue_aspnet_angular.Server.Data
{
    internal static class DbSeeder
    {
        public static async Task SeedAsync(ApplicationDbContext db, ILogger logger, int count = 12)
        {
            if (db == null) throw new ArgumentNullException(nameof(db));
            if (logger == null) throw new ArgumentNullException(nameof(logger));

            // Do not reseed if data already exists
            if (await Task.FromResult(db.Games.Any()))
            {
                logger.LogInformation("Database already contains data; skipping seeding.");
                return;
            }

            var genres = new[] { "Arcade", "Platformer", "Racing", "Action", "Adventure" };
            var publishers = new[] { "Taito", "Indie", "Speedy", "StudioX", "MegaCorp" };

            var list = new List<Game>();

            var rnd = new Random();
            for (int i = 1; i <= count; i++)
            {
                // Use modulo to ensure repeated genres/publishers so grouping/search shows results
                var genre = genres[i % genres.Length];
                var publisher = publishers[(i + 1) % publishers.Length];

                // small randomness in title/year/price
                var title = $"Game {i} - {genre}";
                var year = 2000 + rnd.Next(0, 26);
                var price = (float)Math.Round(rnd.NextDouble() * 50.0, 2);

                list.Add(new Game
                {
                    Title = title,
                    Description = $"Description for {title}",
                    Genre = genre,
                    Publisher = publisher,
                    year = year,
                    price = price
                });
            }

            await db.Games.AddRangeAsync(list);
            await db.SaveChangesAsync();

            logger.LogInformation("Seeded {Count} games into the database.", list.Count);
        }
    }
}
