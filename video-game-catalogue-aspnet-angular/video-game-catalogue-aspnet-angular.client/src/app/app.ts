import { Component, signal } from '@angular/core';

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
export class App {
  public readonly title = signal('video-game-catalogue-aspnet-angular.client');
}
