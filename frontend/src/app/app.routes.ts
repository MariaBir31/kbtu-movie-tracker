import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'movies', pathMatch: 'full' },

  // Public routes
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
    title: 'Login — MovieTracker'
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent),
    title: 'Register — MovieTracker'
  },

  // Protected routes
  {
    path: 'movies',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/movies/movies.component').then(m => m.MoviesComponent),
    title: 'Browse Movies — MovieTracker'
  },
  {
    path: 'movies/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/movie-detail/movie-detail.component').then(m => m.MovieDetailComponent),
    title: 'Movie Detail — MovieTracker'
  },
  {
    path: 'watchlist',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/watchlist/watchlist.component').then(m => m.WatchlistComponent),
    title: 'My Watchlist — MovieTracker'
  },

  { path: '**', redirectTo: 'movies' }
];
