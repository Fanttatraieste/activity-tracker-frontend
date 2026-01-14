import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPageComponent } from './login-page.component';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;

  // Configuarea mediului de testare inainte de fiecare test individual
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginPageComponent]
    });

    // Crearea unei instante a componentei intr-un mediu controlat
    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;

    // Fortarea detectiei de schimbari pentru a initializa template-ul si binding-urile
    fixture.detectChanges();
  });

  // Test de baza: verifica daca instanta componentei a fost creata cu succes
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
