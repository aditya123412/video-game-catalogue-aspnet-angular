using System.Collections.Generic;

namespace video_game_catalogue_aspnet_angular.Server.Data
{
    public class FiltersDto
    {
        public List<string> Genres { get; set; } = new();
        public List<string> Publishers { get; set; } = new();
    }
}
