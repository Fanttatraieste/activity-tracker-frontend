import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Interfata care defineste structura profilului de utilizator.
 * Aceasta trebuie sa corespunda cu 'UserProfileResponseDto' din Backend-ul Java.
 */
export interface UserProfile {
  nume: string;
  prenume: string;
  emailPersonal: string;
  emailAcademic: string;
  telefon: string;
  nrMatricol: string;
  codStudent: string;
  specializare: string;
  grupa: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  // Injectarea HttpClient pentru apeluri asincrone catre server
  private http = inject(HttpClient);

  // Endpoint-ul de baza pentru operatiile asupra profilului
  private apiUrl = 'http://localhost:8080/api/users/profile';

  /**
   * Recupereaza datele de profil ale unui utilizator pe baza UUID-ului sau.
   * @param uuid Identificatorul unic al utilizatorului.
   * @returns Un Observable care va emite datele de profil.
   */
  getProfile(uuid: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/${uuid}`);
  }

  /**
   * Actualizeaza informatiile profilului in baza de date.
   * @param uuid Identificatorul utilizatorului de modificat.
   * @param data Obiectul cu noile valori (nume, telefon, etc.).
   * @returns Un Observable cu datele actualizate primite de la server.
   */
  updateProfile(uuid: string, data: any): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/${uuid}`, data);
  }
}
