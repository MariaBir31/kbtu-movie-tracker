import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  // Данные привязаны через [(ngModel)]
  user = {
    email: '',
    password: '',
    username: ''
  };

  constructor(private router: Router) {}

  onRegister() {
    if (this.user.email && this.user.password) {
      // Здесь в будущем будет вызов сервиса: this.authService.register(this.user)
      console.log('User registered:', this.user);
      alert('Регистрация успешна!');
      this.router.navigate(['/']); // Возвращаемся на главную
    } else {
      alert('Пожалуйста, заполните все поля');
    }
  }
}