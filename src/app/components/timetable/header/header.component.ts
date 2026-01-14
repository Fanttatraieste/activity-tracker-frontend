import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderToolsComponent } from './header-tools/header-tools.component';
import { HeaderSelectorsComponent } from './header-selectors/header-selectors.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, HeaderToolsComponent, HeaderSelectorsComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  // Date primite de la componenta radacina (App) pentru a fi distribuite catre sub-componente
  @Input() groups!: number[];
  @Input() selectedGroup!: number;
  @Input() specializations!: string[];
  @Input() selectedSpecialization!: string;
  @Input() selectedWeek!: 1 | 2;
  @Input() showWeather: boolean = false;

  // Evenimente agregate care vor fi transmise mai departe catre componenta parinte (App)
  @Output() groupChange = new EventEmitter<number>();
  @Output() specializationChange = new EventEmitter<string>();
  @Output() weekChange = new EventEmitter<1 | 2>();
  @Output() filtersChange = new EventEmitter<any>();
  @Output() weatherToggle = new EventEmitter<boolean>();

  // Metoda de legatura: primeste filtrele de la HeaderTools si le trimite catre App
  onToolsFilterChange(filters: any) {
    this.filtersChange.emit(filters);
  }

  // Logica pentru "Orarul Meu": seteaza automat o grupa specifica (ex: 333.1)
  onMyScheduleClicked() {
    this.groupChange.emit(333.1);
  }

  weatherEnabled = false;

  // Propaga starea widget-ului meteo catre nivelul superior al aplicatiei
  onWeatherToggle(isActive: boolean) {
    this.weatherToggle.emit(isActive);
  }
}
