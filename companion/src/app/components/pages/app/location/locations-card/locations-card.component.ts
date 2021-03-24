import { Component } from '@angular/core';
import { LocationService } from '../../../../../services/location/location.service';
import { Observable } from 'rxjs';
import { Location } from '../../../../../models/location/Location';
import { fromPromise } from 'rxjs/internal-compatibility';

@Component({
  selector: 'app-locations-card',
  templateUrl: './locations-card.component.html',
  styleUrls: ['./locations-card.component.scss'],
})
export class LocationsCardComponent {

  locations$: Observable<Location[]>;

  constructor(private readonly locationService: LocationService) {
    this.locations$ = fromPromise(locationService.getAll());
  }

}
