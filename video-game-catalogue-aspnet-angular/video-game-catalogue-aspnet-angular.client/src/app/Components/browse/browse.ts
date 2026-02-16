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
  public filters: WritableSignal<{ genres: string[]; publishers: string[] } | null> = signal(null);

  public searchText: WritableSignal<string> = signal('');
  public searchGenre: WritableSignal<string | null> = signal(null);
  public searchPublisher: WritableSignal<string | null> = signal(null);
  // helper properties for template two-way binding
  get searchTextValue(){ return this.searchText(); }
  set searchTextValue(v: string){ this.searchText.set(v); }
  get searchGenreValue(){ return this.searchGenre(); }
  set searchGenreValue(v: string | null){ this.searchGenre.set(v); }
  get searchPublisherValue(){ return this.searchPublisher(); }
  set searchPublisherValue(v: string | null){ this.searchPublisher.set(v); }

  constructor(private svc: GameService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.loadAll();
    this.loadFilters();

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

  loadFilters(){
    this.svc.getFilters().subscribe(f => this.filters.set(f));
  }

  doSearch(){
    const query = this.searchText();
    const genre = this.searchGenre();
    const publisher = this.searchPublisher();
    if (!query && !genre && !publisher) {
      this.loadAll();
      return;
    }

    this.svc.search(query || undefined, genre || undefined, publisher || undefined)
      .subscribe(list => this.games.set(list));
  }

  clearSearch(){
    this.searchText.set('');
    this.searchGenre.set(null);
    this.searchPublisher.set(null);
    this.loadAll();
  }

  goToEdit(id: number){
    this.router.navigate(['/edit', id]);
  }
}

