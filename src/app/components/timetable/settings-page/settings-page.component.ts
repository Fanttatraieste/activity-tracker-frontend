import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService, UserProfile } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.css']
})
export class SettingsPageComponent implements OnInit {
  // Injectarea serviciilor necesare folosind functia inject()
  private userService = inject(UserService);
  private authService = inject(AuthService);

  // Initializarea obiectului userData cu valori goale conform interfetei UserProfile
  userData: UserProfile = {
    nume: '',
    prenume: '',
    emailPersonal: '',
    telefon: '',
    specializare: '',
    grupa: '',
    nrMatricol: '',
    codStudent: '',
    emailAcademic: ''
  };

  // Date statice pentru popularea meniurilor de selectie (dropdown-uri)
  specializari = [
    'Matematica Informatica Romana An 1',
    'Matematica Informatica Romana An 2',
    'Matematica Informatica Romana An 3',
    'Matematica Informatica Engleza An 1',
    'Matematica Informatica Engleza An 2',
    'Matematica Informatica Engleza An 3'
  ];

  grupe = ['331-1', '331-2', '332-1', '332-2', '333-1', '333-2'];

  ngOnInit(): void {
    // Incarcarea datelor utilizatorului imediat ce componenta este creata
    this.loadUserData();
  }

  // Preia datele profilului din Backend folosind UUID-ul utilizatorului logat
  loadUserData() {
    const user = this.authService.getCurrentUser();
    if (user && user.uuid) {
      this.userService.getProfile(user.uuid).subscribe({
        next: (data: any) => {
          // Maparea campurilor primite din Java DTO catre modelul local din Angular
          this.userData = {
            nume: data.nume || '',
            prenume: data.prenume || '',
            emailPersonal: data.emailPersonal || '',
            telefon: data.telefon || '',
            specializare: data.specializare || '',
            grupa: data.grupa || '',
            nrMatricol: data.nrMatricol || '',
            codStudent: data.codStudent || '',
            // Sincronizarea emailului academic (care este readonly in interfata)
            emailAcademic: data.academicEmail || user.sub
          };
        },
        error: (err) => console.error("Error loading profile:", err)
      });
    }
  }

  // Trimite datele modificate catre server pentru actualizare
  saveSettings() {
    const user = this.authService.getCurrentUser();
    if (user && user.uuid) {
      this.userService.updateProfile(user.uuid, this.userData).subscribe({
        next: (response) => {
          alert('Profil actualizat cu succes!');
          // Actualizarea starii locale cu raspunsul oficial de la server
          this.userData = response;
        },
        error: (err) => {
          console.error("Error saving profile:", err);
          alert('Eroare la salvarea modificarilor.');
        }
      });
    }
  }
}
