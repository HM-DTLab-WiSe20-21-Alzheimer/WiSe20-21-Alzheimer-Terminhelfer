import * as dayjs from 'dayjs';
import * as Duration from 'dayjs/plugin/duration';
import * as RelativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/de';

dayjs.extend(Duration);
dayjs.extend(RelativeTime);
dayjs.locale('de');

export default dayjs;
