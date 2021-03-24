import { Component, Input } from '@angular/core';
import { Appointment } from '../../../../../models/appointment/Appointment';
import { Observable, of } from 'rxjs';
import { Route } from '../../../../../models/route/Route';
import dayjs from '../../../../../../dayjs';
import { PositionService } from '../../../../../services/position/position.service';
import { fromPromise } from 'rxjs/internal-compatibility';

@Component({
  selector: 'app-appointment-overview',
  templateUrl: './appointment-overview.component.html',
  styleUrls: ['./appointment-overview.component.scss'],
})
export class AppointmentOverviewComponent {

  @Input() appointment: Appointment | null = null;

  @Input() route$: Observable<Route | null> = of(null);

  canLoad$: Observable<boolean>;

  constructor(private readonly position: PositionService) {
    this.canLoad$ = fromPromise(position.hasPermission());
  }

  getDuration(route: Route): string {
    const dur = dayjs.duration(route.getDuration(), 'seconds');
    return `${dur.hours()}h ${dur.minutes()}m`;
  }

  getDepartmentTime(route: Route): string {
    if (!this.appointment) {
      return '';
    }

    return this.appointment.getDateTime().subtract(route.getDuration(), 'second')?.format('HH:mm');
  }
}
