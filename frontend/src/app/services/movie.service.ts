import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie, MovieCreate, WatchEntry, WatchEntryCreate, Review, ReviewCreate } from '../models';

const API = 'http://localhost:8000/api';

@Injectable({ providedIn: 'root' })
export class MovieService {
  constructor(private http: HttpClient) {}

  // ── Movies ───────────────────────────────────────────────
  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${API}/movies/`);
  }

  getMovie(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${API}/movies/${id}/`);
  }

  addMovie(data: MovieCreate): Observable<Movie> {
    return this.http.post<Movie>(`${API}/movies/`, data);
  }

  updateMovie(id: number, data: Partial<MovieCreate>): Observable<Movie> {
    return this.http.put<Movie>(`${API}/movies/${id}/`, data);
  }

  deleteMovie(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/movies/${id}/`);
  }

  // ── Watch list ───────────────────────────────────────────
  getWatchlist(): Observable<WatchEntry[]> {
    return this.http.get<WatchEntry[]>(`${API}/watchlist/`);
  }

  addToWatchlist(data: WatchEntryCreate): Observable<WatchEntry> {
    return this.http.post<WatchEntry>(`${API}/watchlist/`, data);
  }

  updateWatchEntry(id: number, data: Partial<WatchEntryCreate>): Observable<WatchEntry> {
    return this.http.put<WatchEntry>(`${API}/watchlist/${id}/`, data);
  }

  removeFromWatchlist(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/watchlist/${id}/`);
  }

  // ── Reviews ──────────────────────────────────────────────
  getReviews(movieId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${API}/movies/${movieId}/reviews/`);
  }

  addReview(movieId: number, data: ReviewCreate): Observable<Review> {
    return this.http.post<Review>(`${API}/movies/${movieId}/reviews/`, data);
  }

  deleteReview(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/reviews/${id}/`);
  }
}
