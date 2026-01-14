import { Component, Input, OnInit, OnChanges, SimpleChanges, inject, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherResponse, WeatherService } from '../../../services/weather.service';
import { TimetableService } from '../../../services/timetable.service';
import { AttendanceService } from '../../../services/attendance.service';
import { AuthService } from '../../../services/auth.service';
import { GradeService } from '../../../services/grade.service';
import { FormsModule } from '@angular/forms';
import { EventGradesComponent } from './event-grades/event-grades.component';
import { EventAttendanceComponent } from './event-attendance/event-attendance.component';

// Liste de materii care necesita filtrare speciala (nu apar automat pentru toata grupa)
const KNOWN_OPTIONALS = [
  'Instruire asistata de calculator',
  'Software matematic',
  'Astronomie',
  'Analiza functionala',
  'Principiile retelelor de calculatoare',
  'Instrumente CASE',
  'Interactiunea om-calculator'
];

// Mapare completa a locatiilor catre coordonate Google Maps (Mock URLs)
const MAP_URLS = {
  CENTRAL: 'https://www.google.com/maps/place/Facultatea+De+Matematic%C4%83+%C8%99i+Informatic%C4%83/@46.7675377,23.5892532,387m/data=!3m1!1e3!4m10!1m2!2m1!1subb+mate+info!3m6!1s0x47490c28706c8277:0xc25e4a8111c461b7!8m2!3d46.7675377!4d23.5914419!15sCg11YmIgbWF0ZSBpbmZvIgOIAQFaDyINdWJiIG1hdGUgaW5mb5IBFXVuaXZlcnNpdHlfZGVwYXJ0bWVudJoBI0NoWkRTVWhOTUc5blMwVkpRMEZuU1VOUE5XSlhaazFSRUFF4AEA-gEECAAQDA!16s%2Fg%2F1hc5k1l59?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoKLDEwMDc5MjA2N0gBUAM%3D',
  FSEGA:   'https://www.google.com/maps/place/Facultatea+de+%C5%9Etiin%C5%A3e+Economice+%C5%9Fi+Gestiunea+Afacerilor/@46.7731783,23.6188137,774m/data=!3m2!1e3!4b1!4m6!3m5!1s0x47490c15a18e8af9:0xcc357d4dedcf12a0!8m2!3d46.7731747!4d23.621394!16s%2Fg%2F1yglpxyfs?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoKLDEwMDc5MjA2N0gBUAM%3D',
  DPPD:    'https://www.google.com/maps/place/Departamentul+pentru+Preg%C4%83tirea+Personalului+Didactic/@46.7672894,23.5828267,774m/data=!3m2!1e3!5s0x47490e8347715173:0xd813e9947cab537b!4m6!3m5!1s0x47490e9cb6a00ee5:0x50c71d6442164675!8m2!3d46.7680794!4d23.5839371!16s%2Fg%2F11c1rsdn5b?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoKLDEwMDc5MjA2N0gBUAM%3D',
  DREPT:   'https://www.google.com/maps/place/Str.+Avram+Iancu+11,+Cluj-Napoca+400089/@46.7665355,23.5896221,112m/data=!3m1!1e3!4m6!3m5!1s0x47490c28386a5071:0x2e24722fdca7a1f5!8m2!3d46.7664594!4d23.5898308!16s%2Fg%2F11b8vdm_4h?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoKLDEwMDc5MjA2N0gBUAM%3D',
  OBS:     'https://www.google.com/maps/place/Observatorul+Astronomic/@46.7579158,23.5764862,3096m/data=!3m1!1e3!4m10!1m2!2m1!1sobservator+astronomic!3m6!1s0x47490dd4bdea1097:0x2e061bcaad43ed42!8m2!3d46.7579158!4d23.5865796!15sChVvYnNlcnZhdG9yIGFzdHJvbm9taWOSAQtvYnNlcnZhdG9yeeABAA!16s%2Fg%2F1tf14nmb?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoKLDEwMDc5MjA2N0gBUAM%3D',
  ST_EUR:  'https://www.google.com/maps/place/Facultatea+de+Studii+Europene/@46.7680571,23.5898281,774m/data=!3m2!1e3!4b1!4m6!3m5!1s0x47490c27d9eaaf8b:0x464443d1dbcdea9e!8m2!3d46.7680535!4d23.5924084!16s%2Fg%2F1hf2pn_2r?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoKLDEwMDc5MjA2N0gBUAM%3D',
  DEFAULT: 'https://maps.app.goo.gl/cFiJ9NEA7Keap92L6'
};

export interface CalendarEvent {
  id: any;
  title: string;
  type: 'lab' | 'curs' | 'sem';
  professor: string;
  room: string;
  dayIndex: number;
  startRow: number;
  span: number;
  width?: number;
  marginLeft?: number;
  isAttendanceOpen?: boolean;
  notes?: string;
  weeklyNotes: { [week: number]: string };
  attendanceCount?: number;
  totalRequired: number;
  grades?: any[];
  weatherInfo?: {
    temp: number;
    condition: string;
    iconUrl: string;
  };
}

@Component({
  selector: 'app-timetable-grid',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    EventGradesComponent,
    EventAttendanceComponent
  ],
  templateUrl: './timetable-grid.component.html',
  styleUrls: ['./timetable-grid.component.css']
})
export class TimetableGridComponent implements OnInit, OnChanges {

  @Input() selectedGroup: number = 331;
  @Input() selectedWeek: 1 | 2 = 1;
  @Input() activeFilters = { curs: true, sem: true, lab: true };
  @Input() optionals: string[] = [];
  @Input() currentDayIndex!: number;
  @Input() currentLinePosition!: number;
  @Input() showWeather: boolean = false;

  private weatherService = inject(WeatherService);
  private timetableService = inject(TimetableService);
  private cdr = inject(ChangeDetectorRef);
  private attendanceService = inject(AttendanceService);
  private authService = inject(AuthService);
  private gradeService = inject(GradeService);

  private currentUserUuid = '';

  @Output() triggerGrades = new EventEmitter<CalendarEvent>();
  @Output() eventClicked = new EventEmitter<CalendarEvent>();
  @Output() gradesOpenRequested = new EventEmitter<CalendarEvent>();

  rawEvents: CalendarEvent[] = [];
  displayEvents: CalendarEvent[] = [];

  focusedDayIndex: number | null = null;
  focusedRow: number | null = null;

  // Mapare nume zi -> Index coloana Grid
  private dayMapping: { [key: string]: number } = {
    'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5,
    'Luni': 1, 'Marti': 2, 'Miercuri': 3, 'Joi': 4, 'Vineri': 5
  };

  // Asociere Sali -> Locatii pe harta
  private readonly roomToMapUrl: { [key: string]: string } = {
    'MOS-S15': MAP_URLS.CENTRAL, 'MOS-S16': MAP_URLS.CENTRAL,
    '6/II': MAP_URLS.CENTRAL, '7/I': MAP_URLS.CENTRAL,
    'Fizica-233': MAP_URLS.CENTRAL, 'Fizica-215': MAP_URLS.CENTRAL,
    '9/I': MAP_URLS.CENTRAL, '5/I': MAP_URLS.CENTRAL,
    'C310': MAP_URLS.FSEGA, 'C335': MAP_URLS.FSEGA,
    'L320': MAP_URLS.FSEGA, 'L001': MAP_URLS.FSEGA,
    'L439': MAP_URLS.FSEGA, 'L404': MAP_URLS.FSEGA,
    'DPPD-205': MAP_URLS.DPPD, 'A312': MAP_URLS.DREPT,
    'A313': MAP_URLS.DREPT, 'Obs': MAP_URLS.OBS,
    'StEur-Ferdinand': MAP_URLS.ST_EUR
  };

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.currentUserUuid = user?.uuid || '0a52ca35-4fb5-488a-aafe-cc1432b682f1';
    this.loadEventsFromBackend();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedGroup'] || changes['selectedWeek']) {
      this.loadEventsFromBackend();
    }
    if (changes['activeFilters'] || changes['optionals']) {
      if (this.rawEvents.length > 0) this.processEventsForDisplay();
    }
    if (changes['showWeather']) {
      this.showWeather ? this.fetchAndMapWeather() : this.displayEvents.forEach(ev => ev.weatherInfo = undefined);
    }
  }

  loadEventsFromBackend() {
    const frequency = this.selectedWeek === 1 ? 'Week1' : 'Week2';
    this.timetableService.getScheduleFromApi(undefined, frequency).subscribe({
      next: (data: any[]) => {
        const uiGroupStr = String(this.selectedGroup).replace('.', '').trim();
        const filteredByGroup = data.filter(item =>
          item.groups?.some((g: any) => String(g.number).trim() === uiGroupStr)
        );

        this.rawEvents = filteredByGroup.map(item => {
          const myAttendances = item.attendances?.filter((a: any) => a.userUuid === this.currentUserUuid) || [];
          const myGrades = item.grades?.filter((g: any) => g.userUuid === this.currentUserUuid) || [];

          return {
            id: item.uuid,
            title: item.subjectName,
            type: this.mapType(item.classType),
            professor: item.location || "Profesor",
            room: item.roomName || "Fara sala",
            dayIndex: this.dayMapping[this.capitalize(item.dayOfWeek)] || 1,
            startRow: (item.startingHour || 8) - 6,
            span: item.duration || 2,
            weeklyNotes: {},
            grades: myGrades,
            attendanceCount: myAttendances.length,
            totalRequired: item.attendancesRequired || 14
          };
        });
        this.processEventsForDisplay();
      }
    });
  }

  private processEventsForDisplay() {
    const filteredEvents = this.rawEvents.filter(ev => {
      if (ev.type === 'curs' && !this.activeFilters.curs) return false;
      if (ev.type === 'sem' && !this.activeFilters.sem) return false;
      if (ev.type === 'lab' && !this.activeFilters.lab) return false;
      if (KNOWN_OPTIONALS.includes(ev.title)) return this.optionals.includes(ev.title);
      return true;
    });
    this.calculateOverlaps(filteredEvents);
  }

  calculateOverlaps(eventsToProcess: CalendarEvent[]) {
    let events = eventsToProcess.map(e => ({ ...e, width: 100, marginLeft: 0 }));
    for (let i = 0; i < events.length; i++) {
      for (let j = i + 1; j < events.length; j++) {
        const ev1 = events[i];
        const ev2 = events[j];
        if (ev1.dayIndex === ev2.dayIndex) {
          const ev1End = ev1.startRow + ev1.span;
          const ev2End = ev2.startRow + ev2.span;
          if (ev1.startRow < ev2End && ev2.startRow < ev1End) {
            ev1.width = 50; ev1.marginLeft = 0;
            ev2.width = 50; ev2.marginLeft = 50;
          }
        }
      }
    }
    this.displayEvents = events;
  }

  fetchAndMapWeather() {
    this.weatherService.getWeather().subscribe({
      next: (data: WeatherResponse) => {
        const weatherLookup = new Map<string, { temp: number, condition: string }>();
        Object.keys(data).forEach(dateKey => {
          const dayData = data[dateKey];
          const dayIdx = this.dayMapping[dayData.day_name];
          if (dayIdx !== undefined) {
            dayData.hours.forEach((h: any) => {
              weatherLookup.set(`${dayIdx}-${h.hour}`, { temp: h.temp, condition: h.condition });
            });
          }
        });
        this.displayEvents.forEach(event => {
          const weather = weatherLookup.get(`${event.dayIndex}-${event.startRow + 6}`);
          if (weather) {
            event.weatherInfo = {
              temp: Math.round(weather.temp),
              condition: weather.condition,
              iconUrl: this.getIconForCondition(weather.condition)
            };
          }
        });
        this.cdr.markForCheck();
      }
    });
  }

  private getIconForCondition(condition: string): string {
    const cond = condition.toLowerCase();
    if (cond.includes('sun') || cond.includes('clear')) return 'assets/icons/sunny.png';
    if (cond.includes('rain')) return 'assets/icons/rain.png';
    return 'assets/icons/cloudy.png';
  }

  updateAttendance(event: CalendarEvent, newCount: number) {
    const isIncrement = newCount > (event.attendanceCount || 0);
    if (isIncrement) {
      this.attendanceService.createAttendance({ userUuid: this.currentUserUuid, classScheduleUuid: event.id })
        .subscribe(() => { event.attendanceCount = newCount; this.loadEventsFromBackend(); });
    } else {
      this.timetableService.getScheduleFromApi(undefined, this.selectedWeek === 1 ? 'Week1' : 'Week2').subscribe(data => {
        const attendance = data.find((item: any) => item.uuid === event.id)?.attendances?.find((a: any) => a.userUuid === this.currentUserUuid);
        if (attendance) this.attendanceService.deleteAttendance(attendance.uuid).subscribe(() => this.loadEventsFromBackend());
      });
    }
  }

  handleRoomClick(room: string, event: MouseEvent) {
    event.stopPropagation();
    window.open(this.roomToMapUrl[room] || `${MAP_URLS.DEFAULT}${room}`, '_blank');
  }

  // Helperi simpli
  private mapType(apiType: string): 'curs' | 'sem' | 'lab' {
    const t = apiType?.toLowerCase() || 'curs';
    return t.includes('lab') ? 'lab' : t.includes('sem') ? 'sem' : 'curs';
  }
  private capitalize(s: string) { return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : ''; }
  openLink(url: string) { window.open(url, "_blank"); }
  toggleAttendance(event: CalendarEvent) { event.isAttendanceOpen = !event.isAttendanceOpen; }
  onEventClick(event: CalendarEvent) { this.eventClicked.emit(event); }
  handleGradesClick(event: CalendarEvent) { this.triggerGrades.emit(event); }
  toggleDayFocus(dayIndex: number) { this.focusedDayIndex = this.focusedDayIndex === dayIndex ? null : dayIndex; }
  toggleHourFocus(rowIndex: number) { this.focusedRow = this.focusedRow === rowIndex ? null : rowIndex; }

  isEventDimmed(event: CalendarEvent): boolean {
    if (this.focusedDayIndex !== null && event.dayIndex !== this.focusedDayIndex) return true;
    if (this.focusedRow !== null) return !(this.focusedRow >= event.startRow && this.focusedRow < (event.startRow + event.span));
    return false;
  }
}
