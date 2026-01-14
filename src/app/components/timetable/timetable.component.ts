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
    CommonModule, FormsModule, SidebarComponent, HeaderComponent,
    TimetableGridComponent, NotesPanelComponent, GradesPanelComponent,
  ],
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css']
})
export class TimetableComponent implements OnInit {

  // --- STAREA APLICATIEI (State Management) ---
  currentSwapRequest: { grupa: string, materie: string, tip: string } | null = null;
  selectedWeek: 1 | 2 = 1;
  groups = [331.1, 331.2, 332.1, 332.2, 333.1, 333.2];
  selectedGroup = 333;
  specializations = ["Mate-Info – anul I", "Mate-Info – anul II", "Mate-Info – anul III"];
  selectedSpecialization = this.specializations[0];

  // Filtrele active (Curs/Sem/Lab) si materiile optionale selectate din Sidebar
  currentFilters = { curs: true, sem: true, lab: true };
  currentOptionals: string[] = [];

  // Variabile pentru pozitionarea liniei de timp real
  currentDayIndex = 0;
  currentLinePosition = 0;

  // Referinte catre evenimentele selectate pentru afisarea panourilor laterale
  selectedEvent: CalendarEvent | null = null;
  currentGradeEvent: CalendarEvent | null = null;

  weatherEnabled = false;

  ngOnInit(): void {
    // Calculam pozitia liniei imediat la incarcare
    this.updateTimeLine();
    // Actualizam pozitia liniei in fiecare minut pentru precizie maxima
    setInterval(() => this.updateTimeLine(), 60 * 1000);
  }

  /**
   * CALCULEAZA POZITIA LINIEI DE TIMP REAL:
   * Determina ziua curenta si transforma ora/minutele intr-o pozitie verticala (pixeli).
   */
  updateTimeLine() {
    const now = new Date();
    const day = now.getDay(); // 0 (Dum) - 6 (Sam)

    // Setam indexul zilei (1-5 pentru Luni-Vineri, altfel 0/ascuns)
    this.currentDayIndex = day >= 1 && day <= 5 ? day : 0;

    // Transformam ora curenta (ex: 10:30 -> 10.5) intr-o coordonata Y
    // Scadem 6 (deoarece grid-ul incepe simbolic de la ora 6 AM)
    // Inmultim cu 52 (inaltimea unei celule in pixeli + gap)
    const hour = now.getHours() + now.getMinutes() / 60;
    this.currentLinePosition = (hour - 6) * 52;
  }

  // --- METODE DE SINCRONIZARE (Event Handlers) ---

  selectWeek(w: 1 | 2) { this.selectedWeek = w; }
  selectGroup(g: number) { this.selectedGroup = g; }

  // Gestionarea panoului de notite
  onEventSelected(event: CalendarEvent) { this.selectedEvent = event; }
  closeNotes() { this.selectedEvent = null; }

  // Actualizarea filtrelor primite de la Header
  onFiltersChanged(newFilters: {curs: boolean, sem: boolean, lab: boolean}) {
    this.currentFilters = newFilters;
  }

  // Actualizarea materiilor optionale primite de la Sidebar
  onOptionalsChanged(selectedMaterii: string[]) {
    this.currentOptionals = selectedMaterii;
  }

  // Gestionarea cererilor de schimbare a grupei
  onRequestSwap(request: { grupa: string, materie: string, tip: string }) {
    this.currentSwapRequest = { ...request };
  }

  onWeatherToggle(isActive: boolean) { this.weatherEnabled = isActive; }

  // Gestionarea panoului de note (Catalog)
  openGrades(event: CalendarEvent) { this.currentGradeEvent = event; }
  closeGrades() { this.currentGradeEvent = null; }
}
