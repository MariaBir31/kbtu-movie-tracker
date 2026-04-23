import {Component, OnInit, inject, signal} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MovieService, Movie} from '../../core/services/movie';

@Component({
  selector: 'app-movie-details',
  imports: [RouterLink,FormsModule,CommonModule],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.css',
})
export class MovieDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private movieService = inject(MovieService);

  movie = signal<Movie | null>(null);
  reviews = signal<any[]>([]); 
  newReviewText = '';
  userRating = signal<number>(0);
  avgRating = signal<number>(0);
  ratingsCount = signal<number>(0);
  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.movieService.getMovieById(id).subscribe(data => this.movie.set(data));

      this.movieService.getMovieRating(id).subscribe(stats => {
        this.avgRating.set(stats.avg_rating);
        this.ratingsCount.set(stats.ratings_count);
      });
      this.movieService.getReviewsForMovie(id).subscribe(res => {
        this.reviews.set(res);
      });
    }
  }
  setRating(val: number) {
            this.userRating.set(val);
            const movieId = this.movie()?.id;
            const rating10 = val * 2;

            if (movieId) {
              this.movieService.updateMovieRating(movieId, rating10).subscribe({
                next: (res) => {
                  console.log('Saved!', res);

                  this.refreshStats(movieId);
        },
        error: (err) => {
          if (err.status === 404) {
            alert("Please add the movie to your Watchlist before rating!");
          }
        }
      });
    }
  }
  refreshStats(id: number) {
    this.movieService.getMovieRating(id).subscribe(stats => {
      this.avgRating.set(stats.avg_rating);
      this.ratingsCount.set(stats.ratings_count);
    });
  }


  postReview() {
    const movieId = this.movie()?.id;
    if (movieId && this.newReviewText.trim()) {
      this.movieService.addReview(movieId, this.newReviewText).subscribe(newRev => {
        this.reviews.update(all => [newRev, ...all]); 
        this.newReviewText = ''; 
      });
    }
  }
  addToWatchlist() {
    const m = this.movie();
    if (m && m.id) {
      this.movieService.addToWatchlist(m.id).subscribe({
        next: (response) => {
          alert('Added to your library!');
          console.log('Success:', response);
        },
        error: (err) => {
          console.error('Error adding to watchlist:', err);
        }
      });
    }
  }
}
