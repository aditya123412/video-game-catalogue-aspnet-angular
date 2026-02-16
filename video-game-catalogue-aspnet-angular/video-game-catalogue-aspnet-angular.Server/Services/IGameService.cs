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
    }
}
