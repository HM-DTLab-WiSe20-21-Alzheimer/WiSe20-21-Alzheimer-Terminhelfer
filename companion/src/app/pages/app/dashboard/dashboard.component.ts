import { Component } from '@angular/core';
import { CognitoAuthenticationService } from '../../../services/authentication/cognito-authentication.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';
import { Appointment } from '../../../models/appointment/Appointment';
import { AppointmentService } from '../../../services/appointment/appointment.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {

  firstname: Observable<string>;
  date: string;
  nextAppointment: Promise<Appointment | null>;

  constructor(private readonly authService: CognitoAuthenticationService, private readonly appointmentService: AppointmentService) {
    this.firstname = authService.getUser()
      .pipe(
        map(user => user?.getName()),
        map(name => name?.split(' ')),
        map(parts => parts?.[0]),
        map(firstname => firstname ?? ''),
      );

    this.date = dayjs().format('dddd DD.MM.YYYY');
    this.nextAppointment = appointmentService.getNext();
  }
}
