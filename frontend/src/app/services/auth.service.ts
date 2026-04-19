import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthTokens, LoginRequest, RegisterRequest } from '../models';

const API = 'http://localhost:8000/api';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedIn$ = new BehaviorSubject<boolean>(this.hasToken());

  isLoggedIn$ = this.loggedIn$.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  // ── Token helpers ────────────────────────────────────────
  private hasToken(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private saveTokens(tokens: AuthTokens): void {
    localStorage.setItem('access_token',  tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    this.loggedIn$.next(true);
  }

  private clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.loggedIn$.next(false);
  }

  // ── Auth calls ───────────────────────────────────────────
  login(data: LoginRequest): Observable<AuthTokens> {
    return this.http.post<AuthTokens>(`${API}/auth/login/`, data).pipe(
      tap(tokens => this.saveTokens(tokens))
    );
  }

  register(data: RegisterRequest): Observable<AuthTokens & { message: string }> {
    return this.http.post<AuthTokens & { message: string }>(`${API}/auth/register/`, data).pipe(
      tap(res => this.saveTokens(res))
    );
  }

  logout(): void {
    const refresh = localStorage.getItem('refresh_token');
    // Best-effort blacklist — navigate regardless
    if (refresh) {
      this.http.post(`${API}/auth/logout/`, { refresh }).subscribe();
    }
    this.clearTokens();
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<AuthTokens> {
    const refresh = localStorage.getItem('refresh_token') ?? '';
    return this.http.post<AuthTokens>(`${API}/auth/refresh/`, { refresh }).pipe(
      tap(tokens => this.saveTokens(tokens))
    );
  }
}
