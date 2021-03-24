import { TransportMode } from '../../../../../../models/route/TransportMode';
import { Link } from './Link';
import { Appointment } from '../../../../../../models/appointment/Appointment';

export class GoogleMapsLink implements Link {
  get(
    appointment: Appointment,
    position: Position
  ): string {
    const mode = this.getTransportMode(appointment.getTransportMode());
    const origin = `${position.coords.latitude},${position.coords.longitude}`;
    const destination = appointment.getDestination().getCoordinates();
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=${mode}`;
  }

  /**
   * Get travel mode string.
   * @param mode Travel mode
   * @private
   */
  private getTransportMode(mode: TransportMode): string {
    switch (mode) {
      case TransportMode.CAR:
        return 'driving';
      case TransportMode.BICYCLE:
        return 'bicycling';
      case TransportMode.WALK:
        return 'walking';
      case TransportMode.PUBLIC_TRANSPORT:
      default:
        return 'transit';
    }
  }

  getIcon(): string {
    return 'google';
  }

  getName(): string {
    return 'Google Maps';
  }
}
