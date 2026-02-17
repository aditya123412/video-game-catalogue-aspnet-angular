import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from './app-config.service';

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
  private base: string;

  constructor(private http: HttpClient, private cfg: AppConfig) {
    const baseRoot = cfg.apiBaseUrl.replace(/\/$/, '');
    this.base = `${baseRoot}/games`;
  }

  getAll(): Observable<Game[]> {
    return this.http.get<Game[]>(this.base);
  }

  search(query?: string, genre?: string, publisher?: string): Observable<Game[]> {
    const params: any = {};
    if (query) params.q = query;
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
