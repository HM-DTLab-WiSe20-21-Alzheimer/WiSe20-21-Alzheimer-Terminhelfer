import { AppointmentOverviewComponent } from './appointment-overview.component';
import { PositionService } from '../../../../../services/position/position.service';
import { Route } from '../../../../../models/route/Route';
import { Observable } from 'rxjs';
import { AlexaAppointment } from '../../../../../models/appointment/AlexaAppointment';
import * as dayjs from 'dayjs';

describe('AppointmentOverviewComponent', () => {
  let component: AppointmentOverviewComponent;
  let positionStub: Partial<PositionService>;

  beforeEach(() => {
    positionStub = {
      hasPermission: jest.fn(() => Promise.resolve(true)),
    };

    component = new AppointmentOverviewComponent(positionStub as PositionService);
  });

  describe('Logic', () => {

    describe('Constructor', () => {

      it('should create', () => {
        expect(component).toBeDefined();
        expect(positionStub.hasPermission).toHaveBeenCalled();
        expect(component.canLoad$).toBeInstanceOf(Observable);
      });

    });

    describe('getDuration', () => {

      it('should format the duration', () => {
        const duration = component.getDuration({
          getDuration: () => 121 * 60,
        } as Route);

        expect(duration).toEqual('2h 1m');
      });

    });

    describe('getDepartmentTime', () => {

      it('should not get time', () => {
        const time = component.getDepartmentTime({
          getDuration: () => 121 * 60,
        } as Route);

        expect(time).toEqual('');
      });

      it('should get time', () => {
        const timeStart = dayjs.unix(1627819200);
        const duration = 121 * 60;
        const want = timeStart.subtract(duration, 'second').format('HH:mm');

        component.appointment = {
          getDateTime: () => timeStart, // 14:00
        } as AlexaAppointment;

        const time = component.getDepartmentTime({
          getDuration: () => duration,
        } as Route);


        expect(time).toEqual(want);
      });

    });

  });
});
