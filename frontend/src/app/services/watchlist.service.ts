import { Injectable, signal } from '@angular/core';
import { Movie } from '../models/movie.model';

@Injectable({ providedIn: 'root' })
export class WatchlistService {
  private _items = signal<Movie[]>([]);
  items = this._items.asReadonly();

  add(movie: Movie) {
    if (!this._items().find(m => m.id === movie.id)) {
      this._items.update(list => [...list, movie]);
    }
  }

  remove(id: number) {
    this._items.update(list => list.filter(m => m.id !== id));
  }
}