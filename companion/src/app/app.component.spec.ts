import { AppComponent } from './app.component';
import { CognitoAuthenticationService } from './services/authentication/cognito-authentication.service';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { fakeAsync, flush } from '@angular/core/testing';

describe('AppComponent', () => {
  let authServiceStub: CognitoAuthenticationService;

  beforeEach(() => {
    authServiceStub = {
      pageCheck: jest.fn(),
    } as unknown as CognitoAuthenticationService;
  });

  describe('constructor', () => {
    it('should create', () => {
      const router = {
        events: new Observable(),
      } as Router;
      const component = new AppComponent(authServiceStub, router);
      expect(component).toBeDefined();
    });
  });

  describe('pageCheck', () => {
    it('should should perform pagecheck', fakeAsync(() => {
      const event = new NavigationStart(1, '/');
      const router = {
        events: new Observable(subscriber => {
          subscriber.next(event);
          subscriber.complete();
        }),
      } as Router;

      const component = new AppComponent(authServiceStub, router);

      flush();
      expect(authServiceStub.pageCheck).toHaveBeenCalled();
      expect(component.isLoading).toBeTruthy();
    }));
    it('should disable load after navigation', fakeAsync(() => {
      const event = new NavigationEnd(1, '/', '/');
      const router = {
        events: new Observable(subscriber => {
          subscriber.next(event);
          subscriber.complete();
        }),
      } as Router;

      const component = new AppComponent(authServiceStub, router);

      flush();
      expect(component.isLoading).toBeFalsy();
    }));
  });

});
