import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
})
export class App {

  movies = [
    { title: 'Inception', year: 2010, image: 'https://via.placeholder.com/300x200' },
    { title: 'Interstellar', year: 2014, image: 'https://via.placeholder.com/300x200' }
  ];

  watchlist = [
    { title: 'Avatar' }
  ];
}