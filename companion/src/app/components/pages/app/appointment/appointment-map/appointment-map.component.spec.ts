import { AppointmentMapComponent } from './appointment-map.component';
import { PositionService } from '../../../../../services/position/position.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { fakeAsync, flush, tick } from '@angular/core/testing';
import { Route } from '../../../../../models/route/Route';
import { ElementRef } from '@angular/core';

describe('AppointmentMapComponent', () => {

  describe('Logic', () => {

    let component: AppointmentMapComponent;
    let positionStub: Partial<PositionService>;

    beforeEach(() => {
      positionStub = {
        hasPermission: jest.fn(() => Promise.resolve(true)),
      };

      component = new AppointmentMapComponent(positionStub as PositionService);
    });

    describe('Constructor', () => {

      it('should create', () => {
        expect(component).toBeDefined();
      });

      it('should test for position permission', () => {
        expect(positionStub.hasPermission).toHaveBeenCalled();
        expect(component.canLoad$).toBeInstanceOf(Observable);
      });

    });

    describe('draw map', () => {
      let route: Partial<Route>;
      beforeEach(() => {
        route = {
          drawMap: jest.fn(),
        };

        component.mapElement = {} as ElementRef;
        component.route$ = new Observable(subscriber => {
          subscriber.next(route as Route);
          subscriber.complete();
        });
      });

      it('should draw map', fakeAsync(() => {
        component.ngAfterViewInit();
        tick(300); // Wait 300ms as the observable will pipe with 200ms delay

        expect(route.drawMap).toHaveBeenCalled();
      }));
    });

    describe('not draw map', () => {
      let route: Partial<Route>;
      beforeEach(() => {
        route = {
          drawMap: jest.fn(),
        };

        component.mapElement = {} as ElementRef;
        component.route$ = new Observable(subscriber => {
          subscriber.next(null);
          subscriber.complete();
        });
      });

      it('should not draw map', fakeAsync(() => {
        component.ngAfterViewInit();
        tick(300); // Wait 300ms as the observable will pipe with 200ms delay

        expect(route.drawMap).not.toHaveBeenCalled();
      }));
    });

  });

});
