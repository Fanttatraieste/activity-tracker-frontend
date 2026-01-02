import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interface matching your Backend UserProfileResponseDto
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

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/users/profile';

  // GET profile data
  getProfile(uuid: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/${uuid}`);
  }

  // UPDATE profile data
  updateProfile(uuid: string, data: any): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/${uuid}`, data);
  }
}
