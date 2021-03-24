import { getModeByString, TransportMode } from './TransportMode';

describe('TransportMode', () => {
  it('should have car', () => {
    expect(TransportMode.CAR).toBeDefined();
  });

  it('should have bicycle', () => {
    expect(TransportMode.BICYCLE).toBeDefined();
  });

  it('should have walk', () => {
    expect(TransportMode.WALK).toBeDefined();
  });

  it('should have public transport', () => {
    expect(TransportMode.PUBLIC_TRANSPORT).toBeDefined();
  });


  describe('resolve', () => {
    it('should resolve car', () => {
      const value = getModeByString('auto');
      expect(value).toEqual(TransportMode.CAR);
    });

    it('should resolve bicycle', () => {
      const value = getModeByString('fahrrad');
      expect(value).toEqual(TransportMode.BICYCLE);
    });

    it('should resolve public transport', () => {
      const value = getModeByString('oeffentliche verkehrsmittel');
      expect(value).toEqual(TransportMode.PUBLIC_TRANSPORT);
    });

    it('should resolve public walk', () => {
      const value = getModeByString('zu fuss');
      expect(value).toEqual(TransportMode.WALK);
    });
  });
});
