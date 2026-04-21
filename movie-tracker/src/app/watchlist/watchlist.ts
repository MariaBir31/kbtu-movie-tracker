import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WatchlistItem } from '../models/movie.model';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './watchlist.html',
  styleUrls: ['./watchlist.css']
})
export class Watchlist {
  @Input() items: WatchlistItem[] = [];
  @Output() remove = new EventEmitter<number>();
}