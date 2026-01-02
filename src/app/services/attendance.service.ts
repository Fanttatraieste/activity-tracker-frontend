import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AttendanceRequest {
  userUuid: string;
  classScheduleUuid: string;
}

export interface AttendanceResponse {
  uuid: string;
  userUuid: string;
  classScheduleUuid: string;
}

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/attendance';

  createAttendance(request: AttendanceRequest): Observable<AttendanceResponse> {
    return this.http.post<AttendanceResponse>(this.apiUrl, request);
  }

  deleteAttendance(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${uuid}`);
  }
}
