import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';

describe('Sidebar', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  // Configurarea mediului de testare inainte de fiecare test individual
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Importa componenta (fiind standalone) in modulul de testare
      imports: [SidebarComponent]
    })
      .compileComponents(); // Compileaza template-ul si stilurile CSS

    // Creeaza o instanta a componentei intr-un mediu controlat (fixture)
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance; // Acces la logica din clasa TS
    fixture.detectChanges(); // Fortreaza detectia schimbarilor pentru a randa HTML-ul
  });

  // Testul de baza: verifica daca componenta a fost instantiata cu succes
  it('should create', () => {
    // Asteptarea (assertion): componenta trebuie sa existe (sa nu fie null/undefined)
    expect(component).toBeTruthy();
  });
});
