import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimetableComponent } from './components/timetable/timetable.component';
import { SettingsPageComponent } from './components/timetable/settings-page/settings-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TimetableComponent, SettingsPageComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {}
