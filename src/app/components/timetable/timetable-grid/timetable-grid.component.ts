import { Component, Input, OnInit, OnChanges, SimpleChanges, inject, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { EventAttendanceComponent } from './event-attendance/event-attendance.component';
import { EventGradesComponent } from './event-grades/event-grades.component';
import { WeatherResponse, WeatherService } from '../../../services/weather.service';

const KNOWN_OPTIONALS = [
  'Instruire asistata de calculator',
  'Software matematic',
  'Astronomie',
  'Analiza functionala',
  'Principiile retelelor de calculatoare',
  'Instrumente CASE',
  'Interactiunea om-calculator'
];

export interface CalendarEvent {
  id: number;
  title: string;
  type: 'lab' | 'curs' | 'sem';
  professor: string;
  room: string;
  dayIndex: number;
  startRow: number;
  span: number;
  width?: number;
  marginLeft?: number;
  isAttendanceOpen?: boolean;
  notes?: string;
  weeklyNotes: { [week: number]: string };
  attendanceCount?: number;

  weatherInfo?: {
    temp: number;
    condition: string;
    iconUrl: string;
  };
}

@Component({
  selector: 'app-timetable-grid',
  standalone: true,
  imports: [CommonModule, EventAttendanceComponent, EventGradesComponent],
  templateUrl: './timetable-grid.component.html',
  styleUrls: ['./timetable-grid.component.css']
})
export class TimetableGridComponent implements OnInit, OnChanges {

  @Input() selectedGroup: number = 331;
  @Input() selectedWeek: 1 | 2 = 1;
  @Input() activeFilters = { curs: true, sem: true, lab: true };
  @Input() optionals: string[] = []; // Lista numelor selectate

  @Input() currentDayIndex!: number;
  @Input() currentLinePosition!: number;

  @Input() showWeather: boolean = false;
  private weatherService = inject(WeatherService);
  private cdr = inject(ChangeDetectorRef);
  @Output() triggerGrades = new EventEmitter<CalendarEvent>();
  @Output() eventClicked = new EventEmitter<CalendarEvent>();
  @Output() gradesOpenRequested = new EventEmitter<CalendarEvent>();



  private http = inject(HttpClient);

  rawEvents: CalendarEvent[] = [];
  displayEvents: CalendarEvent[] = [];
  focusedDayIndex: number | null = null;
  focusedRow: number | null = null;

  private dayMapping: { [key: string]: number } = {
    'Luni': 1, 'Marti': 2, 'Miercuri': 3, 'Joi': 4, 'Vineri': 5, 'Sambata': 6, 'Duminica': 0
  };

  ngOnInit() {
    this.loadEventsFromCsv();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedGroup'] || changes['selectedWeek']) {
      this.loadEventsFromCsv();
    }
    if (changes['activeFilters'] || changes['optionals']) {
      if (this.rawEvents.length > 0) {
        this.processEventsForDisplay();
      }
    }
    if (changes['showWeather'] && this.showWeather) {
      this.fetchAndMapWeather();
    }

    if (changes['showWeather']) {
      console.log('Grid: showWeather s-a schimbat in', this.showWeather);

      if (this.showWeather) {
        this.fetchAndMapWeather();
      } else {
        this.displayEvents.forEach(ev => ev.weatherInfo = undefined);
      }
    }
  }

  fetchAndMapWeather() {
    this.weatherService.getWeather().subscribe({
      next: (data: WeatherResponse) => {
        console.log('Date vreme primite:', data);
        this.mapWeatherToEvents(data);

        this.cdr.markForCheck();
      },
      error: (err) => console.error('Eroare weather:', err)
    });
  }

  private mapWeatherToEvents(weatherData: WeatherResponse) {
    const weatherLookup = new Map<string, { temp: number, condition: string }>();

    Object.keys(weatherData).forEach(dateKey => {
      const dayData = weatherData[dateKey];
      const dayIdx = this.dayMapping[dayData.day_name]; // Convertim "Luni" -> 1

      if (dayIdx !== undefined) {
        dayData.hours.forEach(h => {
          const key = `${dayIdx}-${h.hour}`;
          weatherLookup.set(key, { temp: h.temp, condition: h.condition });
        });
      }
    });

    this.displayEvents.forEach(event => {
      const eventHour = event.startRow + 6;

      const lookupKey = `${event.dayIndex}-${eventHour}`;
      const weather = weatherLookup.get(lookupKey);

      if (weather) {
        event.weatherInfo = {
          temp: Math.round(weather.temp),
          condition: weather.condition,
          iconUrl: this.getIconForCondition(weather.condition)
        };
      }
    });
  }

  private getIconForCondition(condition: string): string {
    const cond = condition.toLowerCase();

    if (cond.includes('sun') || cond.includes('clear')) return 'assets/icons/sunny.png';
    if (cond.includes('cloud') || cond.includes('overcast')) return 'assets/icons/cloudy.png';
    if (cond.includes('rain') || cond.includes('drizzle')) return 'assets/icons/rain.png';
    if (cond.includes('snow')) return 'assets/icons/snow.png';
    if (cond.includes('thunder')) return 'assets/icons/storm.png';
    if (cond.includes('fog') || cond.includes('mist')) return 'assets/icons/fog.png';

    return 'assets/icons/cloudy.png'; // Default
  }

  loadEventsFromCsv() {
    const parity = this.selectedWeek === 1 ? 'impar' : 'par';
    const path = `assets/${this.selectedGroup}/${parity}.csv`;

    this.http.get(path, { responseType: 'text' }).subscribe({
      next: (data) => {
        this.rawEvents = this.parseCsvData(data);
        this.processEventsForDisplay();
      },
      error: (err) => {
        console.error(`Eroare CSV: ${path}`, err);
        this.rawEvents = [];
        this.displayEvents = [];
      }
    });
  }

  private processEventsForDisplay() {

    const filteredEvents = this.rawEvents.filter(ev => {

      // filtrare tip
      if (ev.type === 'curs' && !this.activeFilters.curs) return false;
      if (ev.type === 'sem' && !this.activeFilters.sem) return false;
      if (ev.type === 'lab' && !this.activeFilters.lab) return false;

      // filtrare optionale

      const isOptionalSubject = KNOWN_OPTIONALS.includes(ev.title);

      if (isOptionalSubject) {
        // verificare bifare materie
        const isSelected = this.optionals.includes(ev.title);

        // debugging
        if (!isSelected) {
          console.log(`Ascund materia: "${ev.title}" (Nu am gasit-o in lista bifata)`);
          this.optionals.forEach(opt => {
            if (opt.includes(ev.title.substring(0, 5))) {
              console.log(`   -> ATENTIE: Ai selectat "${opt}", dar in CSV este "${ev.title}". NU SUNT IDENTICE!`);
              console.log(`   -> Lungime CSV: ${ev.title.length}, Lungime Sidebar: ${opt.length}`);
            }
          });
        }
        // ------------------------------------------

        return isSelected;
      }

      return true;
    });

    this.calculateOverlaps(filteredEvents);
  }

  private parseCsvData(csvText: string): CalendarEvent[] {
    const lines = csvText.split('\n');
    const events: CalendarEvent[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line) {
        const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        const clean = (txt: string) => txt ? txt.replace(/^"|"$/g, '').trim() : '';

        if (cols.length < 8) continue;

        const title = clean(cols[1]);

        events.push({
          id: parseInt(cols[0]),
          title: title,
          type: clean(cols[2]) as 'lab' | 'curs' | 'sem',
          professor: clean(cols[3]),
          room: clean(cols[4]),
          dayIndex: parseInt(cols[5]),
          startRow: parseInt(cols[6]),
          span: parseInt(cols[7]),
          weeklyNotes: {},
          width: 100,
          marginLeft: 0
        });
      }
    }
    return events;
  }

  calculateOverlaps(eventsToProcess: CalendarEvent[]) {
    let events = eventsToProcess.map(e => ({ ...e, width: 100, marginLeft: 0 }));
    for (let i = 0; i < events.length; i++) {
      for (let j = i + 1; j < events.length; j++) {
        const ev1 = events[i];
        const ev2 = events[j];
        if (ev1.dayIndex === ev2.dayIndex) {
          const ev1End = ev1.startRow + ev1.span;
          const ev2End = ev2.startRow + ev2.span;
          if (ev1.startRow < ev2End && ev2.startRow < ev1End) {
            ev1.width = 50;
            ev1.marginLeft = 0;

            ev2.width = 50;
            ev2.marginLeft = 50;
          }
        }
      }
    }
    this.displayEvents = events;
  }

  openLink(url: string) { if(url) window.open(url, "_blank"); }
  toggleAttendance(event: CalendarEvent) { event.isAttendanceOpen = !event.isAttendanceOpen; }
  onEventClick(event: CalendarEvent) { this.eventClicked.emit(event); }
  updateAttendance(event: CalendarEvent, newCount: number) { event.attendanceCount = newCount; }
  onGradesClick(event: CalendarEvent) { this.gradesOpenRequested.emit(event); }
  handleGradesClick(event: CalendarEvent) { this.triggerGrades.emit(event); }
  toggleDayFocus(dayIndex: number) { this.focusedDayIndex = this.focusedDayIndex === dayIndex ? null : dayIndex; }
  toggleHourFocus(rowIndex: number) { this.focusedRow = this.focusedRow === rowIndex ? null : rowIndex; }
  isEventDimmed(event: CalendarEvent): boolean {
    if (this.focusedDayIndex !== null && event.dayIndex !== this.focusedDayIndex) return true;
    if (this.focusedRow !== null) {
      const eventEndRow = event.startRow + event.span;
      const coversSelectedHour = (this.focusedRow >= event.startRow && this.focusedRow < eventEndRow);
      if (!coversSelectedHour) return true;
    }
    return false;
  }
}
