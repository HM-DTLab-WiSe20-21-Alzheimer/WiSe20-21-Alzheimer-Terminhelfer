import { DashboardComponent } from './dashboard.component';
import { User } from '../../../models/User';
import { CognitoAuthenticationService } from '../../../services/authentication/cognito-authentication.service';
import { AppointmentService } from '../../../services/appointment/appointment.service';
import { Observable } from 'rxjs';
import * as dayjs from 'dayjs';

describe('DashboardComponent', () => {
  describe('Logic', () => {

    let component: DashboardComponent;
    const user = {
      getName: jest.fn(() => 'Max Mustermann'),
    };
    const authServiceStub = {
      getUser: () => new Observable(subscriber => {
        subscriber.next(user as unknown as User);
        subscriber.complete();
      })
    } as unknown as CognitoAuthenticationService;

    const appointmentServiceStub = {
      getNext: jest.fn(() => Promise.resolve(null)),
    } as unknown as AppointmentService;

    beforeEach(() => {
      component = new DashboardComponent(authServiceStub, appointmentServiceStub);
    });

    it('should create', () => {
      expect(component).toBeDefined();
      expect(component.date).toEqual(dayjs().format('dddd DD.MM.YYYY'));
    });

    it('should pipe username', async (done) => {
      expect.assertions(2);

      component.firstname.subscribe(name => {
        expect(name).toEqual('Max');
        expect(user.getName).toHaveBeenCalled();
        done();
      });
    });

    it('should fetch next appointment', () => {
      expect(appointmentServiceStub.getNext).toHaveBeenCalled();
    });

  });
});
