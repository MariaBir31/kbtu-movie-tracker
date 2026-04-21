import { Component,inject,signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
@Component({
  selector: 'app-login',
  imports: [FormsModule,RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  // This matches your LoginSerializer fields exactly
  loginObj = {
    username: '',
    password: ''
  };

  errorMessage = signal('');

  onLogin() {
    this.authService.login(this.loginObj).subscribe({
      next: (res: any) => {
        // FIX: Use 'access' to match your Django fbv.py return value
        localStorage.setItem('access', res.access);
        localStorage.setItem('refresh', res.refresh);

        console.log('Login successful!');
        this.router.navigate(['/cabinet']);
      },
      error: (err) => {
        this.errorMessage.set('Invalid username or password');
        console.error('Login error:', err);
      }
    });
  }
}
