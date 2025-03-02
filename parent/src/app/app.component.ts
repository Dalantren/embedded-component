import { ApplicationConfig, ApplicationRef, Component, createComponent, CUSTOM_ELEMENTS_SCHEMA, EnvironmentInjector, importProvidersFrom, inject, Injector, makeEnvironmentProviders, NgZone, PlatformRef, Renderer2, signal, Type, viewChild, ViewContainerRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { createCustomElement } from '@angular/elements';
import { TestComponent } from './test.component';
import { createApplication } from '@angular/platform-browser';

@Component({
    selector: 'app-root',
    imports: [TestComponent],
    standalone: true,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: './app.component.html'
})
export class AppComponent {
  private container = viewChild('customSelectorContainer', { read: ViewContainerRef });
  someVariable = signal('');

  private injector = inject(Injector);
  private envInjector = inject(EnvironmentInjector);
  private renderer = inject(Renderer2);
  private zone = inject(NgZone);
  private abc = inject(PlatformRef);
  private appRef = inject(ApplicationRef);

  ngOnInit() {
    console.log('this.injector', this.injector);
    console.log('this.envInjector', this.envInjector);
    console.log('this.appRefInjector', this.appRef.injector);
    console.log('this.platformInjector', this.abc.injector);

    // Not working examples for loadScript1() and loadScript2():
    this.loadScript2().then(({ emConfig, emComponent }) => {
      const customElement = createCustomElement(emComponent, { injector: this.envInjector });
      customElements.define('child-app', customElement);

      const childElement: HTMLElement = this.renderer.createElement('child-app');
      debugger;
      this.container()?.element.nativeElement.appendChild(childElement);
    });

    // Working example with import like a regular script:

    // this.loadScript3().then(() => {
    //   const childElement: HTMLElement = this.renderer.createElement('child-app');
    //   debugger;
    //   this.container()?.element.nativeElement.appendChild(childElement);
    // });
  }

  private loadScript1(): Promise<{ emConfig: ApplicationConfig, emComponent: Type<any> }> {
    const src = 'http://127.0.0.1:5500/dist/child/main.js';
    return new Promise((resolve, reject) => {
      const scriptElement = document.createElement('script');
      scriptElement.src = src;
      scriptElement.id = `test-script`;
      scriptElement.type = 'module';

      scriptElement.onload = () => {
        import(/* @vite-ignore */ src)
          .then(({ emConfig, emComponent }) => {
            resolve({ emConfig, emComponent });
          })
          .catch(err => console.error(err));
      }
      scriptElement.onerror = () => reject(new Error('failed to load custom app'));
      document.body.appendChild(scriptElement);
    });
  }

  private loadScript2(): Promise<{ emConfig: ApplicationConfig, emComponent: Type<any> }> {
    const src = 'http://127.0.0.1:5500/dist/child/main.js';
    return new Promise((resolve, reject) => {
      const scriptElement = document.createElement('script');
      scriptElement.src = src;
      scriptElement.id = `test-script`;
      scriptElement.type = 'module';

      let emConfig: ApplicationConfig;
      let emComponent: Type<any>;

      scriptElement.onload = () => {
        import(/* @vite-ignore */ src)
          .then(({ emConfig: config, emComponent: component }) => {
            emComponent = component;
            emConfig = config ;
            return this.zone.runOutsideAngular(() => createApplication(config));
          })
          .then(appRef => {
            resolve({ emConfig, emComponent });
          })
          .catch(err => console.error(err));
      }
      scriptElement.onerror = () => reject(new Error('failed to load custom app'));
      document.body.appendChild(scriptElement);
    });
  }

  private loadScript3(): Promise<void> {
    const src = 'http://127.0.0.1:5500/dist/child/main.js';
    return new Promise((resolve, reject) => {
      const scriptElement = document.createElement('script');
      scriptElement.src = src;
      scriptElement.id = `test-script`;
      scriptElement.type = 'text/javascript';

      scriptElement.onload = () => resolve();
      scriptElement.onerror = () => reject(new Error('failed to load custom app'));
      document.body.appendChild(scriptElement);
    });
  }
}
