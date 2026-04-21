import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { User } from '../models/movie.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';
  
  currentUser = signal<User | null>(null);
  isAdmin = signal(false);

  constructor(private http: HttpClient) {
    const saved = localStorage.getItem('user');
    if (saved) {
      const user: User = JSON.parse(saved);
      this.currentUser.set(user);
      this.isAdmin.set(user.is_staff);
    }
  }

  login(email: string, password: string) {
    return this.http.post<{ token: string; user: User }>(
      `${this.apiUrl}/auth/login/`, { email, password }
    ).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.currentUser.set(res.user);
        this.isAdmin.set(res.user.is_staff);
      })
    );
  }

  register(username: string, email: string, password: string) {
    return this.http.post<{ token: string; user: User }>(
      `${this.apiUrl}/auth/register/`, { username, email, password }
    ).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.currentUser.set(res.user);
        this.isAdmin.set(res.user.is_staff);
      })
    );
  }

  logout() {
    return this.http.post(`${this.apiUrl}/auth/logout/`, {}).pipe(
      tap(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.currentUser.set(null);
        this.isAdmin.set(false);
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}