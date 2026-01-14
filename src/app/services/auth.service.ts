import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

/**
 * Structura datelor extrase dintr-un Token JWT decodat.
 */
export interface UserPayload {
  uuid: string; // ID-ul unic al utilizatorului din baza de date
  sub: string;  // De obicei email-ul utilizatorului (Subject)
  role: string; // Rolul (STUDENT, TEACHER, ADMIN)
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
  private apiUrl = 'http://localhost:8080/api/auth';

  /**
   * Trimite datele de logare catre server.
   * Utilizam 'tap' pentru a salva automat token-ul in localStorage in caz de succes.
   */
  login(data: AuthRequest): Observable<string> {
    return this.http.post(`${this.apiUrl}/login`, data, { responseType: 'text' })
      .pipe(
        tap(token => {
          localStorage.setItem('authToken', token);
        })
      );
  }

  /**
   * Inregistreaza un utilizator nou (Student, Profesor sau Admin).
   */
  register(data: RegisterRequest): Observable<string> {
    return this.http.post(`${this.apiUrl}/register`, data, { responseType: 'text' });
  }

  /**
   * DECODIFICARE JWT:
   * Extrage informatiile din corpul (payload) token-ului fara a trimite o cerere la server.
   * Aceasta metoda permite aplicatiei sa stie instant cine este logat (UUID, Email, Rol).
   */
  getCurrentUser(): UserPayload | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      // Un JWT are 3 parti separate prin punct. Luam partea a doua (index 1).
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

      // Decodificam string-ul Base64 intr-un obiect JSON
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
      console.error("Eroare la decodificarea token-ului:", e);
      return null;
    }
  }

  getToken() {
    return localStorage.getItem('authToken');
  }

  /**
   * Sterge token-ul din browser, delogand utilizatorul.
   */
  logout() {
    localStorage.removeItem('authToken');
  }
}
