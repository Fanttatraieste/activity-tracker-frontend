import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimetableComponent } from './timetable.component';

describe('TimetableComponent', () => {
  let component: TimetableComponent;
  let fixture: ComponentFixture<TimetableComponent>;

  // Pregatirea mediului de testare inainte de executia fiecarui test
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Fiind o componenta standalone, se importa direct in zona de configurare
      imports: [TimetableComponent]
    })
      .compileComponents(); // Traducerea template-ului HTML si a CSS-ului in cod executabil

    // Crearea instantei de test
    fixture = TestBed.createComponent(TimetableComponent);
    component = fixture.componentInstance;

    // Declanșarea detectiei schimbarilor pentru a popula variabilele initiale
    fixture.detectChanges();
  });

  // Verificarea de baza a existentei componentei
  it('should create', () => {
    // Assert: Testul trece daca instanta TimetableComponent este creata fara erori
    expect(component).toBeTruthy();
  });
});
