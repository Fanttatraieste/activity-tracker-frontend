import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  userType: 'Student' | 'Teacher' | 'Admin';
  groupUUID?: string | null;
  subjectUUID?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080';

  // --- LOGIN ---
  login(data: AuthRequest): Observable<string> {
    return this.http.post(`${this.apiUrl}/login`, data, { responseType: 'text' })
      .pipe(
        tap(token => {
          localStorage.setItem('authToken', token);
        })
      );
  }

  // --- REGISTER ---
  register(data: RegisterRequest): Observable<string> {
    return this.http.post(`${this.apiUrl}/register`, data, { responseType: 'text' });
  }

  getToken() {
    return localStorage.getItem('authToken');
  }
}
