using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using video_game_catalogue_aspnet_angular.Server.Data.DTO;

namespace video_game_catalogue_aspnet_angular.Server.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class GamesController : ControllerBase
    {
        // Simple in-memory store for demo purposes
        private static readonly List<Game> _games = new()
        {
            new Game { Id = 1, Title = "Space Invaders", Description = "Classic arcade shooter", Genre = "Arcade", Publisher = "Taito", year = 1978, price = 9.99f },
            new Game { Id = 2, Title = "Super Platformer", Description = "2D platform adventure", Genre = "Platformer", Publisher = "Indie", year = 2015, price = 19.99f },
            new Game { Id = 3, Title = "Racing Pro", Description = "High speed racing", Genre = "Racing", Publisher = "Speedy", year = 2020, price = 29.99f }
        };

        private static readonly object _lock = new();

        [HttpGet(Name = "GetGames")]
        public ActionResult<IEnumerable<Game>> Get()
        {
            // Return all games
            return Ok(_games);
        }

        [HttpGet("{id}", Name = "GetGameById")]
        public ActionResult<Game> GetGameById(int id)
        {
            var game = _games.FirstOrDefault(g => g.Id == id);
            if (game == null)
                return NotFound();

            return Ok(game);
        }

        [HttpPost]
        public ActionResult<Game> Create([FromBody] Game game)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            lock (_lock)
            {
                var nextId = _games.Any() ? _games.Max(g => g.Id) + 1 : 1;
                game.Id = nextId;
                _games.Add(game);
            }

            return CreatedAtAction(nameof(GetGameById), new { id = game.Id }, game);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Game updated)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (id != updated.Id)
                return BadRequest("Id in URL and payload must match.");

            lock (_lock)
            {
                var existing = _games.FirstOrDefault(g => g.Id == id);
                if (existing == null)
                    return NotFound();

                // Update fields
                existing.Title = updated.Title;
                existing.Description = updated.Description;
                existing.Genre = updated.Genre;
                existing.Publisher = updated.Publisher;
                existing.year = updated.year;
                existing.price = updated.price;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            lock (_lock)
            {
                var existing = _games.FirstOrDefault(g => g.Id == id);
                if (existing == null)
                    return NotFound();

                _games.Remove(existing);
            }

            return NoContent();
        }
    }
}
