import { PositionService } from './position.service';

describe('PositionService', () => {
  let service: PositionService;

  beforeEach(() => {
    service = new PositionService();
  });

  const setupPermission = (state = 'granted') => {
    // @ts-ignore
    global.navigator.permissions = {
      query: jest.fn((query) => {
        if (query.name === 'geolocation') {
          return Promise.resolve({ state });
        }
        return Promise.resolve({ state: 'declined' });
      }),
    };
  };

  const setupGeolocation = (state = 'granted') => {
    setupPermission(state);

    // @ts-ignore
    global.navigator.geolocation = {
      getCurrentPosition: jest.fn((success, error) => {
        if (state === 'declined') {
          error('Not granted');
        } else {
          success({
            timestamp: 1234,
            coords: {},
          });
        }
      }),
    };
  };

  describe('Constructor', () => {

    it('should create', () => {
      expect(service).toBeDefined();
    });

  });

  describe('canBeAsked', () => {

    it('should resolve with false if geolocation not available', async (done) => {
      const hasPermission = await service.canBeAsked();
      expect(hasPermission).toBeFalsy();
      done();
    });

    it('should resolve with false if granted', async (done) => {
      setupGeolocation('granted');
      const hasPermission = await service.canBeAsked();
      expect(hasPermission).toBeFalsy();
      done();
    });

    it('should resolve with false if declined', async (done) => {
      setupGeolocation('declined');
      const hasPermission = await service.canBeAsked();
      expect(hasPermission).toBeFalsy();
      done();
    });

    it('should resolve with true if state is prompt', async (done) => {
      setupGeolocation('prompt');
      const hasPermission = await service.canBeAsked();
      expect(hasPermission).toBeTruthy();
      done();
    });

  });

  describe('hasPermission', () => {

    it('should resolve with false if declined', async (done) => {
      setupPermission('declined');
      const hasPermission = await service.hasPermission();
      expect(hasPermission).toBeFalsy();
      done();
    });

    it('should resolve with true if granted', async (done) => {
      setupPermission('granted');
      const hasPermission = await service.hasPermission();
      expect(hasPermission).toBeTruthy();
      done();
    });

  });

  describe('askForPermission', () => {

    it('should resolve with granted state', async (done) => {
      setupGeolocation('granted');
      await expect(service.askForPermission()).resolves.not.toThrow();
      done();
    });

    it('should resolve with prompt state', async (done) => {
      setupGeolocation('prompt');
      await expect(service.askForPermission()).resolves.not.toThrow();
      done();
    });

    it('should reject with declined state', async (done) => {
      setupGeolocation('declined');
      await expect(service.askForPermission()).rejects.toBeTruthy();
      done();
    });

  });

  describe('getCurrentPosition', () => {

    it('should resolve with granted state', async (done) => {
      setupGeolocation('granted');
      await expect(service.getCurrentPosition()).resolves.toEqual({
        timestamp: expect.any(Number),
        coords: expect.any(Object),
      });
      done();
    });

    it('should resolve with prompt state', async (done) => {
      setupGeolocation('prompt');
      await expect(service.getCurrentPosition()).resolves.toEqual({
        timestamp: expect.any(Number),
        coords: expect.any(Object),
      });
      done();
    });

    it('should reject with declined state', async (done) => {
      setupGeolocation('declined');
      await expect(service.getCurrentPosition()).rejects.toBeTruthy();
      done();
    });

  });

});
