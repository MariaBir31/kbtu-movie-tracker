import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  template: `
    <div class="auth-wrap">
      <div class="auth-card">
        <h1>🎬 MovieTracker</h1>
        <h2>Create an account</h2>

        <div class="error" *ngIf="error">{{ error }}</div>
        <div class="success" *ngIf="success">{{ success }}</div>

        <form (ngSubmit)="onSubmit()">
          <label>Username
            <input type="text" [(ngModel)]="form.username" name="username" required placeholder="choose a username" />
          </label>
          <label>Email
            <input type="email" [(ngModel)]="form.email" name="email" required placeholder="you@email.com" />
          </label>
          <label>Password
            <input type="password" [(ngModel)]="form.password" name="password" required placeholder="min 8 characters" />
          </label>
          <label>Confirm password
            <input type="password" [(ngModel)]="form.password2" name="password2" required placeholder="repeat password" />
          </label>
          <button type="submit" [disabled]="loading">
            {{ loading ? 'Creating account…' : 'Create account' }}
          </button>
        </form>

        <p class="switch">Already have an account? <a routerLink="/login">Sign in</a></p>
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
    button:disabled { opacity:0.6; }
    .error { background:#3d1515; color:#f08080; padding:10px 12px; border-radius:8px; margin-bottom:1rem; font-size:0.85rem; }
    .success { background:#153d1a; color:#80e0a0; padding:10px 12px; border-radius:8px; margin-bottom:1rem; font-size:0.85rem; }
    .switch { text-align:center; margin:1rem 0 0; color:#888; font-size:0.85rem; }
    .switch a { color:#e8c77a; }
  `]
})
export class RegisterComponent {
  form = { username: '', email: '', password: '', password2: '' };
  error   = '';
  success = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(): void {
    this.error = '';
    if (this.form.password !== this.form.password2) {
      this.error = 'Passwords do not match.';
      return;
    }
    this.loading = true;
    this.auth.register(this.form).subscribe({
      next: () => this.router.navigate(['/movies']),
      error: (e) => { this.error = e.message; this.loading = false; }
    });
  }
}
