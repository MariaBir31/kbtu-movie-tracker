import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  // Вкладки
  activeTab: 'login' | 'register' = 'login';

  // Login form
  loginEmail = '';
  loginPassword = '';

  // Register form
  regUsername = '';
  regEmail = '';
  regPassword = '';
  regConfirm = '';

  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  onLogin() {
    if (!this.loginEmail || !this.loginPassword) {
      this.error = 'Please fill in all fields.';
      return;
    }
    this.error = '';
    this.loading = true;

    this.auth.login(this.loginEmail, this.loginPassword).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => {
        this.error = 'Invalid email or password.';
        this.loading = false;
      }
    });
  }

  onRegister() {
    if (!this.regUsername || !this.regEmail || !this.regPassword) {
      this.error = 'Please fill in all fields.';
      return;
    }
    if (this.regPassword !== this.regConfirm) {
      this.error = 'Passwords do not match.';
      return;
    }
    this.error = '';
    this.loading = true;

    this.auth.register(this.regUsername, this.regEmail, this.regPassword).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        const errors = err.error;
        if (errors.email) this.error = 'Email: ' + errors.email[0];
        else if (errors.username) this.error = 'Username: ' + errors.username[0];
        else if (errors.password) this.error = 'Password: ' + errors.password[0];
        else this.error = 'Registration failed. Try again.';
        this.loading = false;
      }
    });
  }

  switchTab(tab: 'login' | 'register') {
    this.activeTab = tab;
    this.error = '';
  }
}