import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header-tools',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header-tools.component.html',
  styleUrls: ['./header-tools.component.css']
})
export class HeaderToolsComponent {
  // Emitem starea filtrelor către părinte
  @Output() filtersChange = new EventEmitter<{curs: boolean, sem: boolean, lab: boolean}>();

  // Starea internă a filtrelor
  filters = {
    curs: true,
    sem: true,
    lab: true
  };

  toggleFilter(type: 'curs' | 'sem' | 'lab') {
    this.filters[type] = !this.filters[type];
    this.filtersChange.emit(this.filters);
  }
}
