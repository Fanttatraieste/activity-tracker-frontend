import { Component, OnInit } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  standalone: true
})
export class LoginPageComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}
  email: string = "";
  password: string = "";

  loginError: string | null = null;

  // background selector
  selectedBackground: string | null = null;

  ngOnInit(): void {
    const saved = localStorage.getItem('selected_bg');
    if (saved) {
      this.selectedBackground = saved;
    } else {
      this.selectedBackground = "assets/sign-up-background-images/Winter_Project.jpg";
    }
  }

  get backgroundStyle(): string | null {
    if (this.selectedBackground) {
      // Adăugăm un mic fix pentru URL
      return `url('${this.selectedBackground}')`;
    }
    return null;
  }

  onBackgroundChange() {
    if (this.selectedBackground) {
      localStorage.setItem('selected_bg', this.selectedBackground);
    } else {
      localStorage.removeItem('selected_bg');
    }
  }

  resetBackground() {
    this.selectedBackground = "assets/sign-up-background-images/Winter_Project.jpg";
    localStorage.setItem('selected_bg', this.selectedBackground);
  }
  onLogin() {
    this.loginError = null;

    if (!this.email || !this.password) {
      this.loginError = "Introdu email și parolă.";
      return;
    }

    // APELAM BACKEND-UL JAVA
    this.authService.login({ email: this.email, password: this.password })
      .subscribe({
        next: (token) => {
          console.log("Login reusit! Token:", token);

          localStorage.setItem('userEmail', this.email);
          localStorage.setItem('userName', 'Utilizator');

          this.router.navigate(['/timetable']);
        },
        error: (err) => {
          console.error(err);
          this.loginError = "Email sau parolă incorectă!";
        }
      });
  }

  onGoogleLogin() {
    // const clientId = "295063293016-gb5su3e8r9607m4ivbl8hqipth5n5d8t.apps.googleusercontent.com";
    // const redirectUri = "http://localhost:4200";
    //
    // const googleAuthUrl =
    //   "https://accounts.google.com/o/oauth2/v2/auth" +
    //   "?response_type=token" +
    //   "&client_id=" + clientId +
    //   "&redirect_uri=" + encodeURIComponent(redirectUri) +
    //   "&scope=email%20profile" +
    //   "&prompt=select_account";
    //
    // window.location.href = googleAuthUrl;
    // this.router.navigate(['/timetable']);
    localStorage.setItem('userEmail', 'google.user@gmail.com');
    localStorage.setItem('userName', 'Google User');
    this.router.navigate(['/timetable']);

  }
}
