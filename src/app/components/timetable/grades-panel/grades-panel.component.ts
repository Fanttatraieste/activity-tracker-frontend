import { Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarEvent } from '../timetable-grid/timetable-grid.component';
import { GradeRequest, GradeService } from '../../../services/grade.service';
import { AuthService } from '../../../services/auth.service';
import { forkJoin, of } from 'rxjs'; // Importuri pentru gestionarea multiplelor cereri simultane

@Component({
  selector: 'app-grades-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './grades-panel.component.html',
  styleUrls: ['./grades-panel.component.css']
})
export class GradesPanelComponent implements OnInit {
  // Primeste datele evenimentului selectat din componenta parinte
  @Input() event!: CalendarEvent;
  // Trimite un semnal catre parinte pentru a inchide panoul
  @Output() closePanel = new EventEmitter<void>();

  // Utilizarea functiei inject pentru a aduce serviciile necesare (alternativa moderna la constructor)
  private gradeService = inject(GradeService);
  private authService = inject(AuthService);

  // Structura locala pentru randurile din tabelul de note
  rows = [
    { type: '', value: '', weight: '', uuid: null as string | null },
    { type: '', value: '', weight: '', uuid: null as string | null },
    { type: '', value: '', weight: '', uuid: null as string | null }
  ];

  ngOnInit(): void {
    this.loadInitialData();
  }

  // Preia notele existente din obiectul event si le mapeaza pe structura tabelului
  private loadInitialData(): void {
    this.rows = [
      { type: '', value: '', weight: '', uuid: null as string | null },
      { type: '', value: '', weight: '', uuid: null as string | null },
      { type: '', value: '', weight: '', uuid: null as string | null }
    ];

    if (this.event && this.event.grades && this.event.grades.length > 0) {
      this.event.grades.forEach((grade, index) => {
        if (index < 3) {
          this.rows[index] = {
            type: grade.note || '',
            value: grade.value !== undefined && grade.value !== null ? grade.value.toString() : '',
            // Transforma ponderea din format zecimal (0.4) in format procentual (40%) pentru utilizator
            weight: grade.weight ? (grade.weight * 100).toString() + '%' : '',
            uuid: grade.uuid
          };
        }
      });
    }
  }

  // Colecteaza datele din tabel si le trimite catre server
  saveAllGrades() {
    const user = this.authService.getCurrentUser();
    if (!user?.uuid) return;

    // Filtreaza doar randurile completate si creeaza o lista de cereri (observables)
    const requests = this.rows
      .filter(row => row.value && row.value.trim() !== '')
      .map(row => {
        const payload: GradeRequest = {
          userUuid: user.uuid,
          classScheduleUuid: this.event.id,
          value: parseFloat(row.value),
          // Conversie inversa din procent in zecimal pentru baza de date
          weight: row.weight ? parseFloat(row.weight.replace('%', '')) / 100 : 0.4,
          note: row.type
        };
        return this.gradeService.addGrade(payload);
      });

    if (requests.length === 0) {
      this.onClose();
      return;
    }

    // forkJoin asteapta ca toate cererile HTTP sa fie finalizate cu succes inainte de a continua
    forkJoin(requests).subscribe({
      next: (responses) => {
        console.log("Toate notele au fost salvate:", responses);
        // Actualizeaza obiectul local cu noile date primite de la server (inclusiv UUID-urile generate)
        this.event.grades = responses;
        alert("Salvare reusita!");
        this.onClose();
      },
      error: (err) => {
        console.error("Eroare la salvare:", err);
        alert("A aparut o eroare la salvarea notelor.");
      }
    });
  }

  onClose() {
    this.closePanel.emit();
  }
}
