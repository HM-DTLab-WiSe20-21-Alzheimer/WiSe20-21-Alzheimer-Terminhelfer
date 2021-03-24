import { NextCardComponent } from './next-card.component';
import { AlexaAppointment } from '../../../../../models/appointment/AlexaAppointment';
import * as dayjs from 'dayjs';
import { Observable } from 'rxjs';

describe('NextCardComponent', () => {
  describe('Logic', () => {
    it('should create', () => {
      const component = new NextCardComponent();
      component.appointment = Promise.resolve(new AlexaAppointment({
        M: {
          dateTime: { S: dayjs().format() },
          location: {
            M: {
              name: { S: 'TestLoc' },
              coordinates: { S: '48.1559366,11.5243933' },
            },
          },
          title: { S: 'test' },
          id: { S: '123456789' },
          transport: { S: 'auto' },
        },
      }));

      component.ngOnInit();

      expect(component).toBeDefined();
      expect(component.appointment$).toBeInstanceOf(Observable);
    });
  });

});
