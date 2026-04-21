import { Component ,inject,signal} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MovieService, Movie } from '../../core/services/movie';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-movie',
  imports: [FormsModule],
  templateUrl: './add-movie.html',
  styleUrl: './add-movie.css',
})
export class AddMovie {
  private movieService = inject(MovieService);
  private router = inject(Router);

  newMovie = {
    title: '',
    genre: '',
    release_year: 2024,
    poster_url: '',
    description: ''
  };
  submitMovie() {
    if (this.newMovie.title && this.newMovie.description) {
      this.movieService.addMovie(this.newMovie as Movie).subscribe({
        next: (res) => {
          alert('Movie added successfully!');
          this.router.navigate(['/browse']); 
        },
        error: (err) => {
          console.error('Error adding movie:', err);
          alert('Check your Django console for errors!');
        }
      });
    }
  }
}
