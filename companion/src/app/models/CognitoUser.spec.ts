import { CognitoUser } from './CognitoUser';

describe('CognitoUser', () => {

  const payloadMinimal = {
    username: 'maxmuster',
    attributes: {
      name: 'Max Mustermann',
    },
  };

  const payloadFull = {
    username: 'maxmuster',
    attributes: {
      name: 'Max Mustermann',
      'custom:linkid': '12345',
    },
  };

  describe('Constructor', () => {

    it('should return null if no data is given', () => {
      const payload = null;
      const user = CognitoUser.fromResult(payload);
      expect(user).toBeNull();
    });

    it('should return user if minimal data is given', () => {
      const user = CognitoUser.fromResult(payloadMinimal);
      expect(user).not.toBeNull();
    });

    it('should return user if full data is given', () => {
      const user = CognitoUser.fromResult(payloadFull);
      expect(user).not.toBeNull();
    });

  });

  describe('Getter', () => {

    it('should get username', () => {
      const user = CognitoUser.fromResult(payloadMinimal);
      const username = user?.getUsername();
      expect(username).toBeDefined();
      expect(username).toEqual(payloadMinimal.username);
    });

    it('should get name', () => {
      const user = CognitoUser.fromResult(payloadMinimal);
      const name = user?.getName();
      expect(name).toBeDefined();
      expect(name).toEqual(payloadMinimal.attributes.name);
    });

    it('should get isLinked from minimal', () => {
      const user = CognitoUser.fromResult(payloadMinimal);
      const isLinked = user?.isLinked();
      expect(isLinked).toBeDefined();
      expect(isLinked).toBeFalsy();
    });

    it('should get isLinked from full', () => {
      const user = CognitoUser.fromResult(payloadFull);
      const isLinked = user?.isLinked();
      expect(isLinked).toBeDefined();
      expect(isLinked).toBeTruthy();
    });

  });

});
