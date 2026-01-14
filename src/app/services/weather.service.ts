import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Reprezinta starea vremii pentru o singura ora.
 */
export interface WeatherHour {
  hour: number;      // Ex: 8, 10, 14
  temp: number;      // Temperatura in grade Celsius
  condition: string; // Ex: "Sunny", "Partly Cloudy", "Rain"
}

/**
 * Reprezinta prognoza pentru o zi intreaga,
 * continand o lista de intervale orare.
 */
export interface WeatherDay {
  day_name: string; // Numele zilei in romana (Luni, Marti etc.)
  hours: WeatherHour[];
}

/**
 * Raspunsul complet de la API.
 * Este un obiect de tip dictionar unde cheia este data calendaristica.
 * Exemplu: { "2026-01-14": { day_name: "Miercuri", hours: [...] } }
 */
export interface WeatherResponse {
  [date: string]: WeatherDay;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private http = inject(HttpClient);

  // Endpoint-ul catre controller-ul Java care apeleaza un API extern de vreme
  private apiUrl = '/api/weather';

  /**
   * Recupereaza prognoza meteo pentru saptamana curenta.
   * Datele sunt folosite de TimetableGrid pentru a afisa iconite meteo pe cursuri.
   */
  getWeather(): Observable<WeatherResponse> {
    return this.http.get<WeatherResponse>(this.apiUrl);
  }
}
