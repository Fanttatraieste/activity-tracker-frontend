import {Component, Input, OnInit, inject, Output, EventEmitter} from '@angular/core';
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
  imports: [CommonModule, EventAttendanceComponent],
  templateUrl: './timetable-grid.component.html',
  styleUrls: ['./timetable-grid.component.css']
})
export class TimetableGridComponent implements OnInit {

  @Input() currentDayIndex!: number;
  @Input() currentLinePosition!: number;
  @Output() eventClicked = new EventEmitter<CalendarEvent>();

  // injectam httpclient
  private http = inject(HttpClient);


  rawEvents: CalendarEvent[] = [];
  displayEvents: CalendarEvent[] = [];

  ngOnInit() {

    this.loadEventsFromCsv();
  }

  loadEventsFromCsv() {
    this.http.get('assets/331/par.csv', { responseType: 'text' })
      .subscribe({
        next: (data) => {
          // parsare text si populare rawevents
          this.rawEvents = this.parseCsvData(data);

          // calcul suprapuneri
          this.calculateOverlaps();
        },
        error: (err) => console.error('Nu s-a putut citi fisierul CSV', err)
      });
  }

  // transformare CSV -> json
  // asta este facuta doar pt ca nu am legat inca cu backend, cand legam cu backend nu o vom mai folosi
  private parseCsvData(csvText: string): CalendarEvent[] {
    const lines = csvText.split('\n');
    const events: CalendarEvent[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line) {
        const cols = line.split(',');
        const newEvent: CalendarEvent = {
          id: parseInt(cols[0]),
          title: cols[1],
          type: cols[2] as 'lab' | 'curs' | 'sem', // Casting simplu
          professor: cols[3],
          room: cols[4],
          dayIndex: parseInt(cols[5]),
          startRow: parseInt(cols[6]),
          span: parseInt(cols[7]),
          weeklyNotes: {}
        };
        events.push(newEvent);
      }
    }
    return events;
  }

  calculateOverlaps() {
    let events = [...this.rawEvents];

    // resetare
    events.forEach(e => {
      e.width = 100;
      e.marginLeft = 0;
    });

    for (let i = 0; i < events.length; i++) {
      for (let j = i + 1; j < events.length; j++) {
        const ev1 = events[i];
        const ev2 = events[j];

        if (ev1.dayIndex === ev2.dayIndex) {
          const ev1End = ev1.startRow + ev1.span;
          const ev2End = ev2.startRow + ev2.span;

          if (ev1.startRow < ev2End && ev2.startRow < ev1End) {
            ev1.width = 50;
            ev2.width = 50;
            ev1.marginLeft = 0;
            ev2.marginLeft = 50;
          }
        }
      }
    }
    this.displayEvents = events;
  }

  openLink(url: string) {
    window.open(url, "_blank");
  }

  toggleAttendance(event: CalendarEvent) {
    event.isAttendanceOpen = !event.isAttendanceOpen;
  }

  onEventClick(event: CalendarEvent) {
    this.eventClicked.emit(event);
  }


  updateAttendance(event: CalendarEvent, newCount: number) {
    event.attendanceCount = newCount;
    // apelare pe viitor la backend
    console.log(`prezenta modificata la ${event.title}: ${newCount}/14`);
  }


}
