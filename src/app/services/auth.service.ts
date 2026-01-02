import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface UserPayload {
  uuid: string;
  sub: string; // De obicei email-ul/username-ul
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

  getCurrentUser(): UserPayload | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const decoded = JSON.parse(jsonPayload);

      // --- ADAUGĂ ACEST LOG ---
      console.log("JWT Payload decodat complet:", decoded);

      // Verificăm dacă UUID-ul este pe alt nume (uneori e 'id' sau 'userId')
      const userUuid = decoded.uuid || decoded.id || decoded.userId;

      return {
        uuid: decoded.uuid || decoded.id || decoded.userId, // Încearcă toate variantele posibile
        sub: decoded.sub,
        role: decoded.role
      } as UserPayload;

    } catch (e) {
      console.error("Eroare la decodarea token-ului", e);
      return null;
    }
  }

  // --- REGISTER ---
  register(data: RegisterRequest): Observable<string> {
    return this.http.post(`${this.apiUrl}/register`, data, { responseType: 'text' });
  }

  getToken() {
    return localStorage.getItem('authToken');
  }
}
