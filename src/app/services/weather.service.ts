import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface WeatherHour {
  hour: number;
  temp: number;
  condition: string;
}

export interface WeatherDay {
  day_name: string; // "Luni", "Marti"...
  hours: WeatherHour[];
}

export interface WeatherResponse {
  [date: string]: WeatherDay;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private http = inject(HttpClient);
  private apiUrl = '/api/weather';

  getWeather(): Observable<WeatherResponse> {
    return this.http.get<WeatherResponse>(this.apiUrl);
  }
}
