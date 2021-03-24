import { Location } from './Location';
import { TransportMode } from '../route/TransportMode';

describe('Location', () => {
  const locationDataFull = {
    M: {
      name: { S: 'test' },
      coordinates: { S: '48.1559366,11.5243933' },
      strasse: { S: 'bar' },
      hausnr: { S: '42' },
      stadt: { S: 'foo' },
      plz: { S: '12345' },
      transport: { S: 'auto' },
    },
  };

  const createLocationFull = () => {
    return new Location(locationDataFull);
  };
  const createLocationMinimal = () => {
    return new Location({
      M: {
        name: { S: 'Test' },
      },
    });
  };

  describe('Constructor', () => {

    it('should create with minimal data', () => {
      const location = createLocationMinimal();
      expect(location).toBeDefined();
    });

    it('should create with full data', () => {
      const location = createLocationFull();
      expect(location).toBeDefined();
    });

  });

  describe('Getter', () => {

    describe('Coordinates', () => {
      it('should get coordinates with minimal data', () => {
        const location = createLocationMinimal();
        const coordinates = location.getCoordinates();

        expect(coordinates).toBeUndefined();
      });

      it('should get coordinates with full data', () => {
        const location = createLocationFull();
        const coordinates = location.getCoordinates();

        expect(coordinates).toEqual(locationDataFull.M.coordinates.S);
      });
    });

    describe('Name', () => {
      it('should get name with minimal data', () => {
        const location = createLocationMinimal();
        const name = location.getName();

        expect(name).toBeDefined();
        expect(name).toEqual('Test');
      });

      it('should get name with full data', () => {
        const location = createLocationMinimal();
        const name = location.getName();

        expect(name).toBeDefined();
        expect(name).toEqual('Test');
      });
    });

    describe('Street', () => {
      it('should get street with minimal data', () => {
        const location = createLocationMinimal();
        const street = location.getStreet();

        expect(street).toBeUndefined();
      });

      it('should get street with full data', () => {
        const location = createLocationFull();
        const street = location.getStreet();

        expect(street).toEqual('Bar 42');
      });
    });

    describe('City', () => {
      it('should get city with minimal data', () => {
        const location = createLocationMinimal();
        const city = location.getCity();

        expect(city).toBeUndefined();
      });

      it('should get city with full data', () => {
        const location = createLocationFull();
        const city = location.getCity();

        expect(city).toEqual('12345 Foo');
      });
    });

    describe('TransportMode', () => {
      it('should get transportMode with minimal data', () => {
        const location = createLocationMinimal();
        const transportMode = location.getPreferredTransportMode();

        expect(transportMode).toBeUndefined();
      });

      it('should get transportMode with full data', () => {
        const location = createLocationFull();
        const transportMode = location.getPreferredTransportMode();

        expect(transportMode).toEqual(TransportMode.CAR);
      });
    });

    describe('TransportModeReadable', () => {
      it('should get readable TransportMode with minimal data', () => {
        const location = createLocationMinimal();
        const transportMode = location.getPreferredTransportModeReadable();

        expect(transportMode).toEqual('Keines');
      });

      it('should get readable TransportMode with full data', () => {
        const location = createLocationFull();
        const transportMode = location.getPreferredTransportModeReadable();

        expect(transportMode).toEqual('Auto');
      });
    });
  });

});
