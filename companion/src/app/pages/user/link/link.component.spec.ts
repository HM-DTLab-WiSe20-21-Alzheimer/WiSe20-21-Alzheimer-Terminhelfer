import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkComponent } from './link.component';
import { Router } from '@angular/router';
import { CognitoAuthenticationService } from '../../../services/authentication/cognito-authentication.service';
import { Observable, Subject } from 'rxjs';
import { IconComponent } from '../../../components/icon/icon.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('LinkComponent', () => {

  let routerStub: Router;
  let authServiceStub: CognitoAuthenticationService;
  let authServiceResolve: () => void;

  let component: LinkComponent;
  let fixture: ComponentFixture<LinkComponent>;

  beforeEach(() => {
    authServiceStub = {
      getError: jest.fn(() => new Subject()),
      link: jest.fn(() => new Promise(resolve => authServiceResolve = resolve)),
    } as unknown as CognitoAuthenticationService;

    routerStub = {
      navigateByUrl: jest.fn(),
    } as unknown as Router;
  });

  beforeEach(async () => {
    await TestBed
      .configureTestingModule({
        declarations: [LinkComponent, IconComponent],
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
    fixture = TestBed.createComponent(LinkComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  describe('Constructor', () => {

    it('should create', () => {
      expect(component).toBeTruthy();
      expect(component.linkForm).toBeInstanceOf(FormGroup);
      expect(component.isLoading).toBeFalsy();
      expect(component.error$).toBeInstanceOf(Observable);
    });

    it('should have invalid form', () => {
      expect(component.linkForm.invalid).toBeTruthy();
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
          expect(errorMsg).toEqual('Beim Verbinden ist ein unbekannter Fehler aufgetreten');
          done();
        });
    });

    it('should pipe InvalidParameterException', async (done) => {
      const errorStub$ = new Observable<string>(subscriber => {
        subscriber.next('InvalidParameterException');
      });

      expect.assertions(1);

      component.pipeError(errorStub$)
        .subscribe(errorMsg => {
          expect(errorMsg).toEqual('Der Verbindungscode ist nicht 7 Zeichen lang');
          done();
        });
    });

  });

  describe('form validation', () => {

    describe('linkId', () => {

      it('should be required', () => {
        const linkIdInput = component.linkForm.get('linkId');
        const error = linkIdInput?.errors?.required;

        expect(error).toBeTruthy();
      });

      it('should have more than 6 characters', () => {
        const linkIdInput = component.linkForm.get('linkId');
        linkIdInput?.setValue('1A2B3C');
        const error = linkIdInput?.errors?.minlength;

        expect(error).toBeTruthy();
      });

      it('should have less than 8 characters', () => {
        const linkIdInput = component.linkForm.get('linkId');
        linkIdInput?.setValue('1A2B3C4D');
        const error = linkIdInput?.errors?.maxlength;

        expect(error).toBeTruthy();
      });

      it('should accept 7 characters', () => {
        const linkIdInput = component.linkForm.get('linkId');
        linkIdInput?.setValue('1A2B3C4');
        const error = linkIdInput?.invalid;

        expect(error).toBeFalsy();
      });

    });

  });

  describe('link', () => {

    let event: Event;
    beforeEach(() => {
      event = {
        preventDefault: jest.fn(),
      } as unknown as Event;
    });

    it('should call preventDefault', () => {
      component.link(event);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should not link if invalid form', () => {
      expect(component.link(event)).toBeFalsy();
    });

    it('should link', async (done) => {
      expect.assertions(6);

      const formValues = {
        linkId: '1A2B3C4',
      };

      component.linkForm.setValue(formValues);

      const linkPromise = component.link(event);

      expect(component.isLoading).toBeTruthy();

      linkPromise.then(() => {
        expect(component.isLoading).toBeFalsy();
        expect(authServiceStub.link).toHaveBeenCalled();
        expect(authServiceStub.link).toHaveBeenCalledWith(
          formValues.linkId,
        );
        expect(routerStub.navigateByUrl).toHaveBeenCalled();
        expect(routerStub.navigateByUrl).toHaveBeenCalledWith('/app');
        done();
      });

      authServiceResolve();
    });

  });

});
