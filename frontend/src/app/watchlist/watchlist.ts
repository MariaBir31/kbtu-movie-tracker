import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie } from '../models/movie.model';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './watchlist.html',
  styleUrls: ['./watchlist.css']
})
export class WatchlistComponent {
  @Input() items: Movie[] = [];
  
  @Output() remove = new EventEmitter<number>();

  onRemove(id: number) {
    this.remove.emit(id);
  }
}