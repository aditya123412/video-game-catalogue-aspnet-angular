using System.ComponentModel.DataAnnotations;

namespace video_game_catalogue_aspnet_angular.Server.Data.DTO
{
    public class Game
    {
        [Required]
        public int Id { get; set; }
        [Required]
        [StringLength(100, MinimumLength = 1)]
        public string Title { get; set; }
        public string Description { get; set; }
        public string Genre { get; set; }
        public string Publisher { get; set; }
        public int year { get; set; }
        [Range(0.0d, double.MaxValue)]
        public float price { get; set; }
    }
}
