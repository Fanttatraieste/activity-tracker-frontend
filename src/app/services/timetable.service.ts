import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimetableService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/class-schedules';

  // This matches the @GetMapping("/filter") in your colleagues' ClassScheduleController
  getScheduleFromApi(classType?: string, classFrequency?: string): Observable<any[]> {
    let params = new HttpParams();
    if (classType) params = params.set('classType', classType);
    if (classFrequency) params = params.set('classFrequency', classFrequency);

    return this.http.get<any[]>(`${this.apiUrl}/filter`, { params });
  }
}
