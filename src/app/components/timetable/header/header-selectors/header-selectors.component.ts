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
  @Input() groups!: number[];
  @Input() selectedGroup!: number;
  @Input() specializations!: string[];
  @Input() selectedSpecialization!: string;
  @Input() selectedWeek!: 1 | 2;

  @Output() groupChange = new EventEmitter<number>();
  @Output() specializationChange = new EventEmitter<string>();
  @Output() weekChange = new EventEmitter<1 | 2>();

  onGroupChange(event: any) { this.groupChange.emit(Number(event.target.value)); }
  onSpecializationChange(event: any) { this.specializationChange.emit(event.target.value); }
  onWeekChange(w: 1 | 2) { this.weekChange.emit(w); }
}
