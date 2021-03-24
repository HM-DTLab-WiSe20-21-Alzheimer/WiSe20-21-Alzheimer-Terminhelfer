export default {
  service: {
    Platform: jest.fn(() => ({
      createDefaultLayers: jest.fn(() => ({
        vector: {
          normal: {
            map: undefined,
          },
        },
      })),
      getRoutingService: jest.fn(() => ({
        calculateRoute: jest.fn((p, res, rej) => {
          res({ routes: undefined });
        }),
      })),
      getPublicTransitService: jest.fn(() => ({
        getRoutes: jest.fn((p, res, rej) => {
          res({ routes: undefined });
        }),
      })),
    })),
  },
  map: {
    Polyline: jest.fn(() => ({
      getBoundingBox: jest.fn(),
    })),
    Marker: jest.fn(),
  },
  Map: jest.fn(() => ({
    addObjects: jest.fn(),
    getViewModel: jest.fn(() => ({
      setLookAtData: jest.fn(),
    })),
    getViewPort: jest.fn(() => ({
      resize: jest.fn(),
    })),
  })),
  ui: {
    UI: {
      createDefault: jest.fn(),
    },
  },
  geo: {
    LineString: {
      fromFlexiblePolyline: jest.fn(),
    },
  },
};
