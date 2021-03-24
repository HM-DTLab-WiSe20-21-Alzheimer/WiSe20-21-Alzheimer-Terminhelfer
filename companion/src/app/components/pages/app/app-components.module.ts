import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NextCardComponent } from './dashboard/next-card/next-card.component';
import { OverviewCardComponent } from './dashboard/overview-card/overview-card.component';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from '../../components.module';
import { AppointmentOverviewComponent } from './appointment/appointment-overview/appointment-overview.component';
import { AppointmentMapComponent } from './appointment/appointment-map/appointment-map.component';
import { UtilsModule } from '../../../utils/utils.module';
import { AppointmentNavigationButtonComponent } from './appointment/appointment-navigation-button/appointment-navigation-button.component';
import { AppointmentNavigationComponent } from './appointment/appointment-navigation/appointment-navigation.component';
import { LocationsCardComponent } from './location/locations-card/locations-card.component';


@NgModule({
  declarations: [
    NextCardComponent,
    OverviewCardComponent,
    AppointmentOverviewComponent,
    AppointmentMapComponent,
    AppointmentNavigationButtonComponent,
    AppointmentNavigationComponent,
    LocationsCardComponent,
  ],
    exports: [
        NextCardComponent,
        OverviewCardComponent,
        AppointmentOverviewComponent,
        AppointmentMapComponent,
        AppointmentNavigationComponent,
        LocationsCardComponent,
    ],
  imports: [
    CommonModule,
    RouterModule,
    ComponentsModule,
    UtilsModule,
  ],
})
export class AppComponentsModule {
}
