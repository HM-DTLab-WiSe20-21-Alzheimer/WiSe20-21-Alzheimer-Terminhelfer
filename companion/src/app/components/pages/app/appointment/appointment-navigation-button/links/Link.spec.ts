import { Link } from './Link';
import { AlexaAppointment } from '../../../../../../models/appointment/AlexaAppointment';
import * as dayjs from 'dayjs';

const getAppointment = (transportMode: string) => new AlexaAppointment({
  M: {
    dateTime: { S: dayjs().format() },
    location: {
      M: {
        name: { S: 'TestLoc' },
        coordinates: { S: '48.1559366,11.5243933' },
      },
    },
    title: { S: 'test' },
    id: { S: '123456789' },
    transport: { S: transportMode },
  },
});

const getLocation = (): Partial<Position> => ({
  coords: {
    latitude: 123,
    longitude: 456,
  } as any,
});

export const generateTest = (
  name: string,
  icon: string,
  linkConstructor: new () => Link,
  carLink: (origin: string, destination: string) => string,
  bicycleLink: (origin: string, destination: string) => string,
  ptLink: (origin: string, destination: string) => string,
  walkLink: (origin: string, destination: string) => string,
) => {
  let link: Link;

  beforeEach(() => {
    link = new linkConstructor();
  });

  describe('getIcon', () => {
    it('should get icon', () => {
      expect(link.getIcon()).toEqual(icon);
    });
  });

  describe('getName', () => {
    it('should get name', () => {
      expect(link.getName()).toEqual(name);
    });
  });

  describe('get', () => {
    it('should generate link for car', () => {
      const position = getLocation() as Position;
      const appointment = getAppointment('auto');

      const url = link.get(appointment, position);
      const origin = `${position.coords.latitude},${position.coords.longitude}`;
      const destination = appointment.getDestination().getCoordinates() as string;
      expect(url).toEqual(carLink(origin, destination));
    });

    it('should generate link for bicycle', () => {
      const position = getLocation() as Position;
      const appointment = getAppointment('fahrrad');

      const url = link.get(appointment, position);
      const origin = `${position.coords.latitude},${position.coords.longitude}`;
      const destination = appointment.getDestination().getCoordinates() as string;
      expect(url).toEqual(bicycleLink(origin, destination));
    });

    it('should generate link for public transport', () => {
      const position = getLocation() as Position;
      const appointment = getAppointment('oeffentliche verkehrsmittel');

      const url = link.get(appointment, position);
      const origin = `${position.coords.latitude},${position.coords.longitude}`;
      const destination = appointment.getDestination().getCoordinates() as string;
      expect(url).toEqual(ptLink(origin, destination));
    });

    it('should generate link for walk', () => {
      const position = getLocation() as Position;
      const appointment = getAppointment('zu fuss');

      const url = link.get(appointment, position);
      const origin = `${position.coords.latitude},${position.coords.longitude}`;
      const destination = appointment.getDestination().getCoordinates() as string;
      expect(url).toEqual(walkLink(origin, destination));
    });
  });

};

describe('AlibiTest', () => {
  it('should have an alibi test', () => {

  });
});
