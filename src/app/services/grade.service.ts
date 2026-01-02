import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface GradeRequest {
  userUuid: string;
  classScheduleUuid: string;
  value: number;
  weight: number;
  note?: string;
}

export interface GradeResponse {
  uuid: string;
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
  private apiUrl = 'http://localhost:8080/api/grades';

  addGrade(request: GradeRequest): Observable<GradeResponse> {
    return this.http.post<GradeResponse>(this.apiUrl, request);
  }

  getGradesByUser(userUuid: string): Observable<GradeResponse[]> {
    return this.http.get<GradeResponse[]>(`${this.apiUrl}/user/${userUuid}`);
  }


}
