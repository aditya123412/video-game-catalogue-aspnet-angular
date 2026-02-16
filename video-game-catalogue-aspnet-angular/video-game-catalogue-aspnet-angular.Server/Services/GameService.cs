using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using video_game_catalogue_aspnet_angular.Server.Data;
using video_game_catalogue_aspnet_angular.Server.Data.DTO;
using video_game_catalogue_aspnet_angular.Server.Data;
using System;

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

        public async Task<List<Game>> SearchAsync(string? q = null, string? genre = null, string? publisher = null)
        {
            var query = _db.Games.AsQueryable();
            if (!string.IsNullOrWhiteSpace(q))
            {
                var t = q.Trim();
                query = query.Where(g => g.Title.Contains(t) || (g.Description != null && g.Description.Contains(t)));
            }
            if (!string.IsNullOrWhiteSpace(genre))
            {
                query = query.Where(g => g.Genre == genre);
            }
            if (!string.IsNullOrWhiteSpace(publisher))
            {
                query = query.Where(g => g.Publisher == publisher);
            }

            return await query.AsNoTracking().ToListAsync();
        }

        public async Task<video_game_catalogue_aspnet_angular.Server.Data.FiltersDto> GetFiltersAsync()
        {
            var genres = await _db.Games.Select(g => g.Genre).Distinct().Where(s => s != null).ToListAsync();
            var publishers = await _db.Games.Select(g => g.Publisher).Distinct().Where(s => s != null).ToListAsync();
            return new video_game_catalogue_aspnet_angular.Server.Data.FiltersDto
            {
                Genres = genres!,
                Publishers = publishers!
            };
        }
    }
}
