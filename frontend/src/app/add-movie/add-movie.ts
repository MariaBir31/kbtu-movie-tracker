import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../services/movie';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-movie',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-movie.html',
  styleUrls: ['./add-movie.css']
})
export class AddMovieComponent {
  // Структура для нового фильма
  newMovie = {
    title: '',
    year: 2024,
    image: ''
  };

  constructor(private movieService: MovieService, private router: Router) {}

  onSubmit() {
    if (this.newMovie.title && this.newMovie.image) {
      this.movieService.addMovie(this.newMovie).subscribe({
        next: (res) => {
          alert('Фильм успешно добавлен!');
          this.router.navigate(['/']); // Редирект на список фильмов
        },
        error: (err) => {
          alert('Ошибка при сохранении: ' + err.message);
        }
      });
    }
  }
}