import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideHttpClient } from '@angular/common/http';
import { TimetableComponent } from './components/timetable/timetable.component';

@NgModule({
  declarations: [],
  imports: [BrowserModule, AppRoutingModule, TimetableComponent],
  providers: [provideHttpClient()],
  bootstrap: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
