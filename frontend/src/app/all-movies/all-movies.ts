import { Component, OnInit } from '@angular/core';
import { MovieService } from '../services/movie';
import { WatchlistService } from '../services/watchlist.service';
import { Movie } from '../models/movie.model';
import { MovieCardComponent } from '../movie-card/movie-card';

@Component({
  selector: 'app-all-movies',
  standalone: true,
  imports: [MovieCardComponent],
  template: `
    <h1>All Movies</h1>
    <div class="movies">
      @for (movie of movies; track movie.id) {
        <app-movie-card 
          [movie]="movie" 
          [isAdmin]="isAdmin"
          (onAdd)="watchlistService.add($event)"
          (onDelete)="deleteMovie($event)">
        </app-movie-card>
      } @empty {
        <p>Films not found...</p>
      }
    </div>
  `
})
export class AllMoviesComponent implements OnInit {
  movies: Movie[] = [];
  isAdmin = true;

  constructor(
    private movieService: MovieService,
    public watchlistService: WatchlistService
  ) {}

  ngOnInit() {
    this.movieService.getMovies().subscribe(data => this.movies = data);
  }

  deleteMovie(id: number) {
    this.movieService.deleteMovie(id).subscribe(() => {
      this.movies = this.movies.filter(m => m.id !== id);
    });
  }
}