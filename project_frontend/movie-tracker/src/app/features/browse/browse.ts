import { Component,OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MovieService, Movie } from '../../core/services/movie';
@Component({
  selector: 'app-browse',
  imports: [CommonModule,FormsModule,RouterLink],
  templateUrl: './browse.html',
  styleUrl: './browse.css',
})
export class Browse implements OnInit {
  private movieService = inject(MovieService);

  allMovies = signal<Movie[]>([]);
  searchQuery = signal<string>('');
  selectedGenre = signal<string>('All');

  filteredMovies = computed(() => {
    return this.allMovies().filter(movie => {
      const matchesSearch = movie.title.toLowerCase().includes(this.searchQuery().toLowerCase());

      const matchesGenre = this.selectedGenre() === 'All' ||
        movie.genre.toLowerCase() === this.selectedGenre().toLowerCase();

      return matchesSearch && matchesGenre;
    });
  });

  ngOnInit() {
    this.movieService.getMovies().subscribe(movies => this.allMovies.set(movies));
  }

  setGenre(genre: string) {
    this.selectedGenre.set(genre);
  }

  quickAddToWatchlist(movieId: number) {
    this.movieService.addToWatchlist(movieId, 'want').subscribe({
      next: () => alert('Added to My Library!'),
      error: (err) => {
        if (err.status === 400) {
          alert('This movie is already in your library!');
        }
      }
    });
  }
}
