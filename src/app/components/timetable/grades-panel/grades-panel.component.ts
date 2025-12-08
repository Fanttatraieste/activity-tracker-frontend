import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarEvent } from '../timetable-grid/timetable-grid.component';

@Component({
  selector: 'app-grades-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './grades-panel.component.html',
  styleUrls: ['./grades-panel.component.css']

})

export class GradesPanelComponent implements OnChanges {

  @Input() event!: CalendarEvent;

  ngOnChanges(changes: SimpleChanges): void {

  }

  // Emitem un semnal când userul vrea să închidă panoul
  @Output() closePanel = new EventEmitter<void>();

  onClose() {
    this.closePanel.emit();
  }

}
