import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ComponentsModule } from '../../components/components.module';
import { AppComponentsModule } from '../../components/pages/app/app-components.module';
import { AppointmentComponent } from './appointment/appointment.component';
import { UtilsModule } from '../../utils/utils.module';
import { LocationComponent } from './location/location.component';


@NgModule({
  declarations: [DashboardComponent, AppointmentComponent, LocationComponent],
  imports: [
    CommonModule,
    AppRoutingModule,
    ComponentsModule,
    AppComponentsModule,
    UtilsModule,
  ],
})
export class AppModule { }
