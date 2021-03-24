import type { Appointment } from './Appointment';
import * as dayjs from 'dayjs';
import { getModeByString, TransportMode } from '../route/TransportMode';
import { Location } from '../location/Location';

export class AlexaAppointment implements Appointment {

  private readonly time: dayjs.Dayjs;

  private readonly location: Location;

  private readonly name: string;

  private readonly id: string;

  private readonly transportMode: TransportMode;

  constructor(data: any) {
    this.time = dayjs(data.M.dateTime.S);
    this.location = new Location(data.M.location);
    this.name = data.M.title.S;
    this.id = data.M.id.S;
    this.transportMode = getModeByString(data.M.transport.S);
  }

  getDateTime(): dayjs.Dayjs {
    return this.time;
  }

  getLocation(): string | undefined {
    return this.location.getName();
  }

  getName(): string {
    return this.name;
  }

  getTransportMode(): TransportMode {
    return this.transportMode;
  }

  getDestination(): Location {
    return this.location;
  }

  getId(): string {
    return this.id;
  }

  canCalculateRoute(): boolean {
    return !!this.getDestination().getCoordinates();
  }
}
