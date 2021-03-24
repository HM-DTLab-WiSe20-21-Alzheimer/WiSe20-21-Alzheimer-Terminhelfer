import { LocationService } from './location.service';
import { API } from '@aws-amplify/api';
import { Location } from '../../models/location/Location';

jest.mock('@aws-amplify/api');

describe('LocationService', () => {
  let service: LocationService;

  beforeEach(() => {
    service = new LocationService();
  });

  describe('Constructor', () => {

    it('should be created', () => {
      expect(service).toBeDefined();
    });

  });

  describe('getAll', () => {

    it('should get all locations', async (done) => {
      const locations = await service.getAll();

      expect(locations).toBeInstanceOf(Array);
      expect(locations.length).toEqual(1);
      expect(locations[0]).toBeInstanceOf(Location);
      expect(API.get).toBeCalledTimes(1);
      expect(API.get).toBeCalledWith('location', '/location', expect.any(Object));
      done();
    });

  });

});
