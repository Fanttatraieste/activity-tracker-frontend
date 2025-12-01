import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimetableComponent } from './components/timetable/timetable.component';
import {LoginPageComponent} from './components/login/login-page/login-page.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, LoginPageComponent], //add again TimetableComponent
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {}
