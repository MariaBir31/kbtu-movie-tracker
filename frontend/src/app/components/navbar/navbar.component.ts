import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav *ngIf="auth.isLoggedIn$ | async">
      <a class="brand" routerLink="/movies">🎬 MovieTracker</a>
      <div class="links">
        <a routerLink="/movies"    routerLinkActive="active">Browse</a>
        <a routerLink="/watchlist" routerLinkActive="active">My List</a>
        <button (click)="auth.logout()">Logout</button>
      </div>
    </nav>
  `,
  styles: [`
    nav { display:flex; align-items:center; justify-content:space-between; padding:0 2rem; height:52px; background:#111118; border-bottom:1px solid #1e1e2e; position:sticky; top:0; z-index:100; }
    .brand { color:#e8c77a; font-weight:700; font-size:1rem; text-decoration:none; }
    .links { display:flex; align-items:center; gap:1.5rem; }
    .links a { color:#888; text-decoration:none; font-size:0.875rem; }
    .links a.active { color:#eee; }
    .links button { background:none; border:1px solid #2e2e3e; color:#888; padding:5px 14px; border-radius:6px; cursor:pointer; font-size:0.83rem; }
    .links button:hover { color:#eee; border-color:#4e4e6e; }
  `]
})
export class NavbarComponent {
  constructor(public auth: AuthService) {}
}
