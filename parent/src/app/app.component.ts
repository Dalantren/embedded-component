import { ApplicationConfig, ApplicationRef, Component, createComponent, CUSTOM_ELEMENTS_SCHEMA, EnvironmentInjector, inject, Injector, NgZone, PlatformRef, Renderer2, signal, Type, viewChild, ViewContainerRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { createCustomElement } from '@angular/elements';
import { TestComponent } from './test.component';
import { createApplication } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TestComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
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
  private component!: Type<any>;
  private config!: ApplicationConfig;

  ngOnInit() {
    this.loadScript().then(() => {
      const childElement: HTMLElement = this.renderer.createElement('child-app');
      // this.container()?.element.nativeElement.appendChild(childElement);

      const comp = createComponent(this.component, {
        environmentInjector: this.appRef.injector,
        hostElement: this.container()?.element.nativeElement,
        elementInjector: this.injector,
      });
      console.log(comp);
    });
  }

  private loadScript(): Promise<void> {
    const src = 'http://127.0.0.1:5500/dist/child/main.js';
    return new Promise((resolve, reject) => {
      const scriptElement = document.createElement('script');
      scriptElement.src = src;
      scriptElement.id = `test-script`;
      scriptElement.type = 'module';

      this.abc.injector
      scriptElement.onload = () => {
        import(/* @vite-ignore */ src)
          .then(({ emConfig, emComponent }) => {
            this.component = emComponent;
            this.config = emConfig;
            return this.zone.runOutsideAngular(() => createApplication(emConfig));
          })
          // .then(({ emConfig, emComponent }) => {
          .then(appRef => {
            const customElement = createCustomElement(this.component, { injector: appRef.injector });
            customElements.define('child-app', customElement);
            resolve();
          })
          .catch(err => console.error(err));
      }
      scriptElement.onerror = () => reject(new Error('failed to load custom app'));
      document.body.appendChild(scriptElement);
    });
  }
}
