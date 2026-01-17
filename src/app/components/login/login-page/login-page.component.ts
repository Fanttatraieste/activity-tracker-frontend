import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink]
})
export class LoginPageComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}

  email: string = "";
  password: string = "";
  loginError: string | null = null;
  selectedBackground: string = "";

  ngOnInit(): void {
    this.setAutoBackground();
  }

  private setAutoBackground(): void {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) this.selectedBackground = "assets/sign-up-background-images/Spring_Project.jpg";
    else if (month >= 5 && month <= 7) this.selectedBackground = "assets/sign-up-background-images/Summer_Project.jpg";
    else if (month >= 8 && month <= 10) this.selectedBackground = "assets/sign-up-background-images/Autumn_Project.jpg";
    else this.selectedBackground = "assets/sign-up-background-images/Winter_Project.jpg";
  }

  get backgroundStyle(): string {
    return `url('${this.selectedBackground}')`;
  }

  onLogin() {
    this.loginError = null;
    if (!this.email || !this.password) {
      this.loginError = "Introdu email și parolă.";
      return;
    }

    this.authService.login({ email: this.email, password: this.password })
      .subscribe({
        next: () => this.router.navigate(['/timetable']),
        error: () => this.loginError = "Email sau parolă incorectă!"
      });
  }

  onGoogleLogin() {
    alert("Autentificarea cu Google este momentan indisponibilă.");
  }
}
