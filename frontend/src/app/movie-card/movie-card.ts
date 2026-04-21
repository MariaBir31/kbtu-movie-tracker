import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Movie } from '../models/movie.model';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  template: `
    <div class="movie-card">
      <img [src]="movie.image" alt="movie">
      <div class="movie-info">
        <h3>{{ movie.title }}</h3>
        <p>{{ movie.year }}</p>
        <button class="watch-btn" (click)="onAdd.emit(movie)">+ Watchlist</button>
        @if (isAdmin) {
          <button class="delete-btn" (click)="onDelete.emit(movie.id)">Delete</button>
        }
      </div>
    </div>
  `,
  styleUrls: ['./movie-card.css']
})
export class MovieCardComponent {
  @Input() movie!: Movie;
  @Input() isAdmin = false;
  @Output() onAdd = new EventEmitter<Movie>();
  @Output() onDelete = new EventEmitter<number>();
}