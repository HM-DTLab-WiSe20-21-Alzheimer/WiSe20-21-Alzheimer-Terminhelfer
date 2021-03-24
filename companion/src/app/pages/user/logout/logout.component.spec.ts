import { LogoutComponent } from './logout.component';
import { CognitoAuthenticationService } from '../../../services/authentication/cognito-authentication.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

describe('LogoutComponent', () => {
  const authServiceStub = {
    signOut: jest.fn(() => Promise.resolve()),
  } as unknown as CognitoAuthenticationService;

  const routerStub = {
    navigateByUrl: jest.fn(() => Promise.resolve()),
  } as unknown as Router;

  const locationStub = {
    back: jest.fn(),
  } as unknown as Location;

  describe('Logic', () => {
    let component: LogoutComponent;

    beforeEach(() => {
      component = new LogoutComponent(
        authServiceStub,
        routerStub,
        locationStub,
      );
    });

    describe('Constructor', () => {
      it('should create', () => {
        expect(component).toBeDefined();
      });
    });

    describe('logout', () => {
      it('should logout', async (done) => {
        await component.logout();

        expect(authServiceStub.signOut).toHaveBeenCalled();
        expect(routerStub.navigateByUrl).toHaveBeenCalled();
        expect(routerStub.navigateByUrl).toHaveBeenCalledWith('/');
        done();
      });
    });

    describe('abort', () => {
      it('should abort', () => {
        component.abort();

        expect(locationStub.back).toHaveBeenCalled();
      });
    });

  });
});
