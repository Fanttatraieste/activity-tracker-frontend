import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Structura unui obiect "ora" din Python
export interface WeatherHour {
  hour: number;
  temp: number;
  condition: string;
}

// Structura unei "zile" din Python
export interface WeatherDay {
  day_name: string; // "Luni", "Marti"...
  hours: WeatherHour[];
}

// Răspunsul este un Dictionar: { "2023-12-10": WeatherDay, ... }
export interface WeatherResponse {
  [date: string]: WeatherDay;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private http = inject(HttpClient);
  // URL-ul backend-ului tau Java
  private apiUrl = 'http://localhost:8080/api/weather';

  getWeather(): Observable<WeatherResponse> {
    // Interceptorul creat anterior va pune automat Token-ul JWT,
    // deci nu trebuie sa faci nimic special pentru auth aici.
    return this.http.get<WeatherResponse>(this.apiUrl);
  }
}
