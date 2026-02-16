using System.Collections.Generic;
using System.Threading.Tasks;
using video_game_catalogue_aspnet_angular.Server.Data.DTO;

namespace video_game_catalogue_aspnet_angular.Server.Services
{
    public interface IGameService
    {
        Task<List<Game>> GetAllAsync();
        Task<Game?> GetByIdAsync(int id);
        Task<Game> CreateAsync(Game game);
        Task<bool> UpdateAsync(Game game);
        Task<bool> DeleteAsync(int id);
        Task<List<Game>> SearchAsync(string? q = null, string? genre = null, string? publisher = null);
        Task<video_game_catalogue_aspnet_angular.Server.Data.FiltersDto> GetFiltersAsync();
    }
}
