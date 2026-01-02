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
  private userService = inject(UserService);
  private authService = inject(AuthService);

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
    this.loadUserData();
  }

  loadUserData() {
    const user = this.authService.getCurrentUser();
    if (user && user.uuid) {
      this.userService.getProfile(user.uuid).subscribe({
        next: (data: any) => {
          // Mapăm datele primite (care vin cu academicEmail din Java DTO)
          this.userData = {
            nume: data.nume || '',
            prenume: data.prenume || '',
            emailPersonal: data.emailPersonal || '',
            telefon: data.telefon || '',
            specializare: data.specializare || '',
            grupa: data.grupa || '',
            nrMatricol: data.nrMatricol || '',
            codStudent: data.codStudent || '',
            // Luăm valoarea din academicEmail (de la server) și o punem în emailAcademic (pentru HTML)
            emailAcademic: data.academicEmail || user.sub
          };
        },
        error: (err) => console.error("Error loading profile:", err)
      });
    }
  }

  saveSettings() {
    const user = this.authService.getCurrentUser();
    if (user && user.uuid) {
      this.userService.updateProfile(user.uuid, this.userData).subscribe({
        next: (response) => {
          alert('Profile updated successfully!');
          this.userData = response; // Refresh local data with server response
        },
        error: (err) => {
          console.error("Error saving profile:", err);
          alert('Failed to save changes.');
        }
      });
    }
  }
}
