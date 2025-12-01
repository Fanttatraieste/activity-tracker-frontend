import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
    selector: 'app-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.css'],
    standalone: true
})
export class LoginPageComponent {
  constructor(private router: Router) {}

  onLogin() {
    // temporary redirect
    this.router.navigate(['/timetable']);
  }
}
