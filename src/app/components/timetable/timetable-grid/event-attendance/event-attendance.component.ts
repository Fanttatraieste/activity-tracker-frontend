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

  // Numarul curent de prezente primit de la evenimentul din orar
  @Input() present: number = 0;
  // Numarul maxim de saptamani (implicit 14 pentru un semestru standard)
  @Input() total: number = 14;
  // Indica daca butoanele de control (+/-) sunt vizibile sau nu
  @Input() isOpen: boolean = false;

  // Emite noua valoare a prezentelor dupa modificare
  @Output() attendanceChange = new EventEmitter<number>();

  // Notifica parintele ca utilizatorul a dat click pentru a deschide/inchide controalele
  @Output() toggle = new EventEmitter<void>();

  // Gestioneaza deschiderea/inchiderea widget-ului
  onToggle(e: Event) {
    // Oprirea propagarii pentru a nu declansa alte evenimente de click de pe celula de orar
    e.stopPropagation();
    this.toggle.emit();
  }

  // Mareste numarul de prezente fara a depasi totalul saptamanilor
  onIncrease(e: Event) {
    e.stopPropagation();
    if (this.present < this.total) {
      this.attendanceChange.emit(this.present + 1);
    }
  }

  // Scade numarul de prezente fara a cobori sub zero
  onDecrease(e: Event) {
    e.stopPropagation();
    if (this.present > 0) {
      this.attendanceChange.emit(this.present - 1);
    }
  }
}
