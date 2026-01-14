import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * DTO pentru trimiterea notitei catre server.
 * Include numarul saptamanii (classNumber) pentru contextul temporal.
 */
export interface ClassNotesRequestDto {
  userUuid: string;
  classScheduleUuid: string;
  note: string;
  classNumber: number; // Reprezinta saptamana (ex: saptamana 5)
}

/**
 * DTO primit de la server, care include si UUID-ul unic al notitei.
 */
export interface ClassNotesResponseDto extends ClassNotesRequestDto {
  uuid: string;
}

@Injectable({ providedIn: 'root' })
export class ClassNotesService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/class-notes';

  /**
   * Recupereaza notita specifica unei anumite saptamani.
   * Utilizam HttpParams pentru a construi un URL de tip Query:
   * ?userUuid=...&scheduleUuid=...&week=...
   */
  getNoteByWeek(userUuid: string, scheduleUuid: string, week: number): Observable<ClassNotesResponseDto> {
    const params = new HttpParams()
      .set('userUuid', userUuid)
      .set('scheduleUuid', scheduleUuid)
      .set('week', week.toString());

    return this.http.get<ClassNotesResponseDto>(`${this.apiUrl}/find`, { params });
  }

  /**
   * Creeaza o notita noua pentru o saptamana care nu avea date salvate.
   */
  create(dto: ClassNotesRequestDto) {
    return this.http.post<ClassNotesResponseDto>(this.apiUrl, dto);
  }

  /**
   * Actualizeaza continutul unei notite existente folosind ID-ul ei unic.
   */
  update(uuid: string, dto: ClassNotesRequestDto) {
    return this.http.put<ClassNotesResponseDto>(`${this.apiUrl}/${uuid}`, dto);
  }
}
