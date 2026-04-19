import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { WatchlistItem } from '../models/movie.model';

@Injectable({ providedIn: 'root' })
export class WatchlistService {
  private apiUrl = 'http://localhost:8000/api';
  private _items = signal<WatchlistItem[]>([]);
  items = this._items.asReadonly();

  constructor(private http: HttpClient) {}

  load(): Observable<WatchlistItem[]> {
    return this.http.get<WatchlistItem[]>(`${this.apiUrl}/watchlist/`).pipe(
      tap(items => this._items.set(items)),
      catchError(() => of([]))
    );
  }

  add(movieId: number): Observable<WatchlistItem> {
    return this.http.post<WatchlistItem>(`${this.apiUrl}/watchlist/`, { movie: movieId }).pipe(
      tap(item => this._items.update(list => [...list, item]))
    );
  }

  remove(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/watchlist/${id}/`).pipe(
      tap(() => this._items.update(list => list.filter(i => i.id !== id)))
    );
  }

  has(movieId: number): boolean {
    return !!this._items().find(i => i.movie.id === movieId);
  }
}