import { Component, Input } from '@angular/core';
import { Appointment } from '../../../../../models/appointment/Appointment';
import { GoogleMapsLink } from '../appointment-navigation-button/links/GoogleMapsLink';
import { AppleMapsLink } from '../appointment-navigation-button/links/AppleMapsLink';
import { HereWeGoLink } from '../appointment-navigation-button/links/HereWeGoLink';
import { PositionService } from '../../../../../services/position/position.service';
import { fromPromise } from 'rxjs/internal-compatibility';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-appointment-navigation',
  templateUrl: './appointment-navigation.component.html',
  styleUrls: ['./appointment-navigation.component.scss'],
})
export class AppointmentNavigationComponent {

  @Input() appointment!: Appointment;

  googleMapsLink = new GoogleMapsLink();
  appleMapsLink = new AppleMapsLink();
  hereWeGoLink = new HereWeGoLink();
  currentPosition$: Observable<Position>;

  constructor(private readonly position: PositionService) {
    this.currentPosition$ = fromPromise(
      this.position.getCurrentPosition(),
    );
  }

}
