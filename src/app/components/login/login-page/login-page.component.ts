import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  imports: [
    CommonModule,
    FormsModule
  ],
  standalone: true
})
export class LoginPageComponent {
  constructor(private router: Router) {}
  email: string = "";
  password: string = "";

  loginError: string | null = null;

  onLogin() {

    this.loginError = null;

    if (!this.email.includes("@")) {
      this.loginError = "Adresa de email nu este validă.";
      return;
    }
    // temporary redirect
    this.router.navigate(['/timetable']);
  }
  onGoogleLogin() {
    const clientId = "295063293016-gb5su3e8r9607m4ivbl8hqipth5n5d8t.apps.googleusercontent.com";

    const redirectUri = "http://localhost:4200";

    const googleAuthUrl =
      "https://accounts.google.com/o/oauth2/v2/auth" +
      "?response_type=token" +
      "&client_id=" + clientId +
      "&redirect_uri=" + encodeURIComponent(redirectUri) +
      "&scope=email%20profile" +
      "&prompt=select_account";

    window.location.href = googleAuthUrl;
    this.router.navigate(['/timetable']);
  }



}
