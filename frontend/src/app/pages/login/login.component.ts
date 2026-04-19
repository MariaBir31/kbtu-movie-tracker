import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  template: `
    <div class="auth-wrap">
      <div class="auth-card">
        <h1>🎬 MovieTracker</h1>
        <h2>Sign in</h2>

        <div class="error" *ngIf="error">{{ error }}</div>

        <form (ngSubmit)="onSubmit()">
          <label>Username
            <input type="text" [(ngModel)]="username" name="username" required placeholder="your username" />
          </label>
          <label>Password
            <input type="password" [(ngModel)]="password" name="password" required placeholder="••••••••" />
          </label>
          <button type="submit" [disabled]="loading">
            {{ loading ? 'Signing in…' : 'Sign in' }}
          </button>
        </form>

        <p class="switch">No account? <a routerLink="/register">Register</a></p>
      </div>
    </div>
  `,
  styles: [`
    .auth-wrap { min-height:100vh; display:flex; align-items:center; justify-content:center; background:#0f0f13; }
    .auth-card { background:#1a1a23; border:1px solid #2e2e3e; border-radius:16px; padding:2.5rem; width:100%; max-width:400px; }
    h1 { margin:0 0 0.25rem; font-size:1.4rem; color:#e8c77a; }
    h2 { margin:0 0 1.5rem; font-size:1rem; color:#888; font-weight:400; }
    label { display:block; margin-bottom:1rem; color:#bbb; font-size:0.85rem; }
    input { display:block; width:100%; margin-top:6px; padding:10px 12px; background:#0f0f13; border:1px solid #2e2e3e; border-radius:8px; color:#eee; font-size:0.95rem; box-sizing:border-box; }
    input:focus { outline:none; border-color:#e8c77a; }
    button { width:100%; padding:11px; background:#e8c77a; color:#0f0f13; border:none; border-radius:8px; font-weight:700; font-size:0.95rem; cursor:pointer; margin-top:0.5rem; }
    button:disabled { opacity:0.6; cursor:not-allowed; }
    .error { background:#3d1515; color:#f08080; padding:10px 12px; border-radius:8px; margin-bottom:1rem; font-size:0.85rem; }
    .switch { text-align:center; margin:1rem 0 0; color:#888; font-size:0.85rem; }
    .switch a { color:#e8c77a; }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  error    = '';
  loading  = false;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(): void {
    this.error   = '';
    this.loading = true;
    this.auth.login({ username: this.username, password: this.password }).subscribe({
      next:  ()  => this.router.navigate(['/movies']),
      error: (e) => { this.error = e.message; this.loading = false; }
    });
  }
}
