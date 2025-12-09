import { Component, Input, OnInit, OnChanges, SimpleChanges, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { EventAttendanceComponent } from './event-attendance/event-attendance.component';
import { EventGradesComponent } from './event-grades/event-grades.component';

// --- ATENȚIE: ACESTE NUME TREBUIE SĂ FIE IDENTICE CU CELE DIN CSV ȘI DIN SIDEBAR ---
// Am actualizat lista conform codului tau din Sidebar (fara diacritice)
const KNOWN_OPTIONALS = [
  'Instruire asistata de calculator',
  'Software matematic',
  'Astronomie',
  'Analiza functionala',
  'Principiile retelelor de calculatoare', // Atentie: In CSV trebuie sa fie exact asa!
  'Instrumente CASE',
  'Interactiunea om-calculator'
];

// ... (Interface CalendarEvent ramane la fel) ...
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

  @Output() triggerGrades = new EventEmitter<CalendarEvent>();
  @Output() eventClicked = new EventEmitter<CalendarEvent>();
  @Output() gradesOpenRequested = new EventEmitter<CalendarEvent>();

  private http = inject(HttpClient);

  rawEvents: CalendarEvent[] = [];
  displayEvents: CalendarEvent[] = [];
  focusedDayIndex: number | null = null;
  focusedRow: number | null = null;

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
    // Debugging: Sa vedem ce optionale au venit
    // console.log('Optionale Selectate:', this.optionals);

    const filteredEvents = this.rawEvents.filter(ev => {

      // 1. Filtrare Tip
      if (ev.type === 'curs' && !this.activeFilters.curs) return false;
      if (ev.type === 'sem' && !this.activeFilters.sem) return false;
      if (ev.type === 'lab' && !this.activeFilters.lab) return false;

      // 2. Filtrare Optionale

      // Verificăm dacă titlul din CSV există în lista noastră de opționale cunoscute
      const isOptionalSubject = KNOWN_OPTIONALS.includes(ev.title);

      if (isOptionalSubject) {
        // Aici verificam daca userul a bifat materia
        const isSelected = this.optionals.includes(ev.title);

        // --- DEBUGGING: Arată-mi de ce nu merge ---
        if (!isSelected) {
          console.log(`Ascund materia: "${ev.title}" (Nu am gasit-o in lista bifata)`);
          // Verificare caracter cu caracter daca pare ca ar trebui sa fie acolo
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

      // Daca nu e in lista KNOWN_OPTIONALS, inseamna ca e materie obligatorie
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

        // --- DEBUGGING CRITIC ---
        // Daca o materie nu se filtreaza, decomenteaza linia de mai jos
        // si vezi in consola cum e scrisa exact in CSV vs cum e scrisa in KNOWN_OPTIONALS
        // console.log(`CSV Title: "${title}"`);

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
    // ... logica ta de overlap ramane neschimbata ...
    for (let i = 0; i < events.length; i++) {
      for (let j = i + 1; j < events.length; j++) {
        const ev1 = events[i];
        const ev2 = events[j];
        if (ev1.dayIndex === ev2.dayIndex) {
          const ev1End = ev1.startRow + ev1.span;
          const ev2End = ev2.startRow + ev2.span;
          if (ev1.startRow < ev2End && ev2.startRow < ev1End) {
            ev1.width = 50; ev2.width = 50; ev1.marginLeft = 0; ev2.marginLeft = 50;
          }
        }
      }
    }
    this.displayEvents = events;
  }

  // ... restul metodelor UI (openLink, toggleAttendance, etc)
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
