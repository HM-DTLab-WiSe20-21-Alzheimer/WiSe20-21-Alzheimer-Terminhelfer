import * as dayjs from 'dayjs';
import { TransportMode } from '../route/TransportMode';
import { Location } from '../location/Location';

/**
 * Single Appointment.
 */
export interface Appointment {

  /**
   * Get id.
   */
  getId(): string;

  /**
   * Get name.
   */
  getName(): string;

  /**
   * Get date and time.
   */
  getDateTime(): dayjs.Dayjs;

  /**
   * Get location.
   * @deprecated Use getDestination instead.
   */
  getLocation(): string | undefined;

  /**
   * Get destination.
   */
  getDestination(): Location;

  /**
   * Get transport mode.
   */
  getTransportMode(): TransportMode;

  /**
   * Whether a route can be calculated.
   */
  canCalculateRoute(): boolean;
}
