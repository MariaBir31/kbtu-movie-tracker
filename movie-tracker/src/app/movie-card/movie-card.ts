import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Movie } from '../models/movie.model';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './movie-card.html',
  styleUrls: ['./movie-card.css']
})
export class MovieCard {
  @Input() movie!: Movie;
  @Input() isAdmin = false;
  @Input() inWatchlist = false;
  @Output() addToWatchlist = new EventEmitter<Movie>();
  @Output() deleteMovie = new EventEmitter<number>();
}