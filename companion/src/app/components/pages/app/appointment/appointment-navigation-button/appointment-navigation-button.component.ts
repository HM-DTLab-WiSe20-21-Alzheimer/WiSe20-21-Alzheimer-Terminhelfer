import { Component, Input } from '@angular/core';
import { Link } from './links/Link';
import { Appointment } from '../../../../../models/appointment/Appointment';

@Component({
  selector: 'app-appointment-navigation-button',
  templateUrl: './appointment-navigation-button.component.html',
  styleUrls: ['./appointment-navigation-button.component.scss'],
})
export class AppointmentNavigationButtonComponent {

  @Input() link!: Link;
  @Input() appointment!: Appointment;
  @Input() position!: Position;

}
