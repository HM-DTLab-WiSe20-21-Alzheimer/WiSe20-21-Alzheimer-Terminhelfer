import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthenticatedGuard } from './authenticated.guard';
import { AppointmentComponent } from './appointment/appointment.component';
import { LocationComponent } from './location/location.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthenticatedGuard],
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'appointment/:id',
        component: AppointmentComponent,
      },
      {
        path: 'location',
        component: LocationComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
