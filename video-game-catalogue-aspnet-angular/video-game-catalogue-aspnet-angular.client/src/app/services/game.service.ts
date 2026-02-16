import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Game {
  id: number;
  title: string;
  description?: string;
  genre?: string;
  publisher?: string;
  year?: number;
  price?: number;
}

@Injectable({ providedIn: 'root' })
export class GameService {
  private base = 'https://localhost:7087/api/games';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Game[]> {
    return this.http.get<Game[]>(this.base);
  }

  getById(id: number): Observable<Game> {
    return this.http.get<Game>(`${this.base}/${id}`);
  }

  create(game: Game): Observable<Game> {
    return this.http.post<Game>(this.base, game);
  }

  update(id: number, game: Game) {
    return this.http.put(`${this.base}/${id}`, game);
  }

  delete(id: number) {
    return this.http.delete(`${this.base}/${id}`);
  }
}
