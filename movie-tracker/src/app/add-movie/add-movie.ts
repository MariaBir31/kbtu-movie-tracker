import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MovieService } from '../services/movie.service';
import { Genre } from '../models/movie.model';

@Component({
  selector: 'app-add-movie',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-movie.html',
  styleUrls: ['./add-movie.css']
})
export class AddMovie implements OnInit {
  title = '';
  year: number = new Date().getFullYear();
  image = '';
  description = '';
  genreId: number | null = null;
  genres: Genre[] = [];

  error = '';
  success = '';
  loading = false;

  constructor(private movieService: MovieService, public router: Router) {}

  ngOnInit() {
    this.movieService.getGenres().subscribe({
      next: data => this.genres = data,
      error: () => this.error = 'Failed to load genres.'
    });
  }

  onSubmit() {
    if (!this.title || !this.year || !this.genreId) {
      this.error = 'Please fill in all required fields.';
      return;
    }
    this.error = '';
    this.loading = true;

    this.movieService.addMovie({
      title: this.title,
      year: this.year,
      image: this.image,
      description: this.description,
      genre: this.genreId
    }).subscribe({
      next: () => {
        this.success = 'Movie added successfully!';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/']), 1500);
      },
      error: () => {
        this.error = 'Failed to add movie. Check your permissions.';
        this.loading = false;
      }
    });
  }
}