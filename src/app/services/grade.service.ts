import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Interfata pentru adaugarea unei note noi.
 */
export interface GradeRequest {
  userUuid: string;          // Studentul caruia ii apartine nota
  classScheduleUuid: string; // Materia/Activitatea din orar
  value: number;             // Nota propriu-zisa (ex: 10)
  weight: number;            // Ponderea notei in medie (ex: 0.2 pentru 20%)
  note?: string;             // Observatii optionale (ex: "Examen partial")
}

/**
 * Interfata pentru nota primita de la server.
 */
export interface GradeResponse {
  uuid: string;              // ID-ul unic al notei in baza de date
  userUuid: string;
  classScheduleUuid: string;
  value: number;
  weight: number;
  note?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GradeService {
  private http = inject(HttpClient);

  // Endpoint-ul API-ului din backend-ul Java Spring Boot
  private apiUrl = 'http://localhost:8080/api/grades';

  /**
   * Salveaza o nota noua in baza de date.
   */
  addGrade(request: GradeRequest): Observable<GradeResponse> {
    return this.http.post<GradeResponse>(this.apiUrl, request);
  }

  /**
   * Recupereaza toate notele unui utilizator specific.
   * Utila pentru afisarea catalogului complet al studentului.
   */
  getGradesByUser(userUuid: string): Observable<GradeResponse[]> {
    return this.http.get<GradeResponse[]>(`${this.apiUrl}/user/${userUuid}`);
  }
}
