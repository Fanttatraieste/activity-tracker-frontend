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
  // Primeste datele despre cursul selectat din componenta parinte
  @Input() event!: CalendarEvent;
  // Eveniment pentru inchiderea panoului
  @Output() closePanel = new EventEmitter<void>();

  // Injectarea serviciilor necesare pentru operatiuni CRUD si autentificare
  private notesService = inject(ClassNotesService);
  private authService = inject(AuthService);

  // Generarea unei liste de 14 saptamani pentru selectorul din interfata
  weeksList = Array.from({length: 14}, (_, i) => i + 1);
  currentNoteWeek: number = 1;
  currentNoteUuid: string | null = null; // Retine ID-ul notitei din baza de date pentru update

  ngOnInit() {
    this.loadNoteFromServer();
  }

  // Detecteaza cand utilizatorul schimba cursul selectat si reincarca datele
  ngOnChanges(changes: SimpleChanges) {
    if (changes['event'] && this.event) {
      this.loadNoteFromServer();
    }
  }

  // Handler pentru schimbarea saptamanii din drop-down
  onWeekChange() {
    this.loadNoteFromServer();
  }

  onClose() {
    this.closePanel.emit();
  }

  // Preia notita existenta de pe server pentru saptamana si cursul selectat
  private loadNoteFromServer() {
    const user = this.authService.getCurrentUser();
    if (!user?.uuid || !this.event?.id) return;

    this.notesService.getNoteByWeek(user.uuid, this.event.id, this.currentNoteWeek).subscribe({
      next: (res) => {
        if (res) {
          // Daca exista notita, o salvam in obiectul local si retinem UUID-ul pentru actualizare
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

  // Salveaza sau actualizeaza notita in functie de existenta unui UUID
  saveNote() {
    const user = this.authService.getCurrentUser();
    if (!user?.uuid) {
      alert("Trebuie sa fii logat!");
      return;
    }

    const payload = {
      userUuid: user.uuid,
      classScheduleUuid: this.event.id,
      note: this.event.weeklyNotes[this.currentNoteWeek] || '',
      classNumber: this.currentNoteWeek // Numarul saptamanii
    };

    if (this.currentNoteUuid) {
      // Daca notita exista deja, apelam metoda de UPDATE (PUT)
      this.notesService.update(this.currentNoteUuid, payload).subscribe({
        next: () => alert("Notita actualizata!"),
        error: (err) => console.error(err)
      });
    } else {
      // Daca este o notita noua, apelam metoda de CREATE (POST)
      this.notesService.create(payload).subscribe({
        next: (res) => {
          this.currentNoteUuid = res.uuid; // Salvam UUID-ul nou primit de la server
          alert("Notita salvata!");
        },
        error: (err) => console.error(err)
      });
    }
  }
}
