import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './sidebar/sidebar';
import { Watchlist } from './watchlist/watchlist';
import { AuthService } from './services/auth.service';
import { WatchlistService } from './services/watchlist.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Sidebar, Watchlist],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  constructor(
    public auth: AuthService,
    public watchlist: WatchlistService
  ) {}

  ngOnInit() {
    if (this.auth.getToken()) {
      this.watchlist.load().subscribe();
    }
  }

  logout() {
    this.auth.logout().subscribe();
  }
}