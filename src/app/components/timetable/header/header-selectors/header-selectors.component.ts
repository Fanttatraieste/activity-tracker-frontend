import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header-selectors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header-selectors.component.html',
  styleUrls: ['./header-selectors.component.css']
})
export class HeaderSelectorsComponent {
  // Date primite de la componenta parinte (Smart Component) prin decoratori @Input
  @Input() groups!: number[];
  @Input() selectedGroup!: number;
  @Input() specializations!: string[];
  @Input() selectedSpecialization!: string;
  @Input() selectedWeek!: 1 | 2;

  // Evenimente trimise catre parinte pentru a notifica schimbarile de selectie
  @Output() groupChange = new EventEmitter<number>();
  @Output() specializationChange = new EventEmitter<string>();
  @Output() weekChange = new EventEmitter<1 | 2>();

  // Metoda apelata la schimbarea grupei; emite noua valoare numerica
  onGroupChange(event: any) {
    this.groupChange.emit(Number(event.target.value));
  }

  // Metoda apelata la schimbarea specializarii; emite textul selectat
  onSpecializationChange(event: any) {
    this.specializationChange.emit(event.target.value);
  }

  // Metoda apelata la click pe butoanele de saptamana (1 pentru Para, 2 pentru Impara)
  onWeekChange(w: 1 | 2) {
    this.weekChange.emit(w);
  }
}
