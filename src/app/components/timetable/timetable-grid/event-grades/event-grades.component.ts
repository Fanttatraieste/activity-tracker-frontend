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
  @Input() event?: CalendarEvent;
  @Output() openGrades = new EventEmitter<void>();


  handleClick(e: MouseEvent) {
    e.stopPropagation();
    this.openGrades.emit();
  }
}
