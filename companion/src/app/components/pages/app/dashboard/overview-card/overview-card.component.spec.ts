import { OverviewCardComponent } from './overview-card.component';
import { AppointmentService } from '../../../../../services/appointment/appointment.service';

describe('OverviewCardComponent', () => {
  describe('Logic', () => {

    let component: OverviewCardComponent;
    let service: AppointmentService;

    beforeEach(() => {
      service = {
        getAllByDay: jest.fn(() => Promise.resolve([])),
      } as unknown as AppointmentService;

      component = new OverviewCardComponent(service);
    });

    describe('Constructor', () => {
      it('should initialize appointment loading', () => {
        component.ngOnInit();

        expect(service.getAllByDay).toHaveBeenCalled();
      });
    });

    describe('next day', () => {
      it('should switch to next day', () => {
        const want = component.date.add(1, 'day');

        component.nextDay();

        expect(component.date).toEqual(want);
        expect(service.getAllByDay).toHaveBeenCalled();
        expect(service.getAllByDay).toHaveBeenCalledWith(want);
      });
    });

    describe('previous day', () => {
      it('should switch to next day', () => {
        const want = component.date.subtract(1, 'day');

        component.previousDay();

        expect(component.date).toEqual(want);
        expect(service.getAllByDay).toHaveBeenCalled();
        expect(service.getAllByDay).toHaveBeenCalledWith(want);
      });
    });

    describe('day diff', () => {

      it('should get positive day diff', () => {
        component.nextDay();

        expect(component.getDateDiff()).toEqual(1);
      });

      it('should get positive day 2 diff', () => {
        component.nextDay();
        component.nextDay();

        expect(component.getDateDiff()).toEqual(2);
      });

      it('should get negative day diff', () => {
        component.previousDay();

        expect(component.getDateDiff()).toEqual(-1);
      });

      it('should get negative day 2 diff', () => {
        component.previousDay();
        component.previousDay();

        expect(component.getDateDiff()).toEqual(-2);
      });

      it('should get non diff', () => {
        expect(component.getDateDiff()).toEqual(0);
      });

      it('should get non diff after change', () => {
        component.previousDay();
        component.nextDay();

        expect(component.getDateDiff()).toEqual(0);
      });

    });

    describe('day diff', () => {

      it('should get positive day diff', () => {
        component.nextDay();

        expect(component.getDateDiffAbs()).toEqual(1);
      });

      it('should get negative day diff', () => {
        component.previousDay();

        expect(component.getDateDiffAbs()).toEqual(1);
      });
    });

  });
});
