import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { Router } from '@angular/router';
import { CognitoAuthenticationService } from '../../../services/authentication/cognito-authentication.service';
import { Observable, Subject } from 'rxjs';
import { SignupComponent } from '../signup/signup.component';
import { IconComponent } from '../../../components/icon/icon.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('LoginComponent', () => {
  let routerStub: Router;
  let authServiceStub: CognitoAuthenticationService;
  let authServiceResolve: () => void;

  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(() => {
    authServiceStub = {
      getError: jest.fn(() => new Subject()),
      signIn: jest.fn(() => new Promise(resolve => authServiceResolve = resolve)),
    } as unknown as CognitoAuthenticationService;

    routerStub = {
      navigateByUrl: jest.fn(),
    } as unknown as Router;
  });

  beforeEach(async () => {
    await TestBed
      .configureTestingModule({
        declarations: [LoginComponent, IconComponent],
        imports: [
          ReactiveFormsModule,
          RouterTestingModule,
        ],
        providers: [
          { provide: CognitoAuthenticationService, useValue: authServiceStub },
          { provide: Router, useValue: routerStub },
        ],
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  describe('Constructor', () => {

    it('should create', () => {
      expect(component).toBeTruthy();
      expect(component.isLoading).toBeFalsy();
      expect(component.loginForm).toBeInstanceOf(FormGroup);
      expect(component.error$).toBeInstanceOf(Observable);
    });

    it('should have invalid form', () => {
      expect(component.loginForm.invalid).toBeTruthy();
    });

    it('should listen for errors', () => {
      expect(authServiceStub.getError).toHaveBeenCalled();
    });

  });

  describe('pipeError', () => {

    it('should pipe null error', async (done) => {
      const errorStub$ = new Observable<null>(subscriber => {
        subscriber.next(null);
      });

      expect.assertions(1);

      component.pipeError(errorStub$)
        .subscribe(errorMsg => {
          expect(errorMsg).toBeNull();
          done();
        });
    });

    it('should pipe error', async (done) => {
      const errorStub$ = new Observable<string>(subscriber => {
        subscriber.next('BLABLA');
      });

      expect.assertions(1);

      component.pipeError(errorStub$)
        .subscribe(errorMsg => {
          expect(errorMsg).toEqual('Beim Anmelden ist ein unbekannter Fehler aufgetreten');
          done();
        });
    });

    it('should pipe UserNotFoundException & NotAuthorizedException', async (done) => {
      const errorStub$ = new Observable<string>(subscriber => {
        subscriber.next('UserNotFoundException');
        subscriber.next('NotAuthorizedException');
        subscriber.complete();
      });

      expect.assertions(2);

      component.pipeError(errorStub$)
        .subscribe({
          next: errorMsg => {
            expect(errorMsg).toEqual('Nutzername oder Passwort ist falsch');
          },
          complete: () => {
            done();
          },
        });
    });

  });

  describe('listen for not confirmed', () => {

    it('should listen for UserNotConfirmedException', async (done) => {
      expect.assertions(1);

      const errorStub$ = new Observable<string>(subscriber => {
        subscriber.next('UserNotConfirmedException');
        subscriber.complete();
      });

      component.listenForNotConfirmed(errorStub$);

      errorStub$.subscribe({
        complete: () => {
          expect(routerStub.navigateByUrl).toHaveBeenCalled();
          done();
        },
      });

    });

    it('should listen for any other', async (done) => {
      expect.assertions(1);

      const errorStub$ = new Observable<string>(subscriber => {
        subscriber.next('bla');
        subscriber.next('NotAuthorizedException');
        subscriber.next('UserNotFoundException');
        subscriber.complete();
      });

      component.listenForNotConfirmed(errorStub$);

      errorStub$.subscribe({
        complete: () => {
          expect(routerStub.navigateByUrl).not.toHaveBeenCalled();
          done();
        },
      });

    });

  });

  describe('form validation', () => {

    describe('username', () => {
      it('should be required', () => {
        const usernameInput = component.loginForm.get('username');
        const error = usernameInput?.errors?.required;

        expect(error).toBeTruthy();
      });
    });

    describe('password', () => {
      it('should be required', () => {
        const passwordInput = component.loginForm.get('password');
        const error = passwordInput?.errors?.required;

        expect(error).toBeTruthy();
      });
    });

  });

  describe('login', () => {

    let event: Event;
    beforeEach(() => {
      event = {
        preventDefault: jest.fn(),
      } as unknown as Event;
    });

    it('should call preventDefault', () => {
      component.login(event);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should not login if invalid form', () => {
      expect(component.login(event)).toBeFalsy();
    });

    it('should link', async (done) => {
      expect.assertions(6);

      const formValues = {
        username: 'maxmuster',
        password: '123456',
      };

      component.loginForm.setValue(formValues);

      const linkPromise = component.login(event);

      expect(component.isLoading).toBeTruthy();

      linkPromise.then(() => {
        expect(component.isLoading).toBeFalsy();
        expect(authServiceStub.signIn).toHaveBeenCalled();
        expect(authServiceStub.signIn).toHaveBeenCalledWith(
          formValues.username,
          formValues.password,
        );
        expect(routerStub.navigateByUrl).toHaveBeenCalled();
        expect(routerStub.navigateByUrl).toHaveBeenCalledWith('/app');
        done();
      });

      authServiceResolve();
    });

  });

});
