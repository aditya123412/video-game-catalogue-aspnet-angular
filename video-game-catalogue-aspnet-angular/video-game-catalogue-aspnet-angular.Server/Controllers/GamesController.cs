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
