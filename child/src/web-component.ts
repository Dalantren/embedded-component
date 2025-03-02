import { createApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { createCustomElement } from '@angular/elements';

// For iport as a module:

export const emConfig = appConfig;
export const emComponent = AppComponent;

//------------------------------------------

// For import as a text/javascript:

// createApplication(appConfig)
//   .then(appRef => {
//     const element = createCustomElement(AppComponent, { injector: appRef.injector });
//     customElements.define('child-app', element);
//   });
