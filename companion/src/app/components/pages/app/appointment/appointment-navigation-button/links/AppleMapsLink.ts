import { Link } from './Link';
import { TransportMode } from '../../../../../../models/route/TransportMode';
import { Appointment } from '../../../../../../models/appointment/Appointment';

export class AppleMapsLink implements Link {
  get(
    appointment: Appointment,
    position: Position
  ): string {
    const mode = this.getTransportMode(appointment.getTransportMode());
    const origin = `${position.coords.latitude},${position.coords.longitude}`;
    const destination = appointment.getDestination().getCoordinates();
    return `https://maps.apple.com/?saddr=${origin}&daddr=${destination}&dirflg=${mode}`;
  }

  /**
   * Get travel mode string.
   * @param mode Travel mode
   * @private
   */
  private getTransportMode(mode: TransportMode): string {
    switch (mode) {
      case TransportMode.CAR:
        return 'd';
      case TransportMode.BICYCLE:
      case TransportMode.WALK:
        return 'w';
      case TransportMode.PUBLIC_TRANSPORT:
      default:
        return 'r';
    }
  }

  getIcon(): string {
    return 'apple';
  }

  getName(): string {
    return 'Apple Maps';
  }
}
