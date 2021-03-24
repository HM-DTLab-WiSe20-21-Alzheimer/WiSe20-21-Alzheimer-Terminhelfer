import { AppointmentService } from './appointment.service';
import { API } from '@aws-amplify/api';
import { AlexaAppointment } from '../../models/appointment/AlexaAppointment';
import * as dayjs from 'dayjs';

jest.mock('@aws-amplify/api');


describe('AppointmentService', () => {
  let service: AppointmentService;

  beforeEach(() => {
    service = new AppointmentService();
  });

  describe('Constructor', () => {

    it('should create', () => {
      expect(service).toBeDefined();
    });

  });

  describe('get', () => {

    it('should get appointment', async (done) => {
      const appointment = await service.get('1234');

      expect(appointment).toEqual(expect.any(AlexaAppointment));
      expect(API.get).toHaveBeenCalledTimes(1);

      done();
    });

  });

  describe('getNext', () => {

    it('should get appointment', async (done) => {
      const appointment = await service.getNext();

      expect(appointment).toEqual(expect.any(AlexaAppointment));
      expect(API.get).toHaveBeenCalledTimes(1);

      done();
    });

  });

  describe('getAllByDate', () => {

    it('should get appointment', async (done) => {
      const date = dayjs();

      const appointment = await service.getAllByDay(date);

      expect(appointment).toEqual(expect.any(Array));
      expect(appointment.length).toEqual(1);
      expect(appointment[0]).toEqual(expect.any(AlexaAppointment));

      expect(API.get).toHaveBeenCalledTimes(1);
      expect(API.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.objectContaining({
          queryStringParameters: {
            date: date.format(),
          },
        }),
      );

      done();
    });

  });

});
