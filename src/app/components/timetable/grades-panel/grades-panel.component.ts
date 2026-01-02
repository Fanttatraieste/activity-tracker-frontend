import { Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarEvent } from '../timetable-grid/timetable-grid.component';
import { GradeRequest, GradeService } from '../../../services/grade.service';
import { AuthService } from '../../../services/auth.service';
import { forkJoin, of } from 'rxjs'; // Adaugă aceste importuri

@Component({
  selector: 'app-grades-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './grades-panel.component.html',
  styleUrls: ['./grades-panel.component.css']
})
export class GradesPanelComponent implements OnInit {
  @Input() event!: CalendarEvent;
  @Output() closePanel = new EventEmitter<void>();

  private gradeService = inject(GradeService);
  private authService = inject(AuthService);

  rows = [
    { type: '', value: '', weight: '', uuid: null as string | null },
    { type: '', value: '', weight: '', uuid: null as string | null },
    { type: '', value: '', weight: '', uuid: null as string | null }
  ];

  ngOnInit(): void {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    // Curățăm rândurile
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
            weight: grade.weight ? (grade.weight * 100).toString() + '%' : '',
            uuid: grade.uuid
          };
        }
      });
    }
  }

  saveAllGrades() {
    const user = this.authService.getCurrentUser();
    if (!user?.uuid) return;

    const requests = this.rows
      .filter(row => row.value && row.value.trim() !== '')
      .map(row => {
        const payload: GradeRequest = {
          userUuid: user.uuid,
          classScheduleUuid: this.event.id,
          value: parseFloat(row.value),
          weight: row.weight ? parseFloat(row.weight.replace('%', '')) / 100 : 0.4,
          note: row.type
        };
        return this.gradeService.addGrade(payload);
      });

    if (requests.length === 0) {
      this.onClose();
      return;
    }

    forkJoin(requests).subscribe({
      next: (responses) => {
        console.log("Toate notele au fost salvate:", responses);

        this.event.grades = responses;

        alert("Salvare reușită!");
        this.onClose();
      },
      error: (err) => {
        console.error("Eroare la salvare:", err);
        alert("A apărut o eroare la salvarea notelor.");
      }
    });
  }

  onClose() {
    this.closePanel.emit();
  }
}
