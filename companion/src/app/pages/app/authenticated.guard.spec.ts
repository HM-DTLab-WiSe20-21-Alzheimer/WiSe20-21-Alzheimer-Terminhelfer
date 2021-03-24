import { AuthenticatedGuard } from './authenticated.guard';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { CognitoAuthenticationService } from '../../services/authentication/cognito-authentication.service';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../models/User';

describe('AuthenticatedGuard', () => {

  let routerStub: Partial<Router>;
  let authServiceStub: Partial<CognitoAuthenticationService>;
  let userLinked = true;
  let guard: AuthenticatedGuard;

  beforeEach(() => {
    routerStub = {
      parseUrl: jest.fn(),
    };

    authServiceStub = {
      pageCheck: () => Promise.resolve(true),
      getUser: () => new BehaviorSubject<User | null>({
        isLinked: () => userLinked,
      } as User),
    };

    guard = new AuthenticatedGuard(
      authServiceStub as CognitoAuthenticationService,
      routerStub as Router,
    );
  });

  describe('Constructor', () => {
    it('should create', () => {
      expect(guard).toBeDefined();
    });
  });

  describe('canActivate', () => {

    describe('loggedIn', () => {
      describe('linked', () => {
        it('should activate', async (done) => {
          const can = await guard.canActivate(
            {} as ActivatedRouteSnapshot,
            {} as RouterStateSnapshot,
          );

          expect(can).toBeTruthy();
          done();
        });
      });

      describe('not linked', () => {
        beforeEach(() => {
          userLinked = false;
        });

        it('should redirect', async (done) => {
          const can = await guard.canActivate(
            {} as ActivatedRouteSnapshot,
            {} as RouterStateSnapshot,
          );

          expect(can).not.toBeInstanceOf(Boolean);
          expect(routerStub.parseUrl).toHaveBeenCalled();
          expect(routerStub.parseUrl).toHaveBeenCalledWith('/user/link');
          done();
        });
      });
    });

    describe('not loggedIn', () => {
      beforeEach(() => {
        authServiceStub.pageCheck = () => Promise.resolve(false);
      });

      describe('not linked', () => {
        beforeEach(() => {
          userLinked = false;
        });

        it('should redirect', async (done) => {
          const can = await guard.canActivate(
            {} as ActivatedRouteSnapshot,
            {} as RouterStateSnapshot,
          );

          expect(can).not.toBeInstanceOf(Boolean);
          expect(routerStub.parseUrl).toHaveBeenCalled();
          expect(routerStub.parseUrl).toHaveBeenCalledWith('/user/login');
          done();
        });
      });

      describe('linked', () => {
        it('should redirect', async (done) => {
          const can = await guard.canActivate(
            {} as ActivatedRouteSnapshot,
            {} as RouterStateSnapshot,
          );

          expect(can).not.toBeInstanceOf(Boolean);
          expect(routerStub.parseUrl).toHaveBeenCalled();
          expect(routerStub.parseUrl).toHaveBeenCalledWith('/user/login');
          done();
        });
      });
    });


  });
});
