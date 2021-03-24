import { Injectable } from '@angular/core';
import { Location } from '../../models/location/Location';
import { API } from '@aws-amplify/api';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  getAll(): Promise<Location[]> {
    return API.get('location', '/location', {})
      .then(result => JSON.parse(result.body) || [])
      .then(result => result.map((location: any) => new Location(location)));
  }
}
