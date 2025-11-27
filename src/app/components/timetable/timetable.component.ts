import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { TimetableGridComponent, CalendarEvent } from './timetable-grid/timetable-grid.component';
import { RightPanelComponent } from './right-panel/right-panel.component';

@Component({
  selector: 'app-timetable',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    HeaderComponent,
    TimetableGridComponent,
    RightPanelComponent
  ],
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css']
})
export class TimetableComponent implements OnInit {

  selectedWeek: 1 | 2 = 1;
  groups = [331.1, 331.2, 332.1, 332.2, 333.1, 333.2];
  selectedGroup = 333;
  specializations = ["Mate-Info – anul I", "Mate-Info – anul II", "Mate-Info – anul III"];
  selectedSpecialization = this.specializations[0];
  currentFilters = { curs: true, sem: true, lab: true };
  currentDayIndex = 0;
  currentLinePosition = 0;

  selectedEvent: CalendarEvent | null = null;

  ngOnInit(): void {
    this.updateTimeLine();
    setInterval(() => this.updateTimeLine(), 60 * 1000);
  }

  updateTimeLine() {
    const now = new Date();
    const day = now.getDay();
    this.currentDayIndex = day >= 1 && day <= 5 ? day : 0;
    const hour = now.getHours() + now.getMinutes() / 60;
    this.currentLinePosition = (hour - 8) * 50;
  }

  selectWeek(w: 1 | 2) { this.selectedWeek = w; }
  selectGroup(g: number) { this.selectedGroup = g; }
  selectSpecialization(s: string) { this.selectedSpecialization = s; }

  onEventSelected(event: CalendarEvent) {
    this.selectedEvent = event;
  }

  closeNotes() {
    this.selectedEvent = null;
  }
  onFiltersChanged(newFilters: {curs: boolean, sem: boolean, lab: boolean}) {
    console.log('Filtre primite in parinte:', newFilters);

    // Actualizăm variabila locală
    // Deoarece HeaderTools trimite deja un obiect nou, e suficient:
    this.currentFilters = newFilters;
  }
}
