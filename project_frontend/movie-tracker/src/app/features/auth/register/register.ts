import { Component,inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';
import {Router, RouterLink} from '@angular/router';
@Component({
  selector: 'app-register',
  standalone:true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private authService = inject(AuthService);
  private router = inject(Router);

  userObj = { username: '',
    email: '',
    password: '',
    password2: '' };
  errorMessage = '';

  onRegister() {
    console.log('Attempting to register:', this.userObj); 

    this.authService.register(this.userObj).subscribe({
      next: (res: any) => {
        if (res.access) {
          localStorage.setItem('access', res.access);
          localStorage.setItem('refresh', res.refresh);
        }

        console.log('Registration successful, moving to library...');

        this.router.navigate(['/cabinet']);
      },
      error: (err) => {
        this.errorMessage = 'Registration Failed. Please try again.';
        console.error(err);
      }
    });
  }
}
