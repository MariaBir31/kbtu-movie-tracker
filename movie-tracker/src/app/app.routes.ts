import { Routes } from '@angular/router';
import { AllMoviesComponent } from './all-movies-component/all-movies-component';
import { Register } from './register/register';
import { AddMovie } from './add-movie/add-movie';
import { MovieDetail } from './movie-detail/movie-detail';
import { Watchlist } from './watchlist/watchlist';

export const routes: Routes = [
  { path: '', component: AllMoviesComponent },
  { path: 'register', component: Register },
  { path: 'add', component: AddMovie },
  { path: 'movie/:id', component: MovieDetail },
  { path: 'watchlist', component: Watchlist },
  { path: '**', redirectTo: '' }
];