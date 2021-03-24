import { LocationsCardComponent } from './locations-card.component';
import { LocationService } from '../../../../../services/location/location.service';
import { Observable } from 'rxjs';

describe('LocationsCardComponent', () => {
  describe('Logic', () => {
    describe('Constructor', () => {
      it('should create', () => {
        const service = {
          getAll: jest.fn(),
        } as LocationService;

        const component = new LocationsCardComponent(service);

        expect(component).toBeDefined();
        expect(component.locations$).toBeInstanceOf(Observable);
        expect(service.getAll).toHaveBeenCalled();
      });
    });
  });
});
