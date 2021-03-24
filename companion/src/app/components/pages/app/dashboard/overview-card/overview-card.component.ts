import { Component, OnInit } from '@angular/core';
import { Appointment } from '../../../../../models/appointment/Appointment';
import { AppointmentService } from '../../../../../services/appointment/appointment.service';
import dayjs from '../../../../../../dayjs';
import { Observable } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';


@Component({
  selector: 'app-overview-card',
  templateUrl: './overview-card.component.html',
  styleUrls: ['./overview-card.component.scss'],
})
export class OverviewCardComponent implements OnInit {

  constructor(private readonly appointmentService: AppointmentService) {
  }

  $appointments!: Observable<Appointment[]>;

  date = dayjs().startOf('day');
  neutral = this.date;

  getDateDiff(): number {
    return Math.floor(dayjs.duration(this.date.diff(this.neutral)).asDays());
  }

  getDateDiffAbs(): number {
    return Math.abs(this.getDateDiff());
  }

  ngOnInit(): void {
    this.loadAppointments();
  }

  private loadAppointments(): void {
    this.$appointments = fromPromise(
      this.appointmentService.getAllByDay(this.date),
    );
  }

  nextDay(): void {
    this.date = this.date.add(1, 'day');
    this.loadAppointments();
  }

  previousDay(): void {
    this.date = this.date.subtract(1, 'day');
    this.loadAppointments();
  }
}
