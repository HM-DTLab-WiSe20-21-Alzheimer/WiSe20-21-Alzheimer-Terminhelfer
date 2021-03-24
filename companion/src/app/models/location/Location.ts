import { getModeByString, TransportMode } from '../route/TransportMode';

export class Location {

  private readonly coordinates: string | undefined;
  private readonly name: string;
  private readonly street: string | undefined;
  private readonly city: string | undefined;
  private readonly transport: TransportMode | undefined;

  constructor(locationData: any) {

    this.coordinates = locationData.M?.coordinates?.S;
    this.name = this.capitalize(locationData.M.name.S);
    const streetExists = locationData.M.strasse && locationData.M.hausnr;
    const cityExists = locationData.M.stadt && locationData.M.plz;
    this.street = streetExists ? `${this.capitalize(locationData.M.strasse.S)} ${locationData.M.hausnr.S}` : undefined;
    this.city = cityExists ? `${locationData.M.plz.S} ${this.capitalize(locationData.M.stadt.S)}` : undefined;
    this.transport = locationData.M.transport ? getModeByString(locationData.M.transport.S) : undefined;
  }

  private capitalize(input: string): string {
    return input.charAt(0).toUpperCase() + input.slice(1);
  }

  getCoordinates(): string | undefined {
    return this.coordinates;
  }

  getName(): string | undefined {
    return this.name;
  }

  getStreet(): string | undefined {
    return this.street;
  }

  getCity(): string | undefined {
    return this.city;
  }

  getPreferredTransportMode(): TransportMode | undefined {
    return this.transport;
  }

  getPreferredTransportModeReadable(): string {
    switch (this.transport) {
      case TransportMode.CAR:
        return 'Auto';
      case TransportMode.BICYCLE:
        return 'Fahrrad';
      case TransportMode.PUBLIC_TRANSPORT:
        return 'Öffentliche Verkehrsmittel';
      case TransportMode.WALK:
        return 'Zu Fuß';
      default:
        return 'Keines';
    }
  }
}
