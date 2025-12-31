import { Component, Input, OnInit, OnChanges, SimpleChanges, inject, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { EventAttendanceComponent } from './event-attendance/event-attendance.component';
import { EventGradesComponent } from './event-grades/event-grades.component';
import { WeatherResponse, WeatherService } from '../../../services/weather.service';
import { TimetableService } from '../../../services/timetable.service';

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
  id: any; // Schimbat in any pentru a suporta UUID-uri din DB
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
  @Input() optionals: string[] = [];

  @Input() currentDayIndex!: number;
  @Input() currentLinePosition!: number;

  @Input() showWeather: boolean = false;

  @Input() swapRequest: { grupa: string, materie: string, tip: string } | null = null;

  private weatherService = inject(WeatherService);
  private timetableService = inject(TimetableService);
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  @Output() triggerGrades = new EventEmitter<CalendarEvent>();
  @Output() eventClicked = new EventEmitter<CalendarEvent>();
  @Output() gradesOpenRequested = new EventEmitter<CalendarEvent>();

  rawEvents: CalendarEvent[] = [];
  displayEvents: CalendarEvent[] = [];
  externalEvents: CalendarEvent[] = [];
  focusedDayIndex: number | null = null;
  focusedRow: number | null = null;

  // Mapping actualizat pentru a corespunde cu formatul de pe Backend (capitalize)
  private dayMapping: { [key: string]: number } = {
    'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5,
    'Saturday': 6, 'Sunday': 0
  };

  ngOnInit() {
    this.loadEventsFromBackend();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedGroup'] || changes['selectedWeek']) {
      this.loadEventsFromBackend();
    }
    if (changes['activeFilters'] || changes['optionals']) {
      if (this.rawEvents.length > 0) {
        this.processEventsForDisplay();
      }
    }

    if (changes['showWeather']) {
      if (this.showWeather) {
        this.fetchAndMapWeather();
      } else {
        this.displayEvents.forEach(ev => ev.weatherInfo = undefined);
      }
    }

    if (changes['swapRequest'] && this.swapRequest) {
      this.loadExternalEvent(this.swapRequest);
    }
  }

  loadEventsFromBackend() {
    const frequency = this.selectedWeek === 1 ? 'Week1' : 'Week2';

    this.timetableService.getScheduleFromApi(undefined, frequency).subscribe({
      next: (data: any[]) => {
        // 1. Filtrare după grupă (331.1 -> 3311)
        const uiGroupStr = String(this.selectedGroup).replace('.', '').trim();

        const filteredByGroup = data.filter(item =>
          item.groups?.some((g: any) => String(g.number).trim() === uiGroupStr)
        );

        // 2. Mapare sigură a datelor
        this.rawEvents = filteredByGroup.map(item => {
          // Încercăm toate variantele posibile de nume din JSON-ul de Backend
          const finalTitle = item.subjectName || item.subject?.name || item.name || "Materie Lipsă";

          return {
            id: item.uuid || Math.random().toString(),
            title: finalTitle.trim(),
            type: this.mapType(item.classType),
            professor: item.location || "Profesor nespecificat",
            room: item.roomName || "Fără sală",
            dayIndex: this.dayMapping[this.capitalize(item.dayOfWeek)] || 1,
            startRow: (item.startingHour || 8) - 6,
            span: item.duration || 2,
            weeklyNotes: {},
            attendanceCount: item.attendances?.length || 0
          };
        });

        console.log(`Afișez ${this.rawEvents.length} cursuri pentru grupa ${uiGroupStr}`);
        this.processEventsForDisplay();
      },
      error: (err) => console.error("Eroare API:", err)
    });
  }
  private mapType(apiType: string): 'curs' | 'sem' | 'lab' {
    if (!apiType) return 'curs';

    const t = apiType.toLowerCase();

    // Verificăm toate variantele posibile care pot veni din DB/Enum
    if (t.includes('course') || t === 'curs') {
      return 'curs';
    }
    if (t.includes('seminar') || t === 'sem') {
      return 'sem';
    }
    if (t.includes('lab') || t.includes('laborator')) {
      return 'lab';
    }

    return 'curs'; // fallback default
  }

  private capitalize(s: string) {
    if (!s) return '';
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  }

  private processEventsForDisplay() {
    const allPotentialEvents = [...this.rawEvents, ...this.externalEvents];

    const filteredEvents = allPotentialEvents.filter(ev => {
      const isExternal = this.externalEvents.some(ext => ext.id === ev.id);
      if (isExternal) return true;

      const aFostInlocuit = this.externalEvents.some(ext =>
        ext.title.trim().toLowerCase() === ev.title.trim().toLowerCase() &&
        ext.type === ev.type
      );
      if (aFostInlocuit) return false;

      if (ev.type === 'curs' && !this.activeFilters.curs) return false;
      if (ev.type === 'sem' && !this.activeFilters.sem) return false;
      if (ev.type === 'lab' && !this.activeFilters.lab) return false;

      if (KNOWN_OPTIONALS.includes(ev.title)) {
        return this.optionals.includes(ev.title);
      }

      return true;
    });

    this.calculateOverlaps(filteredEvents);
  }

  fetchAndMapWeather() {
    this.weatherService.getWeather().subscribe({
      next: (data: WeatherResponse) => {
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
      const dayIdx = this.dayMapping[this.capitalize(dayData.day_name)];

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
    return 'assets/icons/cloudy.png';
  }

  // --- LOGICA PENTRU SWAP (CSV-urile altor grupe raman momentan pe CSV) ---
  loadExternalEvent(request: { grupa: string, materie: string, tip: string }) {
    const parity = this.selectedWeek === 1 ? 'impar' : 'par';
    let groupFolder = request.grupa.replace('Grupa ', '').trim().replace('-', '.');
    const path = `assets/${groupFolder}/${parity}.csv`;

    this.http.get(path, { responseType: 'text' }).subscribe({
      next: (data) => {
        const eventsFromOtherGroup = this.parseCsvData(data);
        let tipCautat = request.tip.toLowerCase();
        if (tipCautat.includes('laborator')) tipCautat = 'lab';
        if (tipCautat.includes('seminar')) tipCautat = 'sem';
        if (tipCautat.includes('curs')) tipCautat = 'curs';

        const foundEvent = eventsFromOtherGroup.find(ev => {
          const titluCSV = ev.title.trim().toLowerCase();
          const titluCautat = request.materie.trim().toLowerCase();
          return (titluCSV.includes(titluCautat) || titluCautat.includes(titluCSV)) && ev.type === tipCautat;
        });

        if (foundEvent) {
          foundEvent.id = 'ext-' + Math.random();
          foundEvent.notes = `(Oaspete - ${request.grupa})`;
          this.externalEvents = [foundEvent];
          this.processEventsForDisplay();
        }
      }
    });
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
        events.push({
          id: cols[0],
          title: clean(cols[1]),
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
            ev1.width = 50; ev1.marginLeft = 0;
            ev2.width = 50; ev2.marginLeft = 50;
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
      return !(this.focusedRow >= event.startRow && this.focusedRow < eventEndRow);
    }
    return false;
  }
}
