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
  public form: Game | null = null;

  constructor(private route: ActivatedRoute, private svc: GameService, private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(pm => {
      const id = pm.get('id');
      if (id && id != '-1') {
        const num = Number(id);
        if (!isNaN(num)) {
          this.svc.getById(num).subscribe(game => {
            this.model.set(game);
            // create a shallow copy for form binding
            this.form = { ...game };
          });
        }
      }
      else {
        // creating new game
        this.model.set(null);
        this.form = { id: 0, title: '', description: '', genre: '', publisher: '', year: new Date().getFullYear(), price: 0 };
      }
    });
  }

  save(): void {
    if (!this.form) return;
    if (this.form.id && this.form.id > 0) {
      this.svc.update(this.form.id, this.form).subscribe(() => this.router.navigate(['/']));
    } else {
      this.svc.create(this.form).subscribe(() => this.router.navigate(['/']));
    }
  }

  cancel(): void {
    this.router.navigate(['/']);
  }

  delete(): void {
    if (!this.form || !this.form.id) return;
    if (!confirm('Delete this game?')) return;
    this.svc.delete(this.form.id).subscribe(() => this.router.navigate(['/']));
  }
}
