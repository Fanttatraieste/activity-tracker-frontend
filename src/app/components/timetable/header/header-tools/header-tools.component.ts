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
  @Output() filtersChange = new EventEmitter<{curs: boolean, sem: boolean, lab: boolean}>();
  @Output() myScheduleClick = new EventEmitter<void>();
  @Output() weatherToggle = new EventEmitter<boolean>();
  filters = {
    curs: true,
    sem: true,
    lab: true
  };

  isWeatherActive = false;

  toggleFilter(type: 'curs' | 'sem' | 'lab') {

    this.filters = {
      ...this.filters,
      [type]: !this.filters[type]
    };

    this.filtersChange.emit(this.filters);
  }
  // my schedule button
  triggerMySchedule() {
    this.myScheduleClick.emit();
  }
  // weather button
  toggleWeather() {
    this.isWeatherActive = !this.isWeatherActive;
    this.weatherToggle.emit(this.isWeatherActive);
  }
}
