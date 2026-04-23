import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Movie {
  id: number;
  title: string;
  genre: string;
  release_year: number;
  poster_url?: string;
  description?: string;
  added_by?: any;
}

export interface WatchEntry {
  id: number;
  movie: Movie;
  user: number;
  status: string;
  rating?: number;
  watched_at?: string;
  note?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private http = inject(HttpClient);

  private baseUrl = 'http://127.0.0.1:8000/trackerapp';


  getMovies(search?: string): Observable<Movie[]> {
    const url = search ? `${this.baseUrl}/movies/?search=${search}` : `${this.baseUrl}/movies/`;
    return this.http.get<Movie[]>(url);
  }

  getMovieById(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.baseUrl}/movies/${id}/`);
  }

  addMovie(movie: Movie): Observable<Movie> {
    return this.http.post<Movie>(`${this.baseUrl}/movies/`, movie);
  }


  getWatchlist(): Observable<WatchEntry[]> {
    return this.http.get<WatchEntry[]>(`${this.baseUrl}/watchlist/`);
  }

  addToWatchlist(movieId: number, status: string = 'want'): Observable<WatchEntry> {
    const payload = {movie_id: movieId, status: status};
    return this.http.post<WatchEntry>(`${this.baseUrl}/watchlist/`, payload);
  }

  deleteFromWatchlist(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/watchlist/${id}/`);
  }

  updateWatchlistEntry(id: number, data: Partial<WatchEntry>): Observable<WatchEntry> {
    return this.http.put<WatchEntry>(`${this.baseUrl}/watchlist/${id}/`, data);
  }

  getMovieRating(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/movies/${id}/rating/`);
  }
  updateMovieRating(movieId: number, rating: number) {
  const token = localStorage.getItem('access');
  return this.http.patch(`${this.apiUrl}/movies/${movieId}/update-rating/`, 
    { rating: rating },
    { headers: { 'Authorization': `Bearer ${token}` } }
  );
  }

  getReviewsForMovie(movieId: number) {
    return this.http.get<any[]>(`${this.baseUrl}/movies/${movieId}/reviews/`);
  }

  addReview(movieId: number, text: string) {
    return this.http.post<any>(`${this.baseUrl}/movies/${movieId}/reviews/`, {
      movie: movieId,
      body: text
    });
  }
}
