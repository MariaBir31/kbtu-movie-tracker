import {Injectable, signal, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthResponse} from '../models/auth.models';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/trackerapp/'; 

  currentUser = signal<any>(null);


  register(userData: any) {
    return this.http.post(`${this.apiUrl}auth/register/`, userData);
  }

  login(credentials: any) {
    return this.http.post<AuthResponse>(`${this.apiUrl}auth/login/`, credentials);
  };

}
