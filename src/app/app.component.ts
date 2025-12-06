import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimetableComponent } from './components/timetable/timetable.component';
import {LoginPageComponent} from './components/login/login-page/login-page.component';
import {SignUpComponent} from './components/sign-up/sign-up.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SignUpComponent], //add again TimetableComponent,LoginPageComponent
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {}
