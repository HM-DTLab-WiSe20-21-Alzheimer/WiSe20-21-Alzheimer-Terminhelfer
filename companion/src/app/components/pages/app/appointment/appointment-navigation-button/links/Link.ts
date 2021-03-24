import { Appointment } from '../../../../../../models/appointment/Appointment';

export interface Link {
  /**
   * Get url.
   */
  get(
    appointment: Appointment,
    position: Position,
  ): string;

  /**
   * Get name of service.
   */
  getName(): string;

  /**
   * Get icon for service.
   */
  getIcon(): string;
}
