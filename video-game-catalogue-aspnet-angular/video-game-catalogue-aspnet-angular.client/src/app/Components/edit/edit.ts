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

  constructor(private route: ActivatedRoute, private svc: GameService, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(pm => {
      const id = pm.get('id');
      if (id) {
        const num = Number(id);
        if (!isNaN(num)) {
          this.svc.getById(num).subscribe(g => {
            this.model.set(g);
            // create a shallow copy for form binding
            this.form = { ...g };
          });
        }
      }
    });
  }

  save(): void {
    if (!this.form) return;
    this.svc.update(this.form.id, this.form).subscribe(() => this.router.navigate(['/']));
  }

  cancel(): void {
    this.router.navigate(['/']);
  }
}
