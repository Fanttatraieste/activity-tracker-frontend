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
  dayIndex: number; // 1 = Luni, 5 = Vineri
  startRow: number; // randul din grid (ex: 2 = 8AM)
  span: number;     // inaltimea (ex: 2 = 2 ore)

  // Proprietati vizuale (calculate automat)
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

  // --- INPUT-URI PENTRU LOGICA DE DATA ---
  // Default values pentru a evita erori la start
  @Input() selectedGroup: number = 331.1;
  @Input() selectedWeek: 1 | 2 = 1;

  // --- INPUT-URI VIZUALE (LINIA ROSIE) ---
  @Input() currentDayIndex!: number;
  @Input() currentLinePosition!: number;

  // --- EVENTS OUTPUT ---
  @Output() eventClicked = new EventEmitter<CalendarEvent>();

  // Serviciul HTTP
  private http = inject(HttpClient);

  // Datele interne
  rawEvents: CalendarEvent[] = [];
  displayEvents: CalendarEvent[] = [];

  // 1. Initializare
  ngOnInit() {
    this.loadEventsFromCsv();
  }

  // 2. Ascultator de schimbari (Cand parintele schimba grupa sau saptamana)
  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedGroup'] || changes['selectedWeek']) {
      // Daca s-a schimbat grupa sau saptamana, reincarcam fisierul
      console.log('Detectat schimbare input, reincarc datele...');
      this.loadEventsFromCsv();
    }
  }

  // 3. Functia de incarcare
  loadEventsFromCsv() {
    const parity = this.selectedWeek === 1 ? 'impar' : 'par';

    // Construim calea: assets/331.1/impar.csv
    const path = `assets/${this.selectedGroup}/${parity}.csv`;

    this.http.get(path, { responseType: 'text' }).subscribe({
      next: (data) => {
        // Parsam CSV-ul
        this.rawEvents = this.parseCsvData(data);
        // Calculam vizual (suprapuneri)
        this.calculateOverlaps();
      },
      error: (err) => {
        console.error(`Eroare: Nu s-a putut citi fisierul de la ${path}`, err);
        // Golim gridul daca nu gasim fisierul, ca sa nu ramana date vechi
        this.displayEvents = [];
        this.rawEvents = [];
      }
    });
  }

  // 4. Parser CSV Avansat (Rezolva problema cu virgula in text)
  private parseCsvData(csvText: string): CalendarEvent[] {
    const lines = csvText.split('\n');
    const events: CalendarEvent[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line) {
        // REGEX COMPLEX: Face split la virgula, DOAR daca virgula nu e intre ghilimele
        const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

        // Functie helper: sterge ghilimelele din jurul textului daca exista
        // Ex: "Analiza, Algebra" -> Analiza, Algebra
        const clean = (txt: string) => txt ? txt.replace(/^"|"$/g, '').trim() : '';

        // Verificam sa avem minimul de coloane necesare
        if (cols.length < 8) continue;

        const newEvent: CalendarEvent = {
          id: parseInt(cols[0]),
          title: clean(cols[1]),
          type: clean(cols[2]) as 'lab' | 'curs' | 'sem',
          professor: clean(cols[3]),
          room: clean(cols[4]),
          dayIndex: parseInt(cols[5]),
          startRow: parseInt(cols[6]),
          span: parseInt(cols[7]),
          weeklyNotes: {},
          // Setari default
          width: 100,
          marginLeft: 0,
          attendanceCount: 0,
          isAttendanceOpen: false
        };
        events.push(newEvent);
      }
    }
    return events;
  }

  // 5. Calcul Suprapuneri (Daca ai 2 materii in acelasi timp)
  calculateOverlaps() {
    // Facem o copie ca sa nu modificam rawEvents direct
    let events = [...this.rawEvents];

    // Resetam valorile vizuale
    events.forEach(e => {
      e.width = 100;
      e.marginLeft = 0;
    });

    for (let i = 0; i < events.length; i++) {
      for (let j = i + 1; j < events.length; j++) {
        const ev1 = events[i];
        const ev2 = events[j];

        // Verificam daca sunt in aceeasi zi
        if (ev1.dayIndex === ev2.dayIndex) {
          const ev1Start = ev1.startRow;
          const ev1End = ev1.startRow + ev1.span;
          const ev2Start = ev2.startRow;
          const ev2End = ev2.startRow + ev2.span;

          // Verificam intersectia intervalelor orare
          if (ev1Start < ev2End && ev2Start < ev1End) {
            // S-au suprapus! Le facem pe jumatate
            ev1.width = 50;
            ev2.width = 50;

            // Unul in stanga, unul in dreapta
            ev1.marginLeft = 0;
            ev2.marginLeft = 50;
          }
        }
      }
    }
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
    // Aici ai putea salva in LocalStorage sau trimite la Backend
    console.log(`Prezenta la ${event.title}: ${newCount}`);
  }
}
