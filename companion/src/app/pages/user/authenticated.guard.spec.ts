import { AuthenticatedGuard } from './authenticated.guard';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { CognitoAuthenticationService } from '../../services/authentication/cognito-authentication.service';

describe('AuthenticatedGuard', () => {

  let routerStub: Partial<Router>;
  let authServiceStub: Partial<CognitoAuthenticationService>;
  let guard: AuthenticatedGuard;

  beforeEach(() => {
    routerStub = {
      parseUrl: jest.fn(),
    };

    authServiceStub = {
      pageCheck: () => Promise.resolve(true),
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
      it('should activate if user is logged in', async (done) => {
        const can = await guard.canActivate(
          {} as ActivatedRouteSnapshot,
          {} as RouterStateSnapshot,
        );

        expect(can).toBeTruthy();
        done();
      });
    });

    describe('not loggedIn', () => {
      beforeEach(() => {
        authServiceStub.pageCheck = () => Promise.resolve(false);
      });

      it('should redirect if user not logged in', async (done) => {
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
