import { Optional } from './Optional';

describe('Optional', () => {

  describe('constructor', () => {

    it('should create with string', () => {
      const optional = Optional.of('test');
      expect(optional).toBeDefined();
    });

    it('should create with number', () => {
      const optional = Optional.of(123);
      expect(optional).toBeDefined();
    });

    it('should create with object', () => {
      const optional = Optional.of({});
      expect(optional).toBeDefined();
    });

    it('should create with null', () => {
      const optional = Optional.of(null);
      expect(optional).toBeDefined();
    });

    it('should create with undefined', () => {
      const optional = Optional.of(undefined);
      expect(optional).toBeDefined();
    });

  });

  describe('get', () => {

    it('should get string', () => {
      const value = 'test';
      const optional = Optional.of(value);
      expect(optional.get()).toEqual(value);
    });

    it('should get number', () => {
      const value = 0;
      const optional = Optional.of(value);
      expect(optional.get()).toEqual(value);
    });

    it('should get object', () => {
      const value = { 1: 2 };
      const optional = Optional.of(value);
      expect(optional.get()).toEqual(value);
    });

    it('should get null', () => {
      const value = null;
      const optional = Optional.of(value);
      expect(optional.get()).toEqual(value);
    });

    it('should get undefined', () => {
      const value = undefined;
      const optional = Optional.of(value);
      expect(optional.get()).toEqual(value);
    });

  });

  describe('getOrThrow', () => {

    it('should get string', () => {
      const value = 'test';
      const optional = Optional.of(value);
      expect(optional.getOrThrow()).toEqual(value);
    });

    it('should get number', () => {
      const value = 0;
      const optional = Optional.of(value);
      expect(optional.getOrThrow()).toEqual(value);
    });

    it('should get object', () => {
      const value = {};
      const optional = Optional.of(value);
      expect(optional.getOrThrow()).toEqual(value);
    });

    it('should get false boolean', () => {
      const value = false;
      const optional = Optional.of(value);
      expect(optional.getOrThrow()).toEqual(value);
    });

    it('should not get null', () => {
      const optional = Optional.of(null);
      expect(() => optional.getOrThrow()).toThrow();
    });

    it('should not get undefined', () => {
      const optional = Optional.of(undefined);
      expect(() => optional.getOrThrow()).toThrow();
    });

  });

  describe('isEmpty', () => {

    it('should not be empty with string', () => {
      const optional = Optional.of('');
      expect(optional.isEmpty()).toBeFalsy();
    });

    it('should not be empty with number', () => {
      const optional = Optional.of(0);
      expect(optional.isEmpty()).toBeFalsy();
    });

    it('should not be empty with object', () => {
      const optional = Optional.of({});
      expect(optional.isEmpty()).toBeFalsy();
    });

    it('should not be empty with boolean false', () => {
      const optional = Optional.of(false);
      expect(optional.isEmpty()).toBeFalsy();
    });

    it('should be empty with null', () => {
      const optional = Optional.of(null);
      expect(optional.isEmpty()).toBeTruthy();
    });

    it('should be empty with undefined', () => {
      const optional = Optional.of(undefined);
      expect(optional.isEmpty()).toBeTruthy();
    });

  });
});
