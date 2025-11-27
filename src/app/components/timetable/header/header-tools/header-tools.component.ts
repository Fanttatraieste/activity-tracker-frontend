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
    // VARIANTA VECHE (GREȘITĂ pentru change detection):
    // this.filters[type] = !this.filters[type];

    // VARIANTA CORECTĂ:
    // Creăm un obiect NOU folosind {...} (spread operator)
    // Astfel Angular vede că s-a schimbat adresa din memorie a obiectului
    this.filters = {
      ...this.filters,
      [type]: !this.filters[type]
    };

    this.filtersChange.emit(this.filters);
  }
}
