import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideHttpClient } from '@angular/common/http';
import { TimetableComponent } from './components/timetable/timetable.component';
import { LoginPageComponent } from './components/login/login-page/login-page.component';
import {SignUpComponent} from './components/sign-up/sign-up.component';


@NgModule({
  declarations: [],
  imports: [BrowserModule, AppRoutingModule, TimetableComponent, LoginPageComponent, SignUpComponent],
  providers: [provideHttpClient()],
  bootstrap: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    LoginPageComponent,
    SignUpComponent,
    TimetableComponent
  ]
})
export class AppModule {}
