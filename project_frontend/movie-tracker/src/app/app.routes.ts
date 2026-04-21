import { Routes } from '@angular/router';
import { Register } from './features/auth/register/register';
import {Login} from './features/auth/login/login';
import {Cabinet} from './features/cabinet/cabinet';
import {MovieDetails} from './features/movie-details/movie-details';
import {Browse} from './features/browse/browse';
import {AddMovie} from './components/add-movie/add-movie';


export const routes: Routes = [
  { path: 'register', component: Register },
  { path: 'login', component: Login },
  { path: 'cabinet', component: Cabinet },
  { path: 'browse', component: Browse },
  { path: 'add-movie', component: AddMovie },
  { path: 'movie/:id', component: MovieDetails },
  { path: '', redirectTo: 'register', pathMatch: 'full' }
];
