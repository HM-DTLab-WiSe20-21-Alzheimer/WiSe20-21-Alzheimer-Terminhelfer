import { TransportMode } from '../../../../../../models/route/TransportMode';
import { Link } from './Link';
import { Appointment } from '../../../../../../models/appointment/Appointment';

export class HereWeGoLink implements Link {
  get(
    appointment: Appointment,
    position: Position
  ): string {
    const mode = this.getTransportMode(appointment.getTransportMode());
    const origin = `${position.coords.latitude},${position.coords.longitude}`;
    const destination = appointment.getDestination().getCoordinates();
    return `https://wego.here.com/directions/${mode}/${origin}/${destination}`;
  }

  /**
   * Get travel mode string.
   * @param mode Travel mode
   * @private
   */
  private getTransportMode(mode: TransportMode): string {
    switch (mode) {
      case TransportMode.CAR:
        return 'drive';
      case TransportMode.BICYCLE:
        return 'bicycle';
      case TransportMode.WALK:
        return 'walk';
      case TransportMode.PUBLIC_TRANSPORT:
      default:
        return 'publicTransport';
    }
  }

  getIcon(): string {
    return 'map';
  }

  getName(): string {
    return 'HereWeGo';
  }
}
