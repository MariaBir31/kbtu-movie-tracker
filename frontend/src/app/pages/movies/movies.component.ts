import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { Movie, MovieCreate } from '../../models';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page">
      <div class="header">
        <h2>Browse Movies</h2>
        <button class="btn-add" (click)="showForm = !showForm">
          {{ showForm ? '✕ Cancel' : '＋ Add movie' }}
        </button>
      </div>

      <!-- ADD MOVIE FORM — (click) triggers API request ✓ -->
      <div class="add-form" *ngIf="showForm">
        <h3>Add a new movie</h3>
        <div class="form-grid">
          <label>Title <input type="text" [(ngModel)]="newMovie.title" name="title" placeholder="Movie title" /></label>
          <label>Year  <input type="number" [(ngModel)]="newMovie.release_year" name="year" placeholder="2024" /></label>
          <label>Genre
            <select [(ngModel)]="newMovie.genre" name="genre">
              <option value="action">Action</option>
              <option value="comedy">Comedy</option>
              <option value="drama">Drama</option>
              <option value="horror">Horror</option>
              <option value="sci_fi">Sci-Fi</option>
              <option value="romance">Romance</option>
              <option value="animation">Animation</option>
              <option value="thriller">Thriller</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label>Poster URL <input type="url" [(ngModel)]="newMovie.poster_url" name="poster" placeholder="https://…" /></label>
        </div>
        <label>Description <textarea [(ngModel)]="newMovie.description" name="desc" rows="3" placeholder="Short description…"></textarea></label>
        <div class="form-error" *ngIf="addError">{{ addError }}</div>
        <button class="btn-submit" (click)="addMovie()">{{ adding ? 'Adding…' : 'Add movie' }}</button>
      </div>

      <!-- SEARCH — (click) triggers filter ✓ -->
      <div class="search-bar">
        <input type="text" [(ngModel)]="searchTerm" placeholder="Search by title…" />
        <select [(ngModel)]="genreFilter">
          <option value="">All genres</option>
          <option value="action">Action</option>
          <option value="comedy">Comedy</option>
          <option value="drama">Drama</option>
          <option value="horror">Horror</option>
          <option value="sci_fi">Sci-Fi</option>
          <option value="romance">Romance</option>
          <option value="animation">Animation</option>
          <option value="thriller">Thriller</option>
        </select>
        <button class="btn-filter" (click)="applyFilter()">Filter</button>
      </div>

      <div class="loading" *ngIf="loading">Loading movies…</div>
      <div class="empty"   *ngIf="!loading && filtered.length === 0">No movies found.</div>

      <!-- MOVIE GRID — @for loop ✓ -->
      <div class="movie-grid">
        @for (movie of filtered; track movie.id) {
          <div class="movie-card" [routerLink]="['/movies', movie.id]">
            <div class="poster" [style.background-image]="movie.poster_url ? 'url(' + movie.poster_url + ')' : ''">
              @if (!movie.poster_url) {
                <span class="poster-placeholder">🎬</span>
              }
            </div>
            <div class="card-body">
              <div class="genre-badge">{{ movie.genre }}</div>
              <h3>{{ movie.title }}</h3>
              <span class="year">{{ movie.release_year }}</span>
              <!-- (click) to add to watchlist ✓ -->
              <button class="btn-watch" (click)="addToWatchlist($event, movie.id)">
                + Watchlist
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .page { padding:2rem; max-width:1100px; margin:0 auto; }
    .header { display:flex; align-items:center; justify-content:space-between; margin-bottom:1.5rem; }
    h2 { margin:0; color:#eee; font-size:1.5rem; }
    .btn-add { padding:8px 18px; background:#e8c77a; color:#0f0f13; border:none; border-radius:8px; font-weight:700; cursor:pointer; }
    .add-form { background:#1a1a23; border:1px solid #2e2e3e; border-radius:12px; padding:1.5rem; margin-bottom:1.5rem; }
    .add-form h3 { margin:0 0 1rem; color:#e8c77a; font-size:1rem; }
    .form-grid { display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1rem; }
    label { display:block; color:#bbb; font-size:0.83rem; }
    input, select, textarea { display:block; width:100%; margin-top:5px; padding:9px 11px; background:#0f0f13; border:1px solid #2e2e3e; border-radius:7px; color:#eee; font-size:0.9rem; box-sizing:border-box; }
    textarea { resize:vertical; }
    .btn-submit { padding:9px 22px; background:#e8c77a; color:#0f0f13; border:none; border-radius:8px; font-weight:700; cursor:pointer; margin-top:0.75rem; }
    .form-error { color:#f08080; font-size:0.83rem; margin-top:0.5rem; }
    .search-bar { display:flex; gap:0.75rem; margin-bottom:1.5rem; }
    .search-bar input { flex:1; }
    .search-bar select { width:150px; flex-shrink:0; }
    .btn-filter { padding:9px 18px; background:#2e2e3e; color:#eee; border:none; border-radius:8px; cursor:pointer; white-space:nowrap; }
    .movie-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:1.25rem; }
    .movie-card { background:#1a1a23; border:1px solid #2e2e3e; border-radius:12px; overflow:hidden; cursor:pointer; transition:transform .15s,border-color .15s; }
    .movie-card:hover { transform:translateY(-3px); border-color:#e8c77a44; }
    .poster { height:260px; background:#0f0f13 center/cover no-repeat; display:flex; align-items:center; justify-content:center; }
    .poster-placeholder { font-size:3rem; }
    .card-body { padding:0.9rem; }
    .genre-badge { display:inline-block; font-size:0.72rem; padding:2px 8px; background:#e8c77a22; color:#e8c77a; border-radius:99px; margin-bottom:6px; text-transform:capitalize; }
    h3 { margin:0 0 4px; color:#eee; font-size:0.95rem; line-height:1.3; }
    .year { color:#666; font-size:0.8rem; }
    .btn-watch { display:block; width:100%; margin-top:0.6rem; padding:6px; background:#2e2e3e; color:#e8c77a; border:1px solid #e8c77a33; border-radius:6px; cursor:pointer; font-size:0.8rem; }
    .btn-watch:hover { background:#3a3a4e; }
    .loading, .empty { color:#666; text-align:center; padding:3rem; }
  `]
})
export class MoviesComponent implements OnInit {
  movies:      Movie[]     = [];
  filtered:    Movie[]     = [];
  loading      = true;
  searchTerm   = '';
  genreFilter  = '';
  showForm     = false;
  adding       = false;
  addError     = '';

  newMovie: MovieCreate = { title: '', genre: 'other', release_year: new Date().getFullYear() };

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.movieService.getMovies().subscribe({
      next:  (data) => { this.movies = data; this.filtered = data; this.loading = false; },
      error: ()     => { this.loading = false; }
    });
  }

  // (click) event #1 — filter movies
  applyFilter(): void {
    this.filtered = this.movies.filter(m => {
      const matchTitle = m.title.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchGenre = !this.genreFilter || m.genre === this.genreFilter;
      return matchTitle && matchGenre;
    });
  }

  // (click) event #2 — add movie (API request)
  addMovie(): void {
    this.addError = '';
    if (!this.newMovie.title || !this.newMovie.release_year) {
      this.addError = 'Title and year are required.';
      return;
    }
    this.adding = true;
    this.movieService.addMovie(this.newMovie).subscribe({
      next: (movie) => {
        this.movies.unshift(movie);
        this.filtered.unshift(movie);
        this.showForm = false;
        this.adding   = false;
        this.newMovie = { title: '', genre: 'other', release_year: new Date().getFullYear() };
      },
      error: (e) => { this.addError = e.message; this.adding = false; }
    });
  }

  // (click) event #3 — add to watchlist (API request)
  addToWatchlist(event: Event, movieId: number): void {
    event.stopPropagation();
    this.movieService.addToWatchlist({ movie_id: movieId, status: 'want' }).subscribe();
  }
}
