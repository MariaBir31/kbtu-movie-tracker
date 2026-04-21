import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService } from '../services/movie.service';
import { WatchlistService } from '../services/watchlist.service';
import { AuthService } from '../services/auth.service';
import { Movie } from '../models/movie.model';
import { MovieCard } from '../movie-card/movie-card';

@Component({
  selector: 'app-all-movies',
  standalone: true,
  imports: [CommonModule, MovieCard],
  templateUrl: './all-movies-component.html',
  styleUrls: ['./all-movies-component.css']
})
export class AllMoviesComponent implements OnInit {
  movies: Movie[] = [];
  error = '';
  loading = true;

  constructor(
    private movieService: MovieService,
    public watchlist: WatchlistService,
    public auth: AuthService
  ) {}

  ngOnInit() {
  this.movieService.getMovies().subscribe({
    next: data => {
      this.movies = data;
      this.loading = false;
    },
    error: () => {
      this.error = 'Failed to load movies. Please try again later.';
      this.loading = false;
    }
  });
}

  addToWatchlist(movie: Movie) {
    this.watchlist.add(movie.id).subscribe({
      error: () => this.error = 'Failed to add to watchlist.'
    });
  }

  deleteMovie(id: number) {
    this.movieService.deleteMovie(id).subscribe({
      next: () => this.movies = this.movies.filter(m => m.id !== id),
      error: () => this.error = 'Failed to delete movie.'
    });
  }
}