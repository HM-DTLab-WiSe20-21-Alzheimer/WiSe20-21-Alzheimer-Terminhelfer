import { generateTest } from './Link.spec';
import { GoogleMapsLink } from './GoogleMapsLink';

describe('GoogleMapsLink', () => {
  generateTest(
    'Google Maps',
    'google',
    GoogleMapsLink,
    (origin, destination) => `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`,
    (origin, destination) => `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=bicycling`,
    (origin, destination) => `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=transit`,
    (origin, destination) => `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=walking`,
  );
});


