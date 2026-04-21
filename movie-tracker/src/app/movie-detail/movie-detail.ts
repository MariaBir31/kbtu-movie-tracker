import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../services/movie.service';
import { ReviewService } from '../services/review.service';
import { WatchlistService } from '../services/watchlist.service';
import { AuthService } from '../services/auth.service';
import { Movie, Review } from '../models/movie.model';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './movie-detail.html',
  styleUrls: ['./movie-detail.css']
})
export class MovieDetail implements OnInit {
  movie: Movie | null = null;
  reviews: Review[] = [];
  reviewText = '';
  reviewRating = 5;
  error = '';
  reviewError = '';
  loading = true;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private movieService: MovieService,
    private reviewService: ReviewService,
    public watchlist: WatchlistService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.movieService.getMovie(id).subscribe({
      next: data => {
        this.movie = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Movie not found.';
        this.loading = false;
      }
    });

    this.reviewService.getReviews(id).subscribe({
      next: data => this.reviews = data,
      error: () => this.reviewError = 'Failed to load reviews.'
    });
  }

  addToWatchlist() {
    if (!this.movie) return;
    this.watchlist.add(this.movie.id).subscribe({
      error: () => this.error = 'Failed to add to watchlist.'
    });
  }

  submitReview() {
    if (!this.movie) return;
    if (!this.reviewText.trim()) {
      this.reviewError = 'Review text cannot be empty.';
      return;
    }
    this.reviewError = '';

    this.reviewService.addReview(this.movie.id, {
      text: this.reviewText,
      rating: this.reviewRating
    }).subscribe({
      next: review => {
        this.reviews = [review, ...this.reviews];
        this.reviewText = '';
        this.reviewRating = 5;
      },
      error: () => this.reviewError = 'Failed to submit review. Please login first.'
    });
  }

  deleteReview(reviewId: number) {
    if (!this.movie) return;
    this.reviewService.deleteReview(this.movie.id, reviewId).subscribe({
      next: () => this.reviews = this.reviews.filter(r => r.id !== reviewId),
      error: () => this.reviewError = 'Failed to delete review.'
    });
  }

  deleteMovie() {
    if (!this.movie) return;
    this.movieService.deleteMovie(this.movie.id).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => this.error = 'Failed to delete movie.'
    });
  }

  get stars() {
    return [1, 2, 3, 4, 5];
  }
}