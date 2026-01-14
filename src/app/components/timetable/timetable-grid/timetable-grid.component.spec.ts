import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimetableGridComponent } from './timetable-grid.component';

describe('TimetableGrid', () => {
  let component: TimetableGridComponent;
  let fixture: ComponentFixture<TimetableGridComponent>;

  // Configurarea mediului de testare Jasmine/Karma
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Importa componenta standalone pentru a fi testata in izolare
      imports: [TimetableGridComponent]
    })
      .compileComponents(); // Pregateste componentele (template + stiluri)

    // Creeaza fixture-ul (obiectul de test care simuleaza componenta pe ecran)
    fixture = TestBed.createComponent(TimetableGridComponent);
    component = fixture.componentInstance;

    // Declanșează prima detectie a schimbarilor (ruleaza ngOnInit, constructor etc.)
    fixture.detectChanges();
  });

  // Testul principal de verificare a integritatii
  it('should create', () => {
    // Assert: Verifică dacă instanța componentei este validă (nu este null)
    expect(component).toBeTruthy();
  });
});
