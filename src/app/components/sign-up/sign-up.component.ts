import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
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
  selectedBackground: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void { this.setAutoBackground(); }

  private setAutoBackground(): void {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) this.selectedBackground = "assets/sign-up-background-images/Spring_Project.jpg";
    else if (month >= 5 && month <= 7) this.selectedBackground = "assets/sign-up-background-images/Summer_Project.jpg";
    else if (month >= 8 && month <= 10) this.selectedBackground = "assets/sign-up-background-images/Autumn_Project.jpg";
    else this.selectedBackground = "assets/sign-up-background-images/Winter_Project.jpg";
  }

  get backgroundStyle(): string { return `url('${this.selectedBackground}')`; }

  onSignup() {
    this.signupError = null;
    if (!this.email || !this.password || !this.name) {
      this.signupError = "Toate câmpurile sunt obligatorii.";
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.signupError = "Parolele nu coincid.";
      return;
    }

    this.authService.register({
      email: this.email,
      password: this.password,
      userType: 'Student'
    }).subscribe({
      next: () => {
        alert('Cont creat!');
        this.router.navigate(['/login']);
      },
      error: () => this.signupError = "Eroare la înregistrare."
    });
  }

  onGoogleSignup() {
    alert("Înregistrarea cu Google este momentan indisponibilă.");
  }
}
