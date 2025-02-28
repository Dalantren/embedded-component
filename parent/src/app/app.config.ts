import { ApplicationConfig, InjectionToken, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const TEST_INJECTION_TOKEN = new InjectionToken('bla bla');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    { provide: TEST_INJECTION_TOKEN, useValue: 'Dick' },
  ]
};
