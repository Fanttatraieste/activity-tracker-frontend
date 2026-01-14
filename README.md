# 📅 Activity Tracker - Student Timetable Frontend

[![Angular](https://img.shields.io/badge/Angular-17%2B-DD0031?style=for-the-badge&logo=angular)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

Acesta este modulul de **Frontend** pentru aplicația **Activity Tracker**, un ecosistem digital destinat studenților pentru gestionarea eficientă a programului academic. Aplicația oferă o experiență interactivă pentru vizualizarea orarului, monitorizarea progresului și organizarea notițelor.

---

## ✨ Funcționalități Principale

- **Orar Inteligent (CSS Grid):** Vizualizare dinamică a cursurilor, seminarelor și laboratoarelor în funcție de săptămână (Pară/Impară) și grupă.
- **Indicator Real-Time:** O linie de timp orizontală care indică vizual progresul zilei curente pe orar.
- **Integrare Meteo:** Afișarea prognozei meteo (temperatură și iconiță) direct pe celulele cursurilor, preluată prin API pentru o planificare mai bună a deplasărilor.
- **Managementul Prezențelor:** Sistem de contorizare a prezențelor pentru fiecare activitate, cu feedback vizual asupra progresului.
- **Catalog Digital:** Panou de note cu gestionarea ponderilor (weights) pentru calcularea mediei la fiecare materie.
- **Notițe Contextuale:** Salvarea și editarea notițelor specifice pentru fiecare dintre cele 14 săptămâni ale semestrului.
- **Filtrare Avansată:** Header interactiv pentru filtrarea rapidă a tipurilor de activități (Curs/Sem/Lab).

---

## 🛠️ Tehnologii Utilizate

- **Angular 17+** - Arhitectură bazată pe *Standalone Components*.
- **TypeScript** - Programare puternic tipizată pentru stabilitate.
- **CSS3 Modern** - Layout-uri realizate cu **CSS Grid** și **Flexbox**.
- **RxJS** - Gestionarea fluxurilor de date asincrone de la API.
- **JWT Auth Interceptor** - Securizarea automată a cererilor HTTP prin injectarea token-ului de acces în Header.

---

## 📁 Structura Proiectului

Organizarea fișierelor respectă bunele practici Angular pentru scalabilitate:

* **`src/app/components/timetable/`**
    * `timetable-grid/`: Logica centrală a grid-ului și calculul coliziunilor.
    * `sidebar/`: Filtre pentru materii opționale și setări.
    * `header/`: Selecția grupei, săptămânii și a filtrelor globale.
    * `notes-panel/` & `grades-panel/`: Interfețe de editare laterală (Slide-in).
* **`src/app/services/`**
    * `auth.service.ts`: Gestionarea login-ului și decodificarea JWT.
    * `timetable.service.ts`: Preluarea datelor orarului de la server.
    * `weather.service.ts`: Integrarea cu API-ul meteorologic.
    * `attendance.service.ts` & `grade.service.ts`: Persistența datelor academice.
* **`src/app/interceptors/`**
    * `auth.interceptor.ts`: Adăugarea automată a header-ului `Authorization`.

---

## 🔌 Conexiune Backend

Aplicația este configurată să comunice cu un server **Spring Boot** localizat la `http://localhost:8080`.

**Principalele Endpoint-uri REST:**
- `POST /api/auth/login` - Autentificare utilizator.
- `GET /api/class-schedules/filter` - Preluare orar cu parametrii `classType` și `classFrequency`.
- `POST /api/attendance` - Salvare prezență student.
- `GET /api/grades/user/{uuid}` - Recuperare catalog note.
- `GET /api/weather` - Date meteo sosite prin proxy-ul backend-ului.

---

## 🚀 Instalare și Pornire

1.  **Clonează repository-ul:**
    ```bash
    git clone [https://github.com/utilizatorul-tau/activity-tracker-frontend.git](https://github.com/utilizatorul-tau/activity-tracker-frontend.git)
    cd activity-tracker-frontend
    ```
2.  **Instalează dependențele:**
    ```bash
    npm install
    ```
3.  **Lansează aplicația:**
    ```bash
    ng serve
    ```
4.  **Deschide în browser:**
    Accesează `http://localhost:4200`.
