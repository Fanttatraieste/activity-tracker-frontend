import { Routes } from '@angular/router';
import { TimetableComponent } from './components/timetable/timetable.component';
import { SettingsPageComponent } from './components/timetable/settings-page/settings-page.component';
import { LoginPageComponent } from './components/login/login-page/login-page.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
export const routes: Routes = [
  // Ruta default
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Ruta Login
  { path: 'login', component: LoginPageComponent },

  // Ruta Sign Up
  { path: 'register', component: SignUpComponent },

  // Ruta App
  { path: 'timetable', component: TimetableComponent },
  { path: 'settings', component: SettingsPageComponent },

  // Wildcard
  { path: '**', redirectTo: 'login' }
];
