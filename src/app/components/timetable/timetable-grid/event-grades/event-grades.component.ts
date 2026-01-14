import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarEvent } from '../timetable-grid.component';

@Component({
  selector: 'app-event-grades',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-grades.component.html',
  styleUrls: ['./event-grades.component.css']
})
export class EventGradesComponent {
  // Primeste obiectul evenimentului curent pentru a sti carui curs ii apartin notele
  @Input() event?: CalendarEvent;

  // Eveniment emis catre parinte (grid-ul orarului) pentru a deschide panoul lateral de note
  @Output() openGrades = new EventEmitter<void>();

  /**
   * Gestioneaza click-ul pe iconita de catalog.
   * stopPropagation() este critic pentru a preveni activarea click-ului pe intreaga celula de orar.
   */
  handleClick(e: MouseEvent) {
    e.stopPropagation();
    this.openGrades.emit();
  }
}
