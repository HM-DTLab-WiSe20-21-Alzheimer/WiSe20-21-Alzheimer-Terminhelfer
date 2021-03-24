import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { Amplify } from '@aws-amplify/core';
import awsconfig from './aws-exports.js';
import * as dayjs from 'dayjs';
import * as Duration from 'dayjs/plugin/duration';
import * as RelativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/de';

dayjs.extend(Duration);
dayjs.extend(RelativeTime);
dayjs.locale('de');

if (environment.production) {
  enableProdMode();
}

Amplify.configure(awsconfig);

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
