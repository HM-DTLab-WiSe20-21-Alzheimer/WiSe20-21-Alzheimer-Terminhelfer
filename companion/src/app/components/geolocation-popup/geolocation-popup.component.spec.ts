import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeolocationPopupComponent } from './geolocation-popup.component';
import { PositionService } from '../../services/position/position.service';
import { LoaderComponent } from '../loader/loader.component';
import { By } from '@angular/platform-browser';

describe('GeolocationPopupComponent', () => {

  const getMinimalService = (resolveWith = true) => {
    const canBeAskedPromise = Promise.resolve(resolveWith);

    return {
      canBeAsked: () => canBeAskedPromise,
    } as PositionService;
  };

  const getService = (ask: Promise<void>) => {
    return {
      canBeAsked: () => Promise.resolve(true),
      askForPermission: jest.fn(() => ask),
    } as unknown as PositionService;
  };

  describe('Logic', () => {

    beforeAll(() => {
      Object.defineProperty(window, 'location', {
        writable: true,
        value: { reload: jest.fn() },
      });
    });

    describe('Constructor', () => {

      it('should create', () => {
        const component = new GeolocationPopupComponent(getMinimalService());

        expect(component).toBeDefined();
      });

      it('should have default state', () => {
        const component = new GeolocationPopupComponent(getMinimalService());

        expect(component.state).toEqual(component.states.ASK);
      });

      it('should set open when canBeAsk', async (done) => {
        const service = getMinimalService();
        const component = new GeolocationPopupComponent(service);

        await service.canBeAsked();
        expect(component.isOpen).toBeTruthy();
        done();
      });

      it('should set closed when not canBeAsk', async (done) => {
        const service = getMinimalService(false);
        const component = new GeolocationPopupComponent(service as PositionService);

        await service.canBeAsked();
        expect(component.isOpen).toBeFalsy();
        done();
      });

    });

    describe('close', () => {

      it('should close when open', async (done) => {
        const service = getMinimalService();
        const component = new GeolocationPopupComponent(service);

        await service.canBeAsked();
        component.close();

        expect(component.isOpen).toBeFalsy();
        done();
      });

      it('should close when closed', async (done) => {
        const service = getMinimalService(false);
        const component = new GeolocationPopupComponent(service);

        await service.canBeAsked();
        component.close();

        expect(component.isOpen).toBeFalsy();
        done();
      });

      it('should reload when closed', async (done) => {
        const service = getMinimalService();
        const component = new GeolocationPopupComponent(service);

        await service.canBeAsked();
        component.close(true);

        expect(window.location.reload).toHaveBeenCalled();
        done();
      });

      it('should not reload when closed by default', async (done) => {
        const service = getMinimalService();
        const component = new GeolocationPopupComponent(service);

        await service.canBeAsked();
        component.close();

        expect(window.location.reload).not.toHaveBeenCalled();
        done();
      });

    });

    describe('activate', () => {

      it('should set state to loading', async (done) => {
        const service = getService(new Promise(() => {
        }));
        const component = new GeolocationPopupComponent(service);

        component.activate();

        expect(component.state).toEqual(component.states.LOADING);
        done();
      });

      it('should set state to accepted', async (done) => {
        const service = getService(Promise.resolve());
        const component = new GeolocationPopupComponent(service);

        await component.activate();

        expect(component.state).toEqual(component.states.ACCEPTED);
        done();
      });

      it('should set state to denied', async (done) => {
        const service = getService(Promise.reject({
          code: 0,
          PERMISSION_DENIED: 0,
        }));
        const component = new GeolocationPopupComponent(service);

        await component.activate();
        expect(component.state).toEqual(component.states.DENIED);
        expect(window.location.reload).not.toHaveBeenCalled();
        done();
      });

      it('should reload on error', async (done) => {
        const service = getService(Promise.reject({
          code: 1,
          PERMISSION_DENIED: 0,
        }));
        const component = new GeolocationPopupComponent(service);

        await component.activate();
        expect(window.location.reload).toHaveBeenCalled();
        done();
      });

    });

  });

  describe('Render', () => {

    let component: GeolocationPopupComponent;
    let fixture: ComponentFixture<GeolocationPopupComponent>;
    let service: PositionService;

    beforeEach(async () => {
      service = getService(Promise.resolve());
      await TestBed
        .configureTestingModule({
          declarations: [GeolocationPopupComponent, LoaderComponent],
          providers: [
            { provide: PositionService, useValue: service },
          ],
        })
        .compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(GeolocationPopupComponent);
      component = fixture.componentInstance;

      fixture.detectChanges();
    });

    it('should create component', () => {
      expect(component).toBeTruthy();
    });

    it('should render open popup', () => {
      component.isOpen = true;
      fixture.detectChanges();
      const elDe = fixture.debugElement.query(By.css('[data-test="popup"]'));
      const elNe = elDe.nativeElement;

      expect(elNe.classList.contains('is-active')).toBeTruthy();
    });

    it('should not render closed popup', () => {
      component.isOpen = false;
      fixture.detectChanges();
      const elDe = fixture.debugElement.query(By.css('[data-test="popup"]'));
      const elNe = elDe.nativeElement;

      expect(elNe.classList.contains('is-active')).toBeFalsy();
    });

    it('should not render closed popup', () => {
      component.isOpen = false;
      fixture.detectChanges();
      const elDe = fixture.debugElement.query(By.css('[data-test="popup"]'));
      const elNe = elDe.nativeElement;

      expect(elNe.classList.contains('is-active')).toBeFalsy();
    });

    describe('render states', () => {

      it('should render loading state', () => {
        component.isOpen = true;
        component.state = component.states.LOADING;
        fixture.detectChanges();

        const elLoadingDe = fixture.debugElement.query(By.css('[data-test="popup-loading"]'));
        const elAskDe = fixture.debugElement.query(By.css('[data-test="popup-ask"]'));
        const elAcceptedDe = fixture.debugElement.query(By.css('[data-test="popup-accepted"]'));
        const elDeniedDe = fixture.debugElement.query(By.css('[data-test="popup-denied"]'));

        expect(elLoadingDe).not.toBeNull();
        expect(elAskDe).toBeNull();
        expect(elAcceptedDe).toBeNull();
        expect(elDeniedDe).toBeNull();
      });

      it('should render ask state', () => {
        component.isOpen = true;
        component.state = component.states.ASK;
        fixture.detectChanges();

        const elLoadingDe = fixture.debugElement.query(By.css('[data-test="popup-loading"]'));
        const elAskDe = fixture.debugElement.query(By.css('[data-test="popup-ask"]'));
        const elAcceptedDe = fixture.debugElement.query(By.css('[data-test="popup-accepted"]'));
        const elDeniedDe = fixture.debugElement.query(By.css('[data-test="popup-denied"]'));

        expect(elLoadingDe).toBeNull();
        expect(elAskDe).not.toBeNull();
        expect(elAcceptedDe).toBeNull();
        expect(elDeniedDe).toBeNull();
      });

      it('should render accepted state', () => {
        component.isOpen = true;
        component.state = component.states.ACCEPTED;
        fixture.detectChanges();

        const elLoadingDe = fixture.debugElement.query(By.css('[data-test="popup-loading"]'));
        const elAskDe = fixture.debugElement.query(By.css('[data-test="popup-ask"]'));
        const elAcceptedDe = fixture.debugElement.query(By.css('[data-test="popup-accepted"]'));
        const elDeniedDe = fixture.debugElement.query(By.css('[data-test="popup-denied"]'));

        expect(elLoadingDe).toBeNull();
        expect(elAskDe).toBeNull();
        expect(elAcceptedDe).not.toBeNull();
        expect(elDeniedDe).toBeNull();
      });

      it('should render denied state', () => {
        component.isOpen = true;
        component.state = component.states.DENIED;
        fixture.detectChanges();

        const elLoadingDe = fixture.debugElement.query(By.css('[data-test="popup-loading"]'));
        const elAskDe = fixture.debugElement.query(By.css('[data-test="popup-ask"]'));
        const elAcceptedDe = fixture.debugElement.query(By.css('[data-test="popup-accepted"]'));
        const elDeniedDe = fixture.debugElement.query(By.css('[data-test="popup-denied"]'));

        expect(elLoadingDe).toBeNull();
        expect(elAskDe).toBeNull();
        expect(elAcceptedDe).toBeNull();
        expect(elDeniedDe).not.toBeNull();
      });

    });

    describe('react to button clicks', () => {

      describe('ask popup', () => {

        it('should ask for permission', () => {
          const activate = jest.spyOn(component, 'activate');
          component.isOpen = true;
          component.state = component.states.ASK;
          fixture.detectChanges();
          const elDe = fixture.debugElement.query(By.css('[data-test="popup-ask-action"]'));
          const elNe = elDe.nativeElement;

          elNe.click();

          expect(activate).toHaveBeenCalled();
        });

        it('should close', () => {
          const close = jest.spyOn(component, 'close');
          component.isOpen = true;
          component.state = component.states.ASK;
          fixture.detectChanges();
          const elDe = fixture.debugElement.query(By.css('[data-test="popup-ask-close"]'));
          const elNe = elDe.nativeElement;

          elNe.click();

          expect(close).toHaveBeenCalled();
          expect(close).toHaveBeenCalledWith();
        });

      });

      describe('accepted popup', () => {

        it('should close', () => {
          const close = jest.spyOn(component, 'close');
          component.isOpen = true;
          component.state = component.states.ACCEPTED;
          fixture.detectChanges();
          const elDe = fixture.debugElement.query(By.css('[data-test="popup-accepted-close"]'));
          const elNe = elDe.nativeElement;

          elNe.click();

          expect(close).toHaveBeenCalled();
          expect(close).toHaveBeenCalledWith(true);
        });

      });

      describe('accepted popup', () => {

        it('should close', () => {
          const close = jest.spyOn(component, 'close');
          component.isOpen = true;
          component.state = component.states.DENIED;
          fixture.detectChanges();
          const elDe = fixture.debugElement.query(By.css('[data-test="popup-denied-close"]'));
          const elNe = elDe.nativeElement;

          elNe.click();

          expect(close).toHaveBeenCalled();
          expect(close).toHaveBeenCalledWith(true);
        });

      });

    });

  });

});
