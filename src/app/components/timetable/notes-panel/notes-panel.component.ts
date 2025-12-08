import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarEvent } from '../timetable-grid/timetable-grid.component';

@Component({
  selector: 'app-notes-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notes-panel.component.html',
  styleUrls: ['./notes-panel.component.css']
})
export class NotesPanelComponent implements OnChanges {

  // Primim evenimentul selectat de la părinte
  @Input() event!: CalendarEvent;

  // Emitem un semnal când userul vrea să închidă panoul
  @Output() closePanel = new EventEmitter<void>();

  weeksList = Array.from({length: 14}, (_, i) => i + 1);
  currentNoteWeek: number = 1;

  // Resetăm săptămâna la 1 de fiecare dată când se schimbă evenimentul selectat
  ngOnChanges(changes: SimpleChanges) {
    if (changes['event'] && this.event) {
      this.currentNoteWeek = 1;

      // Ne asigurăm că obiectul de notițe există
      if (!this.event.weeklyNotes) {
        this.event.weeklyNotes = {};
      }
    }
  }

  onClose() {
    this.closePanel.emit();
  }
}
