import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Interfata pentru trimiterea unei cereri de prezenta.
 * Leaga un utilizator de o activitate specifica din orar.
 */
export interface AttendanceRequest {
  userUuid: string;
  classScheduleUuid: string;
}

/**
 * Interfata pentru raspunsul primit de la server.
 * Include UUID-ul unic al inregistrarii de prezenta din baza de date.
 */
export interface AttendanceResponse {
  uuid: string;
  userUuid: string;
  classScheduleUuid: string;
}

@Injectable({
  providedIn: 'root' // Serviciul este disponibil la nivelul intregii aplicatii
})
export class AttendanceService {
  // Injectarea HttpClient folosind functia inject() (standard Angular 16+)
  private http = inject(HttpClient);

  // URL-ul catre endpoint-ul de Backend (Spring Boot)
  private apiUrl = 'http://localhost:8080/api/attendance';

  /**
   * Trimite o cerere POST pentru a marca o prezenta noua.
   * @param request Obiectul care contine UUID-ul userului si al activitatii.
   * @returns Un Observable cu detaliile prezentei create.
   */
  createAttendance(request: AttendanceRequest): Observable<AttendanceResponse> {
    return this.http.post<AttendanceResponse>(this.apiUrl, request);
  }

  /**
   * Trimite o cerere DELETE pentru a anula o prezenta marcata anterior.
   * @param uuid Identificatorul unic al inregistrarii de prezenta care trebuie stearsa.
   */
  deleteAttendance(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${uuid}`);
  }
}
