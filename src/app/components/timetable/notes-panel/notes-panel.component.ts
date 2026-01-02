import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarEvent } from '../timetable-grid/timetable-grid.component';
import { ClassNotesService } from '../../../services/class-notes.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-notes-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notes-panel.component.html',
  styleUrls: ['./notes-panel.component.css']
})
export class NotesPanelComponent implements OnInit, OnChanges {
  @Input() event!: CalendarEvent;
  @Output() closePanel = new EventEmitter<void>();

  private notesService = inject(ClassNotesService);
  private authService = inject(AuthService);

  weeksList = Array.from({length: 14}, (_, i) => i + 1);
  currentNoteWeek: number = 1;
  currentNoteUuid: string | null = null;

  ngOnInit() {
    this.loadNoteFromServer();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['event'] && this.event) {
      this.loadNoteFromServer();
    }
  }

  onWeekChange() {
    this.loadNoteFromServer();
  }

  onClose() {
    this.closePanel.emit();
  }

  private loadNoteFromServer() {
    const user = this.authService.getCurrentUser();
    if (!user?.uuid || !this.event?.id) return;

    this.notesService.getNoteByWeek(user.uuid, this.event.id, this.currentNoteWeek).subscribe({
      next: (res) => {
        if (res) {
          this.event.weeklyNotes[this.currentNoteWeek] = res.note;
          this.currentNoteUuid = res.uuid;
        } else {
          this.event.weeklyNotes[this.currentNoteWeek] = '';
          this.currentNoteUuid = null;
        }
      },
      error: () => {
        this.event.weeklyNotes[this.currentNoteWeek] = '';
        this.currentNoteUuid = null;
      }
    });
  }

  saveNote() {
    const user = this.authService.getCurrentUser();
    if (!user?.uuid) {
      alert("Trebuie să fii logat!");
      return;
    }

    const payload = {
      userUuid: user.uuid,
      classScheduleUuid: this.event.id,
      note: this.event.weeklyNotes[this.currentNoteWeek] || '',
      classNumber: this.currentNoteWeek
    };

    if (this.currentNoteUuid) {
      this.notesService.update(this.currentNoteUuid, payload).subscribe({
        next: () => alert("Notiță actualizată!"),
        error: (err) => console.error(err)
      });
    } else {
      this.notesService.create(payload).subscribe({
        next: (res) => {
          this.currentNoteUuid = res.uuid;
          alert("Notiță salvată!");
        },
        error: (err) => console.error(err)
      });
    }
  }
}
