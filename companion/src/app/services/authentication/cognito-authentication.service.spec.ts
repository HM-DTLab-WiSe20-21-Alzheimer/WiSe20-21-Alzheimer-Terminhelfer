import { CognitoAuthenticationService } from './cognito-authentication.service';
import { CognitoUser } from '../../models/CognitoUser';
import { Auth } from '@aws-amplify/auth';
import { AuthOptions } from '../../../__mocks__/@aws-amplify/auth';
import { User } from '../../models/User';

jest.mock('@aws-amplify/auth');

describe('AuthenticationService', () => {
  let service: CognitoAuthenticationService;

  beforeEach(() => {
    service = new CognitoAuthenticationService();
  });

  afterEach(() => {
    AuthOptions.restore();
  });

  describe('Constructor', () => {

    it('should be created', () => {
      expect(service).toBeDefined();
    });

    it('should create without user', () => {
      const user = service.getUser().getValue();
      expect(user).toBeNull();
    });

    it('should not be logged in', async (done) => {
      const user = service.isLoggedIn();
      user.subscribe(isLoggedIn => {
        expect(isLoggedIn).toBeFalsy();
        done();
      });
    });

  });

  describe('getUser', () => {

    it('should keep user', () => {
      const userSave = CognitoUser.fromResult({
        username: 'maxmuster',
        attributes: {
          name: 'Max Mustermann',
        },
      });

      service.getUser().next(userSave);
      const user = service.getUser().getValue();

      expect(user).toEqual(userSave);
    });

  });

  describe('isLoggedIn', () => {

    it('should be loggedIn with user', async (done) => {
      service.getUser().next(CognitoUser.fromResult({
        username: 'maxmuster',
        attributes: {
          name: 'Max Mustermann',
        },
      }));

      service.isLoggedIn().subscribe(isLoggedIn => {
        expect(isLoggedIn).toBeTruthy();
        done();
      });
    });

    it('should not be loggedIn without user', async (done) => {
      service.getUser().next(null);

      service.isLoggedIn().subscribe(isLoggedIn => {
        expect(isLoggedIn).toBeFalsy();
        done();
      });
    });

  });

  describe('pageCheck', () => {

    it('should resolve false if user not loggedIn', async (done) => {
      AuthOptions.loggedIn = false;

      service.getError().subscribe(error => {
        expect(error).toBeNull();
      });

      await expect(service.pageCheck()).resolves.toBeFalsy();
      expect(service.getUser().getValue()).toBeNull();
      done();
    });

    it('should resolve true if user already loggedIn', async (done) => {
      // Fake signIn
      await service.signIn('', '');

      service.getError().subscribe(error => {
        expect(error).toBeNull();
      });

      await expect(service.pageCheck()).resolves.toBeTruthy();
      expect(service.getUser().getValue()).not.toBeNull();
      done();
    });

    it('should resolve true if user in session', async (done) => {
      service.getError().subscribe(error => {
        expect(error).toBeNull();
      });

      await expect(service.pageCheck()).resolves.toBeTruthy();
      expect(service.getUser().getValue()).not.toBeNull();
      expect(Auth.currentUserInfo).toHaveBeenCalledTimes(1);
      done();
    });

    it('should reject if error', async (done) => {
      AuthOptions.error = true;

      service.getError().subscribe(error => {
        expect(error).toEqual(expect.any(String));
      });

      await expect(service.pageCheck()).rejects.toEqual(expect.objectContaining({
        message: expect.any(String),
      }));
      expect(Auth.currentUserInfo).toHaveBeenCalledTimes(1);

      done();
    });

  });

  describe('signIn', () => {

    it('should resolve with user', async (done) => {

      const username = 'test';

      service.getError().subscribe(error => {
        expect(error).toBeNull();
      });

      let lastUser: User | null;
      service.getUser().subscribe({
        next: user => {
          lastUser = user;
        },
        complete: () => {
          expect(lastUser?.getUsername()).not.toBeNull();
          expect(lastUser?.getUsername()).toEqual(username);
        },
      });

      await expect(service.signIn(username, username)).resolves.toEqual(expect.any(CognitoUser));
      expect(Auth.signIn).toHaveBeenCalledTimes(1);
      expect(Auth.signIn).toHaveBeenCalledWith(username, username);

      done();

    });

    it('should reject with error', async (done) => {
      AuthOptions.error = true;

      service.getUser().subscribe(user => {
        expect(user).toBeNull();
      });

      service.getError().subscribe(error => {
        expect(error).not.toBeNull();
      });

      await expect(service.signIn('user', 'user')).rejects.toEqual(expect.objectContaining({
        name: expect.any(String),
      }));
      expect(Auth.signIn).toHaveBeenCalledTimes(1);
      expect(Auth.signIn).toHaveBeenCalledWith('user', 'user');

      done();
    });

  });

  describe('signUp', () => {

    it('should signup user', async (done) => {
      const username = 'test';
      const attributes = { name: 'Test' };

      service.getUser().subscribe(user => {
        expect(user).toBeNull();
      });

      service.getError().subscribe(error => {
        expect(error).toBeNull();
      });

      await expect(service.signUp(username, username, attributes)).resolves.toEqual(expect.any(CognitoUser));
      expect(Auth.signUp).toHaveBeenCalledTimes(1);
      expect(Auth.signUp).toHaveBeenCalledWith({
        username,
        attributes,
        password: username,
      });

      done();
    });

    it('should reject with error', async (done) => {
      AuthOptions.error = true;

      const username = 'test';
      const attributes = { name: 'Test' };

      service.getError().subscribe(error => {
        expect(error).not.toBeNull();
        expect(error).toEqual(expect.objectContaining({
          message: expect.any(String),
        }));
      });

      await expect(service.signUp(username, username, attributes)).rejects.toEqual(expect.any(Object));
      expect(Auth.signUp).toHaveBeenCalledTimes(1);
      expect(Auth.signUp).toHaveBeenCalledWith({
        username,
        attributes,
        password: username,
      });

      done();
    });

  });

  describe('signOut', () => {

    it('should signout', async (done) => {
      // Fake login
      await service.signIn('', '');

      service.getError().subscribe(error => {
        expect(error).toBeNull();
      });

      let lastUser: User | null;
      service.getUser().subscribe({
        next: user => {
          lastUser = user;
        },
        complete: () => {
          expect(lastUser).toBeNull();
        },
      });

      await expect(service.signOut()).resolves.not.toThrow();
      expect(Auth.signOut).toHaveBeenCalledTimes(1);
      done();
    });

    it('should reject signout with error', async (done) => {
      // Fake login
      await service.signIn('', '');

      AuthOptions.error = true;

      service.getError().subscribe(error => {
        expect(error).not.toBeNull();
      });

      service.getUser().subscribe(user => {
        expect(user).not.toBeNull();
      });

      await expect(service.signOut()).rejects.toEqual(expect.any(Object));
      expect(Auth.signOut).toHaveBeenCalledTimes(1);

      done();
    });

  });

  describe('confirm', () => {

    it('should confirm user', async (done) => {
      const username = 'test';
      const code = '1234';

      service.getError().subscribe(error => {
        expect(error).toBeNull();
      });

      await expect(service.confirm(username, code)).resolves.not.toThrow();
      expect(Auth.confirmSignUp).toHaveBeenCalledTimes(1);
      expect(Auth.confirmSignUp).toHaveBeenCalledWith(username, code);
      done();
    });

    it('should reject if error', async (done) => {
      AuthOptions.error = true;

      const username = 'test';
      const code = '1234';

      service.getError().subscribe(error => {
        expect(error).not.toBeNull();
      });

      await expect(service.confirm(username, code)).rejects.toEqual(expect.any(Object));
      expect(Auth.confirmSignUp).toHaveBeenCalledTimes(1);
      expect(Auth.confirmSignUp).toHaveBeenCalledWith(username, code);
      done();
    });

  });

  describe('link', () => {

    it('should link user', async (done) => {
      const linkId = '12ab';

      let lastUser: User | null;
      service.getUser().subscribe({
        next: user => {
          lastUser = user;
        },
        complete: () => {
          expect(lastUser).not.toBeNull();
        },
      });

      service.getError().subscribe(error => {
        expect(error).toBeNull();
      });

      await expect(service.link(linkId)).resolves.toEqual(expect.any(CognitoUser));
      expect(Auth.updateUserAttributes).toHaveBeenCalledTimes(1);
      expect(Auth.updateUserAttributes).toHaveBeenCalledWith(expect.any(Object), {
        'custom:linkid': linkId.toUpperCase(),
      });

      done();
    });

    it('should reject user link on error', async (done) => {
      AuthOptions.error = true;

      const linkId = '12ab';

      service.getUser().subscribe(user => {
        expect(user).toBeNull();
      });

      service.getError().subscribe(error => {
        expect(error).not.toBeNull();
        expect(error).toEqual(expect.any(String));
      });

      await expect(service.link(linkId)).rejects.toEqual(expect.any(Object));

      done();
    });

  });

});
