import { Component } from '@angular/core';
import { Appointment } from '../../../models/appointment/Appointment';
import { ActivatedRoute } from '@angular/router';
import { AppointmentService } from '../../../services/appointment/appointment.service';
import { HereMapService } from '../../../services/map/here-map.service';
import { fromPromise } from 'rxjs/internal-compatibility';
import { Observable, of } from 'rxjs';
import { Route } from '../../../models/route/Route';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss'],
})
export class AppointmentComponent {
  appointment$: Observable<Appointment | null>;
  route$: Observable<Route | null>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly appointmentService: AppointmentService,
    private readonly hereService: HereMapService,
  ) {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      throw new Error('Appointment Id not set');
    }

    this.appointment$ = fromPromise(this.appointmentService.get(id));

    this.route$ = this.appointment$.pipe(
      mergeMap(appointment => appointment && appointment.canCalculateRoute() ? fromPromise(this.hereService.getRoute(appointment)) : of(null)),
    );
  }

}
