import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../models/movie.model';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getReviews(movieId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/movies/${movieId}/reviews/`);
  }

  addReview(movieId: number, data: { text: string; rating: number }): Observable<Review> {
    return this.http.post<Review>(`${this.apiUrl}/movies/${movieId}/reviews/`, data);
  }

  deleteReview(movieId: number, reviewId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/movies/${movieId}/reviews/${reviewId}/`);
  }
}