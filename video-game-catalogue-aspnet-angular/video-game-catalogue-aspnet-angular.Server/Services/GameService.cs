using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using video_game_catalogue_aspnet_angular.Server.Data;
using video_game_catalogue_aspnet_angular.Server.Data.DTO;

namespace video_game_catalogue_aspnet_angular.Server.Services
{
    public class GameService : IGameService
    {
        private readonly ApplicationDbContext _db;

        public GameService(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task<List<Game>> GetAllAsync()
        {
            return await _db.Games.AsNoTracking().ToListAsync();
        }

        public async Task<Game?> GetByIdAsync(int id)
        {
            return await _db.Games.FindAsync(id);
        }

        public async Task<Game> CreateAsync(Game game)
        {
            _db.Games.Add(game);
            await _db.SaveChangesAsync();
            return game;
        }

        public async Task<bool> UpdateAsync(Game game)
        {
            var existing = await _db.Games.FindAsync(game.Id);
            if (existing == null) return false;

            existing.Title = game.Title;
            existing.Description = game.Description;
            existing.Genre = game.Genre;
            existing.Publisher = game.Publisher;
            existing.year = game.year;
            existing.price = game.price;

            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var existing = await _db.Games.FindAsync(id);
            if (existing == null) return false;
            _db.Games.Remove(existing);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
