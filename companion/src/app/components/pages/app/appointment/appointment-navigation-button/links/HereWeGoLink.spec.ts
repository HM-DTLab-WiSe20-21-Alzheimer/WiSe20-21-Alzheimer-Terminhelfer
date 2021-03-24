import { generateTest } from './Link.spec';
import { HereWeGoLink } from './HereWeGoLink';

describe('GoogleMapsLink', () => {
  generateTest(
    'HereWeGo',
    'map',
    HereWeGoLink,
    (origin, destination) => `https://wego.here.com/directions/drive/${origin}/${destination}`,
    (origin, destination) => `https://wego.here.com/directions/bicycle/${origin}/${destination}`,
    (origin, destination) => `https://wego.here.com/directions/publicTransport/${origin}/${destination}`,
    (origin, destination) => `https://wego.here.com/directions/walk/${origin}/${destination}`,
  );
});


