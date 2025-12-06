import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  name = '';
  surname = '';
  email = '';
  password = '';
  confirmPassword = '';


  signupError: string | null = null;

  // Background handling (same pattern as login)
  selectedBackground: string | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const saved = localStorage.getItem('signup_bg');
    if (saved) {
      this.selectedBackground = saved;
    } else {
      this.selectedBackground = "assets/sign-up-background-images/Autumn_Project.jpg";
    }
  }

  get backgroundStyle(): string | null {
    return this.selectedBackground
      ? `url('${this.selectedBackground}')`
      : null;
  }

  onBackgroundChange() {
    if (this.selectedBackground) {
      localStorage.setItem('signup_bg', this.selectedBackground);
    } else {
      localStorage.removeItem('signup_bg');
    }
  }

  resetBackground() {
    this.selectedBackground = "assets/sign-up-background-images/Autumn_Project.jpg";
    localStorage.setItem('signup_bg', this.selectedBackground);
  }

  onSignup() {
    this.signupError = null;

    if (!this.name || !this.surname || !this.email || !this.password) {
      this.signupError = "Te rugăm să completezi toate câmpurile.";
      return;
    }

    if (!this.email.includes('@')) {
      this.signupError = "Adresa de e-mail nu este validă.";
      return;
    }

    // Temporary redirect (matching login behavior)
    this.router.navigate(['/timetable']);
  }

  onGoogleSignup() {
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

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
