import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmComponent } from './confirm.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CognitoAuthenticationService } from '../../../services/authentication/cognito-authentication.service';
import { Observable, Subject } from 'rxjs';
import { IconComponent } from '../../../components/icon/icon.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('ConfirmComponent', () => {

  let routerStub: Router;
  let routeStub: ActivatedRoute;
  let authServiceStub: CognitoAuthenticationService;
  let authServiceResolve: () => void;

  let component: ConfirmComponent;
  let fixture: ComponentFixture<ConfirmComponent>;

  beforeEach(() => {
    authServiceStub = {
      getError: jest.fn(() => new Subject()),
      confirm: jest.fn(() => new Promise(resolve => authServiceResolve = resolve)),
    } as unknown as CognitoAuthenticationService;

    routerStub = {
      navigateByUrl: jest.fn(),
    } as unknown as Router;

    routeStub = {
      snapshot: {
        queryParams: {},
      },
    } as unknown as ActivatedRoute;
  });

  beforeEach(async () => {
    await TestBed
      .configureTestingModule({
        declarations: [ConfirmComponent, IconComponent],
        imports: [
          ReactiveFormsModule,
          RouterTestingModule,
        ],
        providers: [
          { provide: CognitoAuthenticationService, useValue: authServiceStub },
          { provide: Router, useValue: routerStub },
          { provide: ActivatedRoute, useValue: routeStub },
        ],
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  describe('Constructor', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
      expect(component.isLoading).toBeFalsy();
      expect(component.error$).toBeInstanceOf(Observable);
      expect(component.confirmForm).toBeInstanceOf(FormGroup);
    });

    it('should have invalid form', () => {
      expect(component.confirmForm.invalid).toBeTruthy();
    });

    it('should listen to errors', () => {
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
          expect(errorMsg).toEqual('Beim Bestätigen ist ein unbekannter Fehler aufgetreten');
          done();
        });
    });

  });

  describe('form validation', () => {

    describe('username', () => {
      it('should be required', () => {
        const usernameInput = component.confirmForm.get('username');
        const error = usernameInput?.errors?.required;

        expect(error).toBeTruthy();
      });
    });

    describe('code', () => {
      it('should be required', () => {
        const usernameInput = component.confirmForm.get('code');
        const error = usernameInput?.errors?.required;

        expect(error).toBeTruthy();
      });
    });

  });

  describe('confirm', () => {

    let event: Event;
    beforeEach(() => {
      event = {
        preventDefault: jest.fn(),
      } as unknown as Event;
    });

    it('should call preventDefault', () => {
      component.confirm(event);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should not confirm if invalid form', () => {
      expect(component.confirm(event)).toBeFalsy();
    });

    it('should confirm', async (done) => {
      expect.assertions(6);

      const formValues = {
        username: 'maxmuster',
        code: '123456',
      };

      component.confirmForm.setValue(formValues);

      const confirmPromise = component.confirm(event);

      expect(component.isLoading).toBeTruthy();

      confirmPromise.then(() => {
        expect(component.isLoading).toBeFalsy();
        expect(authServiceStub.confirm).toHaveBeenCalled();
        expect(authServiceStub.confirm).toHaveBeenCalledWith(
          formValues.username,
          formValues.code,
        );
        expect(routerStub.navigateByUrl).toHaveBeenCalled();
        expect(routerStub.navigateByUrl).toHaveBeenCalledWith('/user/login');
        done();
      });

      authServiceResolve();
    });

  });


});
