import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ClassNotesRequestDto {
  userUuid: string;
  classScheduleUuid: string;
  note: string;
  classNumber: number;
}

export interface ClassNotesResponseDto extends ClassNotesRequestDto {
  uuid: string;
}

@Injectable({ providedIn: 'root' })
export class ClassNotesService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/class-notes';

  getNoteByWeek(userUuid: string, scheduleUuid: string, week: number): Observable<ClassNotesResponseDto> {
    const params = new HttpParams()
      .set('userUuid', userUuid)
      .set('scheduleUuid', scheduleUuid)
      .set('week', week.toString());
    return this.http.get<ClassNotesResponseDto>(`${this.apiUrl}/find`, { params });
  }

  create(dto: ClassNotesRequestDto) { return this.http.post<ClassNotesResponseDto>(this.apiUrl, dto); }
  update(uuid: string, dto: ClassNotesRequestDto) { return this.http.put<ClassNotesResponseDto>(`${this.apiUrl}/${uuid}`, dto); }
}
