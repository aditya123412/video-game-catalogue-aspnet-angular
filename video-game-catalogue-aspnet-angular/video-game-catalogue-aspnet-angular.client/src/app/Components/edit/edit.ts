import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService, Game } from '../../services/game.service';


@Component({
  selector: 'app-edit',
  standalone: false,
  templateUrl: './edit.html',
  styleUrls: ['./edit.css'],
})
export class Edit implements OnInit {
  public model: WritableSignal<Game | null> = signal(null);

  // Form fields as Signals
  public id = signal(0);
  public title = signal('');
  public description = signal('');
  public genre = signal('');
  public publisher = signal('');
  public year = signal<number>(new Date().getFullYear());
  public price = signal<number>(0);

  // getters/setters for template binding (ngModel requires a property)
  get titleValue() { return this.title(); }
  set titleValue(v: string) { this.title.set(v); }

  get descriptionValue() { return this.description(); }
  set descriptionValue(v: string) { this.description.set(v); }

  get genreValue() { return this.genre(); }
  set genreValue(v: string) { this.genre.set(v); }

  get publisherValue() { return this.publisher(); }
  set publisherValue(v: string) { this.publisher.set(v); }

  get yearValue() { return this.year(); }
  set yearValue(v: number) { this.year.set(Number(v)); }

  get priceValue() { return this.price(); }
  set priceValue(v: number) { this.price.set(Number(v)); }

  constructor(private route: ActivatedRoute, private svc: GameService, private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(pm => {
      const id = pm.get('id');
      if (id && id != '-1') {
        const num = Number(id);
        if (!isNaN(num)) {
          this.svc.getById(num).subscribe(game => {
            this.model.set(game);
            // populate signals from fetched game
            this.id.set(game.id);
            this.title.set(game.title || '');
            this.description.set(game.description || '');
            this.genre.set(game.genre || '');
            this.publisher.set(game.publisher || '');
            this.year.set(game.year ?? new Date().getFullYear());
            this.price.set(game.price ?? 0);
          });
        }
      }
      else {
        // creating new game
        this.model.set(null);
        this.id.set(0);
        this.title.set('');
        this.description.set('');
        this.genre.set('');
        this.publisher.set('');
        this.year.set(new Date().getFullYear());
        this.price.set(0);
      }
    });
  }

  save(): void {
    // build game object from signals
    const game: Game = {
      id: this.id(),
      title: this.title(),
      description: this.description(),
      genre: this.genre(),
      publisher: this.publisher(),
      year: this.year(),
      price: this.price()
    };

    if (game.id && game.id > 0) {
      this.svc.update(game.id, game).subscribe(() => this.router.navigate(['/']));
    } else {
      this.svc.create(game).subscribe(() => this.router.navigate(['/']));
    }
  }

  cancel(): void {
    this.router.navigate(['/']);
  }

  delete(): void {
    const id = this.id();
    if (!id) return;
    if (!confirm('Delete this game?')) return;
    this.svc.delete(id).subscribe(() => this.router.navigate(['/']));
  }
}
