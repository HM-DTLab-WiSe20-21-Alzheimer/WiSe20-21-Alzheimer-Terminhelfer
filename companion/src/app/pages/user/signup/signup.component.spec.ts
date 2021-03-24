import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupComponent } from './signup.component';
import { IconComponent } from '../../../components/icon/icon.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, Subject } from 'rxjs';
import { CognitoAuthenticationService } from '../../../services/authentication/cognito-authentication.service';
import { Router } from '@angular/router';

describe('SignupComponent', () => {

  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;

  let routerStub: Router;
  let authServiceStub: CognitoAuthenticationService;
  let authServiceResolve: () => void;

  beforeEach(() => {
    authServiceStub = {
      getError: jest.fn(() => new Subject()),
      signUp: jest.fn(() => new Promise(resolve => authServiceResolve = resolve)),
    } as unknown as CognitoAuthenticationService;

    routerStub = {
      navigateByUrl: jest.fn(),
    } as unknown as Router;
  });

  beforeEach(async () => {
    await TestBed
      .configureTestingModule({
        declarations: [SignupComponent, IconComponent],
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
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  describe('Constructor', () => {

    it('should construct', () => {
      expect(component).toBeTruthy();
      expect(component.isLoading).toBeFalsy();
      expect(component.error$).toBeInstanceOf(Observable);
      expect(component.signUpForm).toBeInstanceOf(FormGroup);
    });

    it('should have invalid form', () => {
      expect(component.signUpForm.invalid).toBeTruthy();
    });

    it('should listen to errors', () => {
      expect(authServiceStub.getError).toHaveBeenCalled();
    });

  });

  describe('pipeError', () => {

    it('should pipe unknown error', async (done) => {
      const errorStub$ = new Observable<string>(subscriber => {
        subscriber.next('bla');
      });

      expect.assertions(1);

      component.pipeError(errorStub$)
        .subscribe(errorMsg => {
          expect(errorMsg).toEqual('Beim Registrieren ist ein unbekannter Fehler aufgetreten');
          done();
        });
    });

    it('should not pipe null error', async (done) => {
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

  });

  describe('form validation', () => {

    describe('username', () => {

      it('should be required', () => {
        const usernameInput = component.signUpForm.get('username');
        const error = usernameInput?.errors?.required;

        expect(error).toBeTruthy();
      });

    });

    describe('email', () => {

      it('should be required', () => {
        const usernameInput = component.signUpForm.get('email');
        const error = usernameInput?.errors?.required;

        expect(error).toBeTruthy();
      });

      it('should be email', () => {
        const emaiInput = component.signUpForm.get('email');
        emaiInput?.setValue('lalalal');
        const error = emaiInput?.errors?.email;

        expect(error).toBeTruthy();
      });

    });

    describe('name', () => {

      it('should be required', () => {
        const nameInput = component.signUpForm.get('name');
        const error = nameInput?.errors?.required;

        expect(error).toBeTruthy();
      });

    });

    describe('password', () => {

      it('should be required', () => {
        const passwordInput = component.signUpForm.get('password');
        const error = passwordInput?.errors?.required;

        expect(error).toBeTruthy();
      });

      it('should have minlength', () => {
        const usernameInput = component.signUpForm.get('password');
        usernameInput?.setValue('aaaaaaa');
        const error = usernameInput?.errors?.minlength;

        expect(error).toBeTruthy();
      });

      it('should have minlength of 8', () => {
        const usernameInput = component.signUpForm.get('password');
        usernameInput?.setValue('aaaaaaaa');
        const error = usernameInput?.errors?.minlength;

        expect(error).toBeFalsy();
      });

    });

  });

  describe('signUp', () => {

    let event: Event;
    beforeEach(() => {
      event = {
        preventDefault: jest.fn(),
      } as unknown as Event;
    });

    it('should call prevent default', () => {
      component.signUp(event);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should not signUp if invalid form', () => {
      expect(component.signUp(event)).toBeFalsy();
    });

    it('should signUp', async (done) => {
      expect.assertions(6);

      const formValues = {
        username: 'maxmuster',
        password: 'superSecret1',
        email: 'maxmuster@example.com',
        name: 'Max Mustermann',
      };

      component.signUpForm.setValue(formValues);

      const signUpPromise = component.signUp(event);

      expect(component.isLoading).toBeTruthy();

      signUpPromise.then(() => {
        expect(component.isLoading).toBeFalsy();
        expect(authServiceStub.signUp).toHaveBeenCalled();
        expect(authServiceStub.signUp).toHaveBeenCalledWith(
          formValues.username,
          formValues.password,
          {
            email: formValues.email,
            name: formValues.name,
          },
        );
        expect(routerStub.navigateByUrl).toHaveBeenCalled();
        expect(routerStub.navigateByUrl).toHaveBeenCalledWith(`/user/confirm?username=${formValues.username}`);
        done();
      });

      authServiceResolve();
    });

  });

});
