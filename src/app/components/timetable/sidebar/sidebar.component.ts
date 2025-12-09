import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  private router = inject(Router);

  @Output() optionaleSchimbate = new EventEmitter<string[]>();
  activeMenu: string | null = null;

  // --- Date pentru "Alege materie" ---
  materii = [
    { nume: 'Instruire asistata de calculator', selectat: true },
    { nume: 'Software matematic', selectat: true },
    { nume: 'Astronomie', selectat: true },
    { nume: 'Analiza functionala', selectat: true },
    { nume: 'Principiile retelelor de calculatoare', selectat: true },
    { nume: 'Instrumente CASE', selectat: true },
    { nume: 'Interactiunea om-calculator', selectat: true }
  ];

  // --- Date pentru "Schimba ora" ---
  grupe = ['Grupa 331-1', 'Grupa 331-2', 'Grupa 332-1', 'Grupa 332-2', 'Grupa 333-1', 'Grupa 333-2'];
  tipuriOra = ['Laborator', 'Seminar', 'Curs'];
  materiiOrar = ['Software matematic', 'Astronomie', 'Instrumente CASE', 'Instruire asistata de calculator', 'Principiile retelelor de calculatorare', 'Analiza functionala', 'Interactiune om-calculator'];

  // Variabile pentru selecțiile utilizatorului
  selectedGrupa: string = '';
  selectedMaterie: string = '';
  selectedTip: string = '';

  ngOnInit(): void {
    this.onMaterieToggle();
  }

  toggleMenu(menuName: string): void {
    this.activeMenu = this.activeMenu === menuName ? null : menuName;
  }

  onMaterieToggle(): void {
    // Extragem doar numele materiilor care au selectat === true
    const materiiSelectate = this.materii
      .filter(m => m.selectat)
      .map(m => m.nume);

    console.log('SIDEBAR emite lista noua:', materiiSelectate); // <--- ADAUGA ASTA
    // Trimitem lista către părinte (TimetableComponent)
    this.optionaleSchimbate.emit(materiiSelectate);
  }

  schimbaOra(): void {
    if(this.selectedGrupa && this.selectedMaterie && this.selectedTip) {
      alert(`Cerere trimisă pentru: ${this.selectedMaterie} (${this.selectedTip}) la ${this.selectedGrupa}`);
    } else {
      alert("Te rog selectează toate câmpurile!");
    }
  }
  // 4. Adaugam functia de navigare
  goToSettings(): void {
    this.router.navigate(['/settings']);
  }
}
