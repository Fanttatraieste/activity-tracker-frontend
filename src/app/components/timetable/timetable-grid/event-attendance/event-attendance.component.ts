import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-attendance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-attendance.component.html',
  styleUrls: ['./event-attendance.component.css']
})
export class EventAttendanceComponent {

  @Input() present: number = 0;
  @Input() total: number = 14;
  @Input() isOpen: boolean = false;

  @Output() attendanceChange = new EventEmitter<number>();

  @Output() toggle = new EventEmitter<void>();

  onToggle(e: Event) {
    e.stopPropagation();
    this.toggle.emit();
  }

  onIncrease(e: Event) {
    e.stopPropagation();
    if (this.present < this.total) {
      this.attendanceChange.emit(this.present + 1);
    }
  }

  onDecrease(e: Event) {
    e.stopPropagation();
    if (this.present > 0) {
      this.attendanceChange.emit(this.present - 1);
    }
  }
}
