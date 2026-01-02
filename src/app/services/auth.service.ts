import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface UserPayload {
  uuid: string;
  sub: string;
  role: string;
}

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
  private apiUrl = 'http://localhost:8080/api/auth'; // Am adăugat prefixul aici pentru simplitate

  login(data: AuthRequest): Observable<string> {
    return this.http.post(`${this.apiUrl}/login`, data, { responseType: 'text' })
      .pipe(
        tap(token => {
          localStorage.setItem('authToken', token);
        })
      );
  }

  register(data: RegisterRequest): Observable<string> {
    return this.http.post(`${this.apiUrl}/register`, data, { responseType: 'text' });
  }

  getCurrentUser(): UserPayload | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join(''));

      const decoded = JSON.parse(jsonPayload);
      return {
        uuid: decoded.uuid,
        sub: decoded.sub,
        role: decoded.role
      } as UserPayload;
    } catch (e) {
      return null;
    }
  }

  getToken() {
    return localStorage.getItem('authToken');
  }

  logout() {
    localStorage.removeItem('authToken');
  }
}
