// ─── Auth ────────────────────────────────────────────────────
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  password2: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

// ─── User ────────────────────────────────────────────────────
export interface User {
  id: number;
  username: string;
}

// ─── Movie ───────────────────────────────────────────────────
export interface Movie {
  id: number;
  title: string;
  genre: string;
  release_year: number;
  description: string;
  poster_url: string | null;
  added_by: User;
  created_at: string;
}

export interface MovieCreate {
  title: string;
  genre: string;
  release_year: number;
  description?: string;
  poster_url?: string;
}

// ─── WatchEntry ──────────────────────────────────────────────
export type WatchStatus = 'watched' | 'want';

export interface WatchEntry {
  id: number;
  movie: Movie;
  status: WatchStatus;
  rating: number | null;
  watched_at: string | null;
  note: string;
}

export interface WatchEntryCreate {
  movie_id: number;
  status: WatchStatus;
  rating?: number | null;
  watched_at?: string | null;
  note?: string;
}

// ─── Review ──────────────────────────────────────────────────
export interface Review {
  id: number;
  user: User;
  movie: number;
  body: string;
  created_at: string;
}

export interface ReviewCreate {
  body: string;
}
