import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { Movie, Review, WatchEntry } from '../../models';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page" *ngIf="movie">
      <a routerLink="/movies" class="back">← Back</a>

      <div class="hero">
        <div class="poster" [style.background-image]="movie.poster_url ? 'url(' + movie.poster_url + ')' : ''">
          @if (!movie.poster_url) { <span>🎬</span> }
        </div>
        <div class="info">
          <div class="genre-badge">{{ movie.genre }}</div>
          <h1>{{ movie.title }}</h1>
          <p class="year">{{ movie.release_year }}</p>
          <p class="desc">{{ movie.description }}</p>
          <p class="by">Added by {{ movie.added_by.username }}</p>

          <!-- (click) event #4 — update watch status (API request) -->
          <div class="watch-actions" *ngIf="watchEntry; else addBlock">
            <span class="status-badge">{{ watchEntry.status === 'watched' ? '✅ Watched' : '🔖 Want to watch' }}</span>
            <div class="rating-row">
              <span>Rating:</span>
              @for (star of stars; track star) {
                <span class="star" [class.filled]="star <= (watchEntry.rating ?? 0)"
                      (click)="setRating(star)">★</span>
              }
              <span class="rating-val">{{ watchEntry.rating ?? '—' }}/10</span>
            </div>
            <button class="btn-sm" (click)="toggleStatus()">
              Mark as {{ watchEntry.status === 'watched' ? 'want to watch' : 'watched' }}
            </button>
            <button class="btn-sm danger" (click)="removeFromWatchlist()">Remove</button>
          </div>
          <ng-template #addBlock>
            <button class="btn-add" (click)="addToWatchlist()">＋ Add to watchlist</button>
          </ng-template>
        </div>
      </div>

      <!-- REVIEWS -->
      <div class="reviews-section">
        <h2>Reviews</h2>

        <div class="add-review">
          <textarea [(ngModel)]="reviewBody" rows="3" placeholder="Write a review…"></textarea>
          <!-- (click) event — post review (API request) -->
          <button (click)="postReview()" [disabled]="!reviewBody.trim()">Post review</button>
        </div>

        <div class="review-error" *ngIf="reviewError">{{ reviewError }}</div>

        @if (reviews.length === 0) {
          <p class="empty">No reviews yet. Be the first!</p>
        }
        @for (r of reviews; track r.id) {
          <div class="review-card">
            <div class="review-header">
              <span class="reviewer">{{ r.user.username }}</span>
              <span class="review-date">{{ r.created_at | date:'mediumDate' }}</span>
            </div>
            <p>{{ r.body }}</p>
          </div>
        }
      </div>
    </div>

    <div *ngIf="!movie && !loading" class="error-page">Movie not found.</div>
    <div *ngIf="loading" class="loading">Loading…</div>
  `,
  styles: [`
    .page { padding:2rem; max-width:900px; margin:0 auto; }
    .back { color:#e8c77a; text-decoration:none; font-size:0.875rem; }
    .hero { display:flex; gap:2rem; margin:1.5rem 0 2.5rem; align-items:flex-start; }
    .poster { width:200px; flex-shrink:0; height:290px; background:#1a1a23 center/cover no-repeat; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:3rem; }
    .info { flex:1; }
    .genre-badge { display:inline-block; font-size:0.72rem; padding:2px 10px; background:#e8c77a22; color:#e8c77a; border-radius:99px; margin-bottom:10px; text-transform:capitalize; }
    h1 { margin:0 0 4px; color:#eee; font-size:1.8rem; }
    .year { color:#888; margin:0 0 0.75rem; }
    .desc { color:#bbb; line-height:1.6; margin-bottom:1rem; }
    .by { color:#666; font-size:0.82rem; margin-bottom:1.25rem; }
    .watch-actions { display:flex; flex-direction:column; gap:0.5rem; }
    .status-badge { font-size:0.85rem; color:#80e0a0; }
    .rating-row { display:flex; align-items:center; gap:4px; }
    .rating-row span { color:#bbb; font-size:0.85rem; }
    .star { font-size:1.3rem; color:#444; cursor:pointer; transition:color .1s; }
    .star.filled { color:#e8c77a; }
    .star:hover { color:#e8c77a99; }
    .rating-val { color:#888; font-size:0.82rem; margin-left:4px; }
    .btn-sm { padding:6px 14px; background:#2e2e3e; color:#eee; border:1px solid #3e3e5e; border-radius:7px; cursor:pointer; font-size:0.83rem; width:fit-content; }
    .btn-sm.danger { color:#f08080; border-color:#5e2e2e; }
    .btn-add { padding:9px 20px; background:#e8c77a; color:#0f0f13; border:none; border-radius:8px; font-weight:700; cursor:pointer; }
    .reviews-section h2 { color:#eee; margin-bottom:1rem; }
    .add-review { margin-bottom:1.5rem; }
    .add-review textarea { width:100%; padding:10px 12px; background:#1a1a23; border:1px solid #2e2e3e; border-radius:8px; color:#eee; font-size:0.9rem; resize:vertical; box-sizing:border-box; }
    .add-review button { margin-top:0.5rem; padding:8px 18px; background:#e8c77a; color:#0f0f13; border:none; border-radius:8px; font-weight:700; cursor:pointer; }
    .add-review button:disabled { opacity:0.5; cursor:not-allowed; }
    .review-card { background:#1a1a23; border:1px solid #2e2e3e; border-radius:10px; padding:1rem 1.25rem; margin-bottom:0.75rem; }
    .review-header { display:flex; justify-content:space-between; margin-bottom:0.5rem; }
    .reviewer { color:#e8c77a; font-size:0.85rem; font-weight:600; }
    .review-date { color:#555; font-size:0.8rem; }
    .review-card p { color:#ccc; margin:0; line-height:1.6; }
    .empty, .loading, .error-page { text-align:center; color:#666; padding:3rem; }
    .review-error { color:#f08080; font-size:0.83rem; margin-bottom:0.75rem; }
  `]
})
export class MovieDetailComponent implements OnInit {
  movie:       Movie | null       = null;
  reviews:     Review[]           = [];
  watchEntry:  WatchEntry | null  = null;
  loading      = true;
  reviewBody   = '';
  reviewError  = '';
  stars        = [1,2,3,4,5,6,7,8,9,10];

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.movieService.getMovie(id).subscribe({
      next: (m) => { this.movie = m; this.loading = false; }
    });
    this.movieService.getReviews(id).subscribe({
      next: (r) => this.reviews = r
    });
    this.movieService.getWatchlist().subscribe({
      next: (entries) => {
        this.watchEntry = entries.find(e => e.movie.id === id) ?? null;
      }
    });
  }

  // (click) — add to watchlist
  addToWatchlist(): void {
    this.movieService.addToWatchlist({ movie_id: this.movie!.id, status: 'want' }).subscribe({
      next: (e) => this.watchEntry = e
    });
  }

  // (click) — toggle watched/want
  toggleStatus(): void {
    const newStatus = this.watchEntry!.status === 'watched' ? 'want' : 'watched';
    this.movieService.updateWatchEntry(this.watchEntry!.id, { status: newStatus }).subscribe({
      next: (e) => this.watchEntry = e
    });
  }

  // (click) — set rating
  setRating(star: number): void {
    this.movieService.updateWatchEntry(this.watchEntry!.id, { rating: star }).subscribe({
      next: (e) => this.watchEntry = e
    });
  }

  // (click) — remove from watchlist
  removeFromWatchlist(): void {
    this.movieService.removeFromWatchlist(this.watchEntry!.id).subscribe({
      next: () => this.watchEntry = null
    });
  }

  // (click) — post review
  postReview(): void {
    this.reviewError = '';
    this.movieService.addReview(this.movie!.id, { body: this.reviewBody }).subscribe({
      next: (r) => { this.reviews.unshift(r); this.reviewBody = ''; },
      error: (e) => this.reviewError = e.message
    });
  }
}
