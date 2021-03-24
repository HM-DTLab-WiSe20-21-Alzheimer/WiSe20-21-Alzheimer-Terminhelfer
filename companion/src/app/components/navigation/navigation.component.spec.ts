import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';

import { NavigationComponent } from './navigation.component';
import { Event, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { CognitoAuthenticationService } from '../../services/authentication/cognito-authentication.service';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { IconComponent } from '../icon/icon.component';
import { By } from '@angular/platform-browser';

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;
  let router: Partial<Router>;
  let authService: Partial<CognitoAuthenticationService>;
  let authServiceLoginState: BehaviorSubject<boolean>;

  beforeEach(async () => {
    router = {
      events: new Subject<Event>() as Observable<Event>,
    };

    authServiceLoginState = new BehaviorSubject<boolean>(true);

    authService = {
      isLoggedIn: jest.fn(() => authServiceLoginState),
    };

    await TestBed
      .configureTestingModule({
        declarations: [NavigationComponent, IconComponent],
        providers: [
          { provide: CognitoAuthenticationService, useValue: authService },
          { provide: Router, useValue: router },
        ],
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Logic', () => {
    describe('ngOnInit', () => {

      it('should set isOpen to default value of false', () => {
        expect(component.isOpen).toBeFalsy();
      });

      it('should set isLoggedIn to Observable', () => {
        expect(authService.isLoggedIn).toBeCalledTimes(1);
        expect(component.isLoggedIn).toBeDefined();
        expect(component.isLoggedIn).toEqual(expect.any(Observable));
      });

      describe('listen to navigation events', () => {

        it('should listen to NavigationEnd event if open', () => {
          component.isOpen = true;

          (router.events as Subject<Event>).next(new NavigationEnd(1, '', ''));
          fixture.detectChanges();

          expect(component.isOpen).toBeFalsy();
        });

        it('should not listen to other event if open', () => {
          component.isOpen = true;

          (router.events as Subject<Event>).next(new NavigationStart(1, ''));


          expect(component.isOpen).toBeTruthy();
        });

        it('should do nothing if close', () => {
          component.isOpen = false;

          (router.events as Subject<Event>).next(new NavigationEnd(1, '', ''));
          (router.events as Subject<Event>).next(new NavigationStart(1, ''));

          expect(component.isOpen).toBeFalsy();
        });

      });

    });

    describe('toggle', () => {

      it('should toggle once', () => {
        component.toggle();

        expect(component.isOpen).toBeTruthy();
      });

      it('should toggle twice', () => {
        component.toggle();
        component.toggle();

        expect(component.isOpen).toBeFalsy();
      });

    });
  });

  describe('Component Render', () => {

    describe('Mobile Navigation', () => {

      it('should not show navigation with closed state', () => {
        const elementDe = fixture.debugElement.query(By.css('[data-test="mobile-nav"]'));
        const elementN = elementDe.nativeElement;

        expect(elementN).toBeDefined();
        expect(elementN.classList.contains('is-active')).toBeFalsy();
      });

      it('should show bars icon with closed state', () => {
        const elementDe = fixture.debugElement.query(By.css('[data-test="mobile-nav-button"] .uil'));
        const elementN = elementDe.nativeElement;

        expect(elementN).toBeDefined();
        expect(elementN.classList.contains('uil-bars')).toBeTruthy();
      });

      it('should show navigation with open state', () => {
        component.isOpen = true;
        fixture.detectChanges();

        const elementDe = fixture.debugElement.query(By.css('[data-test="mobile-nav"]'));
        const elementN = elementDe.nativeElement;

        expect(elementN).toBeDefined();
        expect(elementN.classList.contains('is-active')).toBeTruthy();
      });

      it('should show close icon with open state', () => {
        component.isOpen = true;
        fixture.detectChanges();

        const elementDe = fixture.debugElement.query(By.css('[data-test="mobile-nav-button"] .uil'));
        const elementN = elementDe.nativeElement;

        expect(elementN).toBeDefined();
        expect(elementN.classList.contains('uil-times')).toBeTruthy();
      });

    });

    describe('User buttons', () => {

      it('should show only signout button if user logged in', () => {
        const signOutElDe = fixture.debugElement.query(By.css('[data-test="user-logout-button"]'));
        const signUpElDe = fixture.debugElement.query(By.css('[data-test="user-signup-button"]'));
        const loginElDe = fixture.debugElement.query(By.css('[data-test="user-login-button"]'));

        expect(signOutElDe).toBeDefined();
        expect(signUpElDe).toBeNull();
        expect(loginElDe).toBeNull();
      });

      it('should  show singin and login button if user not logged in', fakeAsync(() => {

        authServiceLoginState.next(false);
        flush();
        fixture.detectChanges();

        const signOutElDe = fixture.debugElement.query(By.css('[data-test="user-logout-button"]'));
        const signUpElDe = fixture.debugElement.query(By.css('[data-test="user-signup-button"]'));
        const loginElDe = fixture.debugElement.query(By.css('[data-test="user-login-button"]'));

        expect(signOutElDe).toBeNull();
        expect(signUpElDe).toBeDefined();
        expect(loginElDe).toBeDefined();
      }));

    });

  });

});
