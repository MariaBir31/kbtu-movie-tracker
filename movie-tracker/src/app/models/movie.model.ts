export interface Movie {
  id: number;
  title: string;
  year: number;
  image: string;
  description: string;
  genre: number;
  genre_name?: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
}

export interface Review {
  id: number;
  movie: number;
  user: number;
  username?: string;
  text: string;
  rating: number;
  created_at: string;
}

export interface WatchlistItem {
  id: number;
  movie: Movie;
}