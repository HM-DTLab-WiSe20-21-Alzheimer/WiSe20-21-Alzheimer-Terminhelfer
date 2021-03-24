import { HereMapService } from './here-map.service';
import { PositionService } from '../position/position.service';
import H from '../../../H';
import { AlexaAppointment } from '../../models/appointment/AlexaAppointment';
import * as dayjs from 'dayjs';
import { HereRoute } from '../../models/route/HereRoute';

jest.mock('../../../H');

describe('HereMapService', () => {
  let service: HereMapService;

  beforeEach(() => {
    const positionMock = {
      getCurrentPosition: () => Promise.resolve({
        coords: {
          latitude: '1234',
          longitude: '4321',
        },
      }),
    } as unknown;

    service = new HereMapService(positionMock as PositionService);
  });

  describe('Constructor', () => {

    it('should create', () => {
      expect(service).toBeDefined();
    });

  });

  describe('getRoute', () => {

    it('should get route', async (done) => {

      const appointment = new AlexaAppointment({
        M: {
          location: {
            M: {
              coordinates: { S: '48.1559366,11.5243933' },
              name: { S: 'test' },
            },
          },
          dateTime: { S: dayjs().format() },
          title: { S: 'test' },
          id: { S: '123456789' },
          transport: { S: 'auto' },
        },
      });

      const route = await service.getRoute(appointment);
      expect(route).toBeInstanceOf(HereRoute);
      done();
    });

    it('should get route for public transport', async (done) => {

      const appointment = new AlexaAppointment({
        M: {
          location: {
            M: {
              coordinates: { S: '48.1559366,11.5243933' },
              name: { S: 'test' },
            },
          },
          dateTime: { S: dayjs().format() },
          title: { S: 'test' },
          id: { S: '123456789' },
          transport: { S: 'oeffentliche verkehrsmittel' },
        },
      });

      const route = await service.getRoute(appointment);
      expect(route).toBeInstanceOf(HereRoute);
      done();
    });

    it('should get route for bicycle', async (done) => {

      const appointment = new AlexaAppointment({
        M: {
          location: {
            M: {
              coordinates: { S: '48.1559366,11.5243933' },
              name: { S: 'test' },
            },
          },
          dateTime: { S: dayjs().format() },
          title: { S: 'test' },
          id: { S: '123456789' },
          transport: { S: 'fahrrad' },
        },
      });

      const route = await service.getRoute(appointment);
      expect(route).toBeInstanceOf(HereRoute);
      done();
    });

    it('should get route for walk', async (done) => {

      const appointment = new AlexaAppointment({
        M: {
          location: {
            M: {
              coordinates: { S: '48.1559366,11.5243933' },
              name: { S: 'test' },
            },
          },
          dateTime: { S: dayjs().format() },
          title: { S: 'test' },
          id: { S: '123456789' },
          transport: { S: 'zu fuss' },
        },
      });

      const route = await service.getRoute(appointment);
      expect(route).toBeInstanceOf(HereRoute);
      done();
    });

  });

});
