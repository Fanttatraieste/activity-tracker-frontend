import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-grades',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-grades.component.html',
  styleUrls: ['./event-grades.component.css']
})
export class EventGradesComponent {
  // Emitem semnalul către părinte
  @Output() openGrades = new EventEmitter<void>();

  onToggle(event: MouseEvent) {
    // Oprim propagarea pentru a nu deschide și Notițele (evenimentul părintelui)
    event.stopPropagation();
    this.openGrades.emit();
  }
}
