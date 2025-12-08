import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  activeMenu: string | null = null;

  // --- Date pentru "Alege materie" ---
  materii = [
    { nume: 'Instruire asistată de calculator', selectat: false },
    { nume: 'Software matematic', selectat: false },
    { nume: 'Astronomie', selectat: false },
    { nume: 'Analiză funcțională', selectat: false },
    { nume: 'Rețele de calculatoare', selectat: false }, // Am scurtat putin textul sa incapa bine
    { nume: 'Instrumente CASE', selectat: false },
    { nume: 'Interacțiunea om-calculator', selectat: false }
  ];

  // --- Date pentru "Schimba ora" ---
  grupe = ['Grupa 331-1', 'Grupa 331-2', 'Grupa 332-1', 'Grupa 332-2', 'Grupa 333-1', 'Grupa 333-2'];
  tipuriOra = ['Laborator', 'Seminar', 'Curs'];
  materiiOrar = ['Software matematic', 'Astronomie', 'Instrumente CASE', 'Analiză'];

  // Variabile pentru selecțiile utilizatorului
  selectedGrupa: string = '';
  selectedMaterie: string = '';
  selectedTip: string = '';

  toggleMenu(menuName: string): void {
    this.activeMenu = this.activeMenu === menuName ? null : menuName;
  }

  schimbaOra(): void {
    if(this.selectedGrupa && this.selectedMaterie && this.selectedTip) {
      alert(`Cerere trimisă pentru: ${this.selectedMaterie} (${this.selectedTip}) la ${this.selectedGrupa}`);
    } else {
      alert("Te rog selectează toate câmpurile!");
    }
  }
}
