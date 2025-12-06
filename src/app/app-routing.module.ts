import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SpecialisationsComponent } from './components/admin/specialisations/specialisations.component';
import { LoginPageComponent } from './components/login/login-page/login-page.component';
import {SignUpComponent} from './components/sign-up/sign-up.component'
import {TimetableComponent} from './components/timetable/timetable.component';

// import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  { path: '', component: SpecialisationsComponent },
  { path: 'login', component: LoginPageComponent },
  {path: 'sign-up', component: SignUpComponent},
  { path: 'timetable', component: TimetableComponent },
  {
    path: 'admin',
    // Apply guard to admin routes once implemented:
    // canActivate: [AdminGuard],
    // canActivateChild: [AdminGuard],
    children: [
      { path: 'specialisations', component: SpecialisationsComponent },
      // other admin child routes...
    ],
  },
  { path: '**', redirectTo: '/admin/specialisations' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
