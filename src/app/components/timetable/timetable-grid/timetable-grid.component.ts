import { Component, Input, OnInit, OnChanges, SimpleChanges, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { EventAttendanceComponent } from './event-attendance/event-attendance.component';

export interface CalendarEvent {
  id: number;
  title: string;
  type: 'lab' | 'curs' | 'sem';
  professor: string;
  room: string;
  dayIndex: number;
  startRow: number;
  span: number;

  // Proprietati vizuale
  width?: number;
  marginLeft?: number;

  // Proprietati functionale
  isAttendanceOpen?: boolean;
  notes?: string;
  weeklyNotes: { [week: number]: string };
  attendanceCount?: number;
}

@Component({
  selector: 'app-timetable-grid',
  standalone: true,
  imports: [CommonModule, EventAttendanceComponent],
  templateUrl: './timetable-grid.component.html',
  styleUrls: ['./timetable-grid.component.css']
})
export class TimetableGridComponent implements OnInit, OnChanges {

  // --- INPUT-URI PENTRU SELECTIE ---
  @Input() selectedGroup: number = 331;
  @Input() selectedWeek: 1 | 2 = 1;

  // --- INPUT PENTRU FILTRARE (NOU) ---
  @Input() activeFilters = { curs: true, sem: true, lab: true };

  // --- INPUT-URI VIZUALE ---
  @Input() currentDayIndex!: number;
  @Input() currentLinePosition!: number;

  // Weather
  @Input() showWeather: boolean = false;


  @Output() eventClicked = new EventEmitter<CalendarEvent>();

  private http = inject(HttpClient);

  // rawEvents = TOATE datele din CSV (Sursa de adevar)
  rawEvents: CalendarEvent[] = [];

  // displayEvents = CE SE VEDE pe ecran (Filtrate si cu latimi calculate)
  displayEvents: CalendarEvent[] = [];

  ngOnInit() {
    this.loadEventsFromCsv();
  }

  ngOnChanges(changes: SimpleChanges) {
    // CAZUL 1: Se schimba grupa sau saptamana -> Trebuie incarcat fisier nou
    if (changes['selectedGroup'] || changes['selectedWeek']) {
      this.loadEventsFromCsv();
    }

    // CAZUL 2: Se schimba DOAR filtrele -> Nu incarcam CSV, doar refacem calculele pe datele existente
    if (changes['activeFilters']) {
      console.log('Grid a detectat schimbarea filtrelor!');
      if (this.rawEvents.length > 0) {
        this.processEventsForDisplay();
      }
    }
  }

  // --- LOGICA DE INCARCARE ---
  loadEventsFromCsv() {
    const parity = this.selectedWeek === 1 ? 'impar' : 'par';
    const path = `assets/${this.selectedGroup}/${parity}.csv`;

    console.log(`Incarc orar: ${path}`);

    this.http.get(path, { responseType: 'text' }).subscribe({
      next: (data) => {
        // 1. Parsam tot fisierul si salvam in rawEvents
        this.rawEvents = this.parseCsvData(data);

        // 2. Aplicam filtrele initiale si calculam pozitiile
        this.processEventsForDisplay();
      },
      error: (err) => {
        console.error(`Eroare la incarcarea fisierului CSV: ${path}`, err);
        this.rawEvents = [];
        this.displayEvents = [];
      }
    });
  }

  // --- LOGICA DE FILTRARE SI CALCUL ---
  // Aceasta functie ia datele brute, aplica filtrele active, apoi calculeaza suprapunerile
  private processEventsForDisplay() {
    // 1. Filtrare
    const filteredEvents = this.rawEvents.filter(ev => {
      if (ev.type === 'curs' && !this.activeFilters.curs) return false;
      if (ev.type === 'sem' && !this.activeFilters.sem) return false;
      if (ev.type === 'lab' && !this.activeFilters.lab) return false;
      return true;
    });

    // 2. Calcul Suprapuneri pe lista filtrata
    this.calculateOverlaps(filteredEvents);
  }

  // --- PARSER CSV ---
  private parseCsvData(csvText: string): CalendarEvent[] {
    const lines = csvText.split('\n');
    const events: CalendarEvent[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line) {
        // Regex pentru a separa la virgula DOAR daca nu e intre ghilimele
        const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        const clean = (txt: string) => txt ? txt.replace(/^"|"$/g, '').trim() : '';

        if (cols.length < 8) continue;

        events.push({
          id: parseInt(cols[0]),
          title: clean(cols[1]),
          type: clean(cols[2]) as 'lab' | 'curs' | 'sem',
          professor: clean(cols[3]),
          room: clean(cols[4]),
          dayIndex: parseInt(cols[5]),
          startRow: parseInt(cols[6]),
          span: parseInt(cols[7]),
          weeklyNotes: {},
          width: 100,      // Default
          marginLeft: 0    // Default
        });
      }
    }
    return events;
  }

  // --- CALCUL SUPRAPUNERI ---
  // Primeste o lista (deja filtrata) si updateaza displayEvents
  calculateOverlaps(eventsToProcess: CalendarEvent[]) {
    // Facem o copie (map) pentru a putea modifica width/marginLeft fara a altera rawEvents permanent
    // Resetam width la 100% inainte de recalculare
    let events = eventsToProcess.map(e => ({
      ...e,
      width: 100,
      marginLeft: 0
    }));

    for (let i = 0; i < events.length; i++) {
      for (let j = i + 1; j < events.length; j++) {
        const ev1 = events[i];
        const ev2 = events[j];

        if (ev1.dayIndex === ev2.dayIndex) {
          const ev1End = ev1.startRow + ev1.span;
          const ev2End = ev2.startRow + ev2.span;

          // Daca se suprapun
          if (ev1.startRow < ev2End && ev2.startRow < ev1End) {
            ev1.width = 50;
            ev2.width = 50;
            ev1.marginLeft = 0;
            ev2.marginLeft = 50;
          }
        }
      }
    }
    // Salvam rezultatul final pentru afisare in HTML
    this.displayEvents = events;
  }

  // --- Metode UI ---
  openLink(url: string) {
    if(url) window.open(url, "_blank");
  }

  toggleAttendance(event: CalendarEvent) {
    event.isAttendanceOpen = !event.isAttendanceOpen;
  }

  onEventClick(event: CalendarEvent) {
    this.eventClicked.emit(event);
  }

  updateAttendance(event: CalendarEvent, newCount: number) {
    event.attendanceCount = newCount;
    // Logica pentru salvare backend...
  }
}
