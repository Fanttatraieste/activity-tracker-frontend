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

  selectedBackground: string | null = null;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    const saved = localStorage.getItem('signup_bg');
    if (saved) {
      this.selectedBackground = saved;
    } else {
      this.selectedBackground = "public/Winter_Project.jpg";
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

    if (!this.email || !this.password || !this.name) {
      this.signupError = "Toate câmpurile sunt obligatorii.";
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.signupError = "Parolele nu coincid.";
      return;
    }

    // Construim obiectul pentru Java
    // Nota: Java UserRequestDto nu are nume/prenume, deci le salvam doar local
    const registerData = {
      email: this.email,
      password: this.password,
      userType: 'Student' as const, // Java cere UserType
      groupUUID: null,
      subjectUUID: null
    };

    // APELAM BACKEND-UL
    this.authService.register(registerData).subscribe({
      next: (response) => {
        console.log("Inregistrare reusita:", response);

        // Salvam numele local pentru UI (Sidebar)
        localStorage.setItem('userName', `${this.name} ${this.surname}`);

        // Putem loga userul automat sau il trimitem la login
        // Varianta 1: Trimite la Login
        alert('Cont creat! Te rugăm să te autentifici.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        this.signupError = "Eroare la înregistrare (posibil email existent).";
      }
    });
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
