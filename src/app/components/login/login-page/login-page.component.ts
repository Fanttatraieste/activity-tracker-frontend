import { Component, OnInit } from '@angular/core';
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
export class LoginPageComponent implements OnInit {
  constructor(private router: Router) {}
  email: string = "";
  password: string = "";

  loginError: string | null = null;

  // background selector
  selectedBackground: string | null = null;

  ngOnInit(): void {
    // try to load saved background
    const saved = localStorage.getItem('login_bg');
    if (saved) {
      this.selectedBackground = saved || null;
    }
  }

  // getter returns style for the binding [style.background-image]
  get backgroundStyle(): string | null {
    if (this.selectedBackground) {
      return `url('${this.selectedBackground}')`;
    }
    return null;
  }

  onBackgroundChange() {
    if (this.selectedBackground) {
      localStorage.setItem('login_bg', this.selectedBackground);
    } else {
      localStorage.removeItem('login_bg');
    }
    // If you want to do other actions when changing, add them here.
  }

  resetBackground() {
    this.selectedBackground = null;
    localStorage.removeItem('login_bg');
  }

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
