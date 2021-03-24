import { generateTest } from './Link.spec';
import { AppleMapsLink } from './AppleMapsLink';

describe('AppleMapsLink', () => {
  generateTest(
    'Apple Maps',
    'apple',
    AppleMapsLink,
    (origin, destination) => `https://maps.apple.com/?saddr=${origin}&daddr=${destination}&dirflg=d`,
    (origin, destination) => `https://maps.apple.com/?saddr=${origin}&daddr=${destination}&dirflg=w`,
    (origin, destination) => `https://maps.apple.com/?saddr=${origin}&daddr=${destination}&dirflg=r`,
    (origin, destination) => `https://maps.apple.com/?saddr=${origin}&daddr=${destination}&dirflg=w`,
  );
});


