import { HereRoute } from './HereRoute';
import H from '../../../H';

jest.mock('../../../H');

describe('HereRoute', () => {

  let routeData: any;
  let route: HereRoute;

  const getSectionData = (duration: number) => ({
    summary: {
      duration,
    },
    polyline: '1234',
    departure: {
      place: {
        location: '1234',
      },
    },
    arrival: {
      place: {
        location: '1234',
      },
    },
  });


  beforeEach(() => {
    routeData = [{
      sections: [
        getSectionData(42),
        getSectionData(10),
      ],
    }];

    route = new HereRoute(routeData, new H.service.Platform({} as H.service.Platform.Options));
  });


  describe('Constructor', () => {
    it('should create route', () => {

      expect(route).toBeDefined();
    });
  });

  describe('Getter', () => {
    it('should get correct duration', () => {
      expect(route.getDuration()).toEqual(52);
    });
  });

  describe('Map', () => {
    it('should draw mao', () => {
      const mapEl = document.createElement('div');
      route.drawMap(mapEl);

      expect(H.Map).toBeCalledTimes(1);
      expect(H.ui.UI.createDefault).toBeCalledTimes(1);
      expect(H.geo.LineString.fromFlexiblePolyline).toBeCalledTimes(routeData[0].sections.length);
      expect(H.map.Polyline).toBeCalledTimes(routeData[0].sections.length);
      expect(H.map.Marker).toBeCalledTimes(routeData[0].sections.length * 2);
    });
  });
});
