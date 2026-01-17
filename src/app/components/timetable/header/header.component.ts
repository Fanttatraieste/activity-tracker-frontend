import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderToolsComponent } from './header-tools/header-tools.component';
import { HeaderSelectorsComponent } from './header-selectors/header-selectors.component';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';

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

  private userService = inject(UserService);
  private authService = inject(AuthService);

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
    const user = this.authService.getCurrentUser();
    if (user && user.uuid) {
      this.userService.getProfile(user.uuid).subscribe({
        next: (profile) => {
          if (profile && profile.grupa && profile.grupa.trim() !== '') {
            const digits = profile.grupa.replace(/[^0-9]/g, '');

            if (digits.length >= 4) {
              const formattedGroup = digits.substring(0, 3) + '.' + digits.substring(3);
              const groupNum = Number(formattedGroup);

              if (!isNaN(groupNum)) {
                this.groupChange.emit(groupNum);
                return;
              }
            }
          }

          this.groupChange.emit(333.1);
        },
        error: (err) => {
          this.groupChange.emit(333.1);
        }
      });
    }
  }

  weatherEnabled = false;

  // Propaga starea widget-ului meteo catre nivelul superior al aplicatiei
  onWeatherToggle(isActive: boolean) {
    this.weatherToggle.emit(isActive);
  }
}
