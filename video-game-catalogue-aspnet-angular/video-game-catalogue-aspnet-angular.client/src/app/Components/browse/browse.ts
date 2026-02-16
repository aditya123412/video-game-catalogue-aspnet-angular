import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { GameService, Game } from '../../services/game.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-browse',
  standalone: false,
  templateUrl: './browse.html',
  styleUrls: ['./browse.css'],
})
export class Browse implements OnInit {
  public games: WritableSignal<Game[] | null> = signal(null);
  public selected: WritableSignal<Game | null> = signal(null);

  constructor(private svc: GameService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.loadAll();

    // Watch route param for optional id and load that game
    this.route.paramMap.subscribe(pm => {
      const id = pm.get('id');
      if (id) {
        const num = Number(id);
        if (!isNaN(num)) {
          this.svc.getById(num).subscribe(g => this.selected.set(g));
        }
      } else {
        this.selected.set(null);
      }
    });
  }

  loadAll(){
    this.svc.getAll().subscribe(list => this.games.set(list));
  }

  goToEdit(id: number){
    this.router.navigate(['/edit', id]);
  }
}

