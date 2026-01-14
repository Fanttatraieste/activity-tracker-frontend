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
  // Injectarea dependintelor: Router pentru navigare si AuthService pentru apeluri API
  constructor(private router: Router, private authService: AuthService) {}

  email: string = "";
  password: string = "";
  loginError: string | null = null;
  selectedBackground: string = "";

  ngOnInit(): void {
    // Initializarea automata a fundalului la incarcarea componentei
    this.setAutoBackground();
  }

  // Logica pentru selectarea imaginii de fundal in functie de anotimpul curent
  private setAutoBackground(): void {
    const month = new Date().getMonth(); // 0 = Ianuarie, 11 = Decembrie
    if (month >= 2 && month <= 4) this.selectedBackground = "assets/sign-up-background-images/Spring_Project.jpg";
    else if (month >= 5 && month <= 7) this.selectedBackground = "assets/sign-up-background-images/Summer_Project.jpg";
    else if (month >= 8 && month <= 10) this.selectedBackground = "assets/sign-up-background-images/Autumn_Project.jpg";
    else this.selectedBackground = "assets/sign-up-background-images/Winter_Project.jpg";
  }

  // Getter folosit de HTML pentru a seta stilul CSS inline (background-image)
  get backgroundStyle(): string {
    return `url('${this.selectedBackground}')`;
  }

  // Gestionarea procesului de autentificare
  onLogin() {
    this.loginError = null;

    // Validare primara pe partea de client
    if (!this.email || !this.password) {
      this.loginError = "Introdu email si parola.";
      return;
    }

    // Apelarea serviciului de autentificare si gestionarea raspunsului prin Observable
    this.authService.login({ email: this.email, password: this.password })
      .subscribe({
        // Daca login-ul reuseste, redirectionam utilizatorul catre pagina orarului
        next: () => this.router.navigate(['/timetable']),
        // In caz de eroare (ex: date incorecte), afisam mesajul corespunzator
        error: () => this.loginError = "Email sau parola incorecta!"
      });
  }

  onGoogleLogin() {
    alert("Autentificarea cu Google este momentan indisponibila.");
  }
}
