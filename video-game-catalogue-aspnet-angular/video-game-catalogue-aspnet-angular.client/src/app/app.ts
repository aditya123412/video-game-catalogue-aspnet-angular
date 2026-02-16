import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';

export interface Game {
  id: number;
  title: string;
  description: string;
  genre: string;
  publisher: string;
  year: number;
  price: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnInit {
  public games: Game[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchGames();
  }

  fetchGames() {
    this.http.get<Game[]>('https://localhost:7087/api/games').subscribe(
      (result) => {
        this.games = result;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  protected readonly title = signal('video-game-catalogue-aspnet-angular.client');
}
