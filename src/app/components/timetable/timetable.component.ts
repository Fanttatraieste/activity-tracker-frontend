import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { TimetableGridComponent, CalendarEvent } from './timetable-grid/timetable-grid.component';
import { NotesPanelComponent } from './notes-panel/notes-panel.component';
import { GradesPanelComponent } from './grades-panel/grades-panel.component';

@Component({
  selector: 'app-timetable',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    HeaderComponent,
    TimetableGridComponent,
    NotesPanelComponent,
    GradesPanelComponent,
  ],
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css']
})
export class TimetableComponent implements OnInit {


  currentSwapRequest: { grupa: string, materie: string, tip: string } | null = null;
  selectedWeek: 1 | 2 = 1;
  groups = [331.1, 331.2, 332.1, 332.2, 333.1, 333.2];
  selectedGroup = 333;
  specializations = ["Mate-Info – anul I", "Mate-Info – anul II", "Mate-Info – anul III"];
  selectedSpecialization = this.specializations[0];
  currentFilters = { curs: true, sem: true, lab: true };
  currentOptionals: string[] = [];
  currentDayIndex = 0;
  currentLinePosition = 0;

  selectedEvent: CalendarEvent | null = null;

  weatherEnabled = false;

  currentGradeEvent: CalendarEvent | null = null;

  ngOnInit(): void {
    this.updateTimeLine();
    setInterval(() => this.updateTimeLine(), 60 * 1000);
  }

  updateTimeLine() {
    const now = new Date();
    const day = now.getDay();
    this.currentDayIndex = day >= 1 && day <= 5 ? day : 0;
    const hour = now.getHours() + now.getMinutes() / 60;
    this.currentLinePosition = (hour - 6) * 52;
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

    this.currentFilters = newFilters;
  }

  onOptionalsChanged(selectedMaterii: string[]) {
    console.log('Materii opționale selectate:', selectedMaterii);
    this.currentOptionals = selectedMaterii;
  }
  onRequestSwap(request: { grupa: string, materie: string, tip: string }) {
    console.log('Parinte a primit cererea:', request);
    // Actualizam variabila, ceea ce va declansa ngOnChanges in Grid
    this.currentSwapRequest = { ...request };
  }

  onWeatherToggle(isActive: boolean) {
    this.weatherEnabled = isActive;
  }
  openGrades(event: CalendarEvent) {
    this.currentGradeEvent = event;
  }

  closeGrades() {
    this.currentGradeEvent = null;
  }
}
