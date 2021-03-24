import { AlexaAppointment } from './AlexaAppointment';
import * as dayjs from 'dayjs';
import { TransportMode } from '../route/TransportMode';
import { Location } from '../location/Location';

describe('AlexaAppointment', () => {

  let appointment: AlexaAppointment;
  const appointmentData = {
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
      transport: { S: 'auto' },
    },
  };

  beforeEach(() => {
    appointment = new AlexaAppointment(appointmentData);
  });

  describe('Constructor', () => {
    it('should create', () => {
      expect(appointment).toBeDefined();
    });
  });

  describe('Getter', () => {

    it('should get dateTime', () => {
      const dateTime = appointment.getDateTime();
      expect(dateTime).toEqual(expect.any(dayjs));
      expect(dateTime.format()).toEqual(appointmentData.M.dateTime.S);
    });

    it('should get location', () => {
      const location = appointment.getLocation();
      expect(location).toBeDefined();
      expect(location).toEqual(appointmentData.M.location.M.name.S);
    });

    it('should get name', () => {
      const name = appointment.getName();
      expect(name).toEqual(appointmentData.M.title.S);
    });

    it('should get transportmode', () => {
      const name = appointment.getTransportMode();
      expect(name).toEqual(TransportMode.CAR);
    });

    it('should get destination', () => {
      const destination = appointment.getDestination();
      expect(destination).toEqual(expect.any(Location));
    });

    it('should get id', () => {
      const id = appointment.getId();
      expect(id).toEqual(appointmentData.M.id.S);
    });

    it('should get canCalculateRoute', () => {
      const canCalculateRoute = appointment.canCalculateRoute();
      expect(canCalculateRoute).toBeTruthy();
    });

  });
});
