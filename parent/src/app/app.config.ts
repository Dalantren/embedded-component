import { ApplicationConfig, InjectionToken, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

export const TEST_INJECTION_TOKEN = new InjectionToken('bla bla');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    { provide: TEST_INJECTION_TOKEN, useValue: 'Test' },
  ]
};
