import { Component, EventEmitter, inject, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  // Injectarea dependintelor pentru navigare si date
  private router = inject(Router);
  private userService = inject(UserService);
  private authService = inject(AuthService);

  // Emitatori de evenimente pentru a trimite date catre componenta parinte (Timetable)
  @Output() optionaleSchimbate = new EventEmitter<string[]>();
  @Output() cerereSchimbareOra = new EventEmitter<{grupa: string, materie: string, tip: string}>();

  activeMenu: string | null = null; // Gestioneaza starea meniului de tip acordeon
  displayName: string = 'Utilizator';
  displayEmail: string = '';

  // --- Date pentru filtrarea materiilor ---
  materii = [
    { nume: 'Instruire asistata de calculator', selectat: true },
    { nume: 'Software matematic', selectat: true },
    { nume: 'Astronomie', selectat: true },
    { nume: 'Analiza functionala', selectat: true },
    { nume: 'Principiile retelelor de calculatoare', selectat: true },
    { nume: 'Instrumente CASE', selectat: true },
    { nume: 'Interactiunea om-calculator', selectat: true }
  ];

  // --- Date pentru formularele de schimbare grupa ---
  grupe = ['Grupa 331-1', 'Grupa 331-2', 'Grupa 332-1', 'Grupa 332-2', 'Grupa 333-1', 'Grupa 333-2'];
  tipuriOra = ['Laborator', 'Seminar', 'Curs'];
  materiiOrar = [
    'Software matematic', 'Astronomie', 'Instrumente CASE',
    'Instruire asistata de calculator', 'Principiile retelelor de calculatoare',
    'Analiza functionala', 'Interactiunea om-calculator',
    'Ecuatii cu derivate partiale', 'Statistica matematica',
    'Proiect colectiv', 'Limbaje formale si tehnici de compilare'
  ];

  selectedGrupa: string = '';
  selectedMaterie: string = '';
  selectedTip: string = '';

  ngOnInit(): void {
    this.loadUserData(); // Incarca profilul la start
    this.onMaterieToggle(); // Emite starea initiala a filtrelor
  }

  // Preia informatiile utilizatorului pentru a le afisa in partea de sus a sidebar-ului
  loadUserData(): void {
    const user = this.authService.getCurrentUser();
    if (user && user.uuid) {
      this.userService.getProfile(user.uuid).subscribe({
        next: (data) => {
          if (data.nume || data.prenume) {
            this.displayName = `${data.nume} ${data.prenume}`.trim();
          } else {
            this.displayName = 'Student';
          }
          this.displayEmail = data.emailAcademic || user.sub;
        },
        error: (err) => {
          console.error("Eroare la incarcarea datelor in sidebar:", err);
          this.displayEmail = user.sub;
        }
      });
    }
  }

  // Schimba sectiunea vizibila din meniu (acordeon)
  toggleMenu(menuName: string): void {
    this.activeMenu = this.activeMenu === menuName ? null : menuName;
  }

  // Metoda apelata la fiecare bifare/debifare a unei materii
  onMaterieToggle(): void {
    // Filtreaza doar numele materiilor selectate pentru a fi trimise la grid-ul orarului
    const materiiSelectate = this.materii
      .filter(m => m.selectat)
      .map(m => m.nume);

    this.optionaleSchimbate.emit(materiiSelectate);
  }

  // Colecteaza datele din formularul de schimbare ora si le trimite catre parinte
  schimbaOra(): void {
    if(this.selectedGrupa && this.selectedMaterie && this.selectedTip) {
      this.cerereSchimbareOra.emit({
        grupa: this.selectedGrupa,
        materie: this.selectedMaterie,
        tip: this.selectedTip
      });
      console.log(`Cerere trimisa: ${this.selectedMaterie} la ${this.selectedGrupa}`);
    } else {
      alert("Te rog selecteaza toate campurile!");
    }
  }

  goToSettings(): void {
    this.router.navigate(['/settings']);
  }
}
