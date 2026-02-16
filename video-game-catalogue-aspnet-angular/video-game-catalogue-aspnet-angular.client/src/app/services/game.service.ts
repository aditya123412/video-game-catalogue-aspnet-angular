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

  search(q?: string, genre?: string, publisher?: string): Observable<Game[]> {
    const params: any = {};
    if (q) params.q = q;
    if (genre) params.genre = genre;
    if (publisher) params.publisher = publisher;
    return this.http.get<Game[]>(`${this.base}/search`, { params });
  }

  getFilters(): Observable<{ genres: string[]; publishers: string[] }> {
    return this.http.get<{ genres: string[]; publishers: string[] }>(`${this.base}/filters`);
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
