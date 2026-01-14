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
  // Evenimente pentru comunicarea cu componenta parinte (orarul principal)
  @Output() filtersChange = new EventEmitter<{curs: boolean, sem: boolean, lab: boolean}>();
  @Output() myScheduleClick = new EventEmitter<void>();
  @Output() weatherToggle = new EventEmitter<boolean>();

  // Starea initiala a filtrelor (toate tipurile de activitati sunt vizibile la inceput)
  filters = {
    curs: true,
    sem: true,
    lab: true
  };

  // Starea widget-ului meteo (dezactivat implicit)
  isWeatherActive = false;

  // Schimba starea unui filtru specific si anunta restul aplicatiei
  toggleFilter(type: 'curs' | 'sem' | 'lab') {
    // Utilizarea operatorului "spread" (...) pentru a crea un obiect nou si a pastra imutabilitatea
    this.filters = {
      ...this.filters,
      [type]: !this.filters[type]
    };

    // Emiterea noii stari catre parinte pentru a actualiza grid-ul orarului
    this.filtersChange.emit(this.filters);
  }

  // Notifica parintele ca utilizatorul doreste sa vada doar orarul propriu
  triggerMySchedule() {
    this.myScheduleClick.emit();
  }

  // Activeaza/dezactiveaza afisarea datelor meteo
  toggleWeather() {
    this.isWeatherActive = !this.isWeatherActive;
    this.weatherToggle.emit(this.isWeatherActive);
  }
}
