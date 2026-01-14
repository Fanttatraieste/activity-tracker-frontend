import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimetableService {
  // Injectarea serviciului HttpClient pentru a efectua cereri HTTP
  private http = inject(HttpClient);

  // Endpoint-ul API-ului definit in controllerul Spring Boot
  private apiUrl = 'http://localhost:8080/api/class-schedules';

  /**
   * Recupereaza activitatile din orar folosind filtre optionale.
   * @param classType - Tipul activitatii (ex: 'Course', 'Laboratory', 'Seminar')
   * @param classFrequency - Frecventa (ex: 'Week1', 'Week2' sau 'EveryWeek')
   * @returns Un Observable care emite un array cu obiectele de tip ClassSchedule
   */
  getScheduleFromApi(classType?: string, classFrequency?: string): Observable<any[]> {
    // Utilizam HttpParams pentru a construi dinamic query string-ul (?classType=...&classFrequency=...)
    let params = new HttpParams();

    if (classType) {
      params = params.set('classType', classType);
    }

    if (classFrequency) {
      params = params.set('classFrequency', classFrequency);
    }

    // Cerere GET catre endpoint-ul de filtrare
    return this.http.get<any[]>(`${this.apiUrl}/filter`, { params });
  }
}
