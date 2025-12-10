import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.css']
})
export class SettingsPageComponent {

  // --- date utilizator ---
  userData = {
    nume: 'Priala',
    prenume: 'Radu',
    emailPersonal: 'radu.private@gmail.com',
    telefon: '0740 123 456',

    // Date Academice
    specializare: 'Matematica Informatica Romana An 3',
    grupa: '333-1',
    nrMatricol: '31092',
    codStudent: 'MIE3331',
    emailAcademic: 'radu.priala@stud.ubbcluj.ro'
  };

  // --- Listele pentru Dropdown ---
  specializari = [
    'Matematica Informatica Romana An 1',
    'Matematica Informatica Romana An 2',
    'Matematica Informatica Romana An 3',
    'Matematica Informatica Engleza An 1',
    'Matematica Informatica Engleza An 2',
    'Matematica Informatica Engleza An 3'
  ];

  grupe = [
    '331-1', '331-2',
    '332-1', '332-2',
    '333-1', '333-2'
  ];

  saveSettings() {
    console.log('Date salvate:', this.userData);
    alert('Datele au fost actualizate!');
  }
}
