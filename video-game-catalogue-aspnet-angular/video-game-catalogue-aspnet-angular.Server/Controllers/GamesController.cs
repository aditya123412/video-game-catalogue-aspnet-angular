using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using video_game_catalogue_aspnet_angular.Server.Data.DTO;

namespace video_game_catalogue_aspnet_angular.Server.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class GamesController : ControllerBase
    {
        private readonly video_game_catalogue_aspnet_angular.Server.Services.IGameService _svc;

        public GamesController(video_game_catalogue_aspnet_angular.Server.Services.IGameService svc)
        {
            _svc = svc;
        }

        [HttpGet(Name = "GetGames")]
        public async Task<ActionResult<IEnumerable<Game>>> Get()
        {
            var list = await _svc.GetAllAsync();
            return Ok(list);
        }

        // Search endpoint: supports q (text), genre, publisher
        [HttpGet("search", Name = "SearchGames")]
        public async Task<ActionResult<IEnumerable<Game>>> Search([FromQuery] string? q, [FromQuery] string? genre, [FromQuery] string? publisher)
        {
            var list = await _svc.SearchAsync(q, genre, publisher);
            return Ok(list);
        }

        [HttpGet("filters", Name = "GetFilters")]
        public async Task<ActionResult<video_game_catalogue_aspnet_angular.Server.Data.FiltersDto>> GetFilters()
        {
            var filters = await _svc.GetFiltersAsync();
            return Ok(filters);
        }

        [HttpGet("{id}", Name = "GetGameById")]
        public async Task<ActionResult<Game>> GetGameById(int id)
        {
            var game = await _svc.GetByIdAsync(id);
            if (game == null)
                return NotFound();

            return Ok(game);
        }

        [HttpPost]
        public async Task<ActionResult<Game>> Create([FromBody] Game game)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var created = await _svc.CreateAsync(game);
            return CreatedAtAction(nameof(GetGameById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Game updated)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (id != updated.Id)
                return BadRequest("Id in URL and payload must match.");

            var ok = await _svc.UpdateAsync(updated);
            if (!ok) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var ok = await _svc.DeleteAsync(id);
            if (!ok) return NotFound();
            return NoContent();
        }
    }
}
