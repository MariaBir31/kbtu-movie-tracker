import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar';
import { WatchlistComponent } from './watchlist/watchlist';
import { WatchlistService } from './services/watchlist.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, WatchlistComponent],
  templateUrl: './app.html',
})
export class App {
  isAdmin = true; // временно true для теста
  currentUser: any = null;

  constructor(public watchlistService: WatchlistService) {}

  logout() {
    this.currentUser = null;
  }
}