import { Component, EnvironmentInjector, inject, Injector, Renderer2, runInInjectionContext, signal, viewChild, ViewContainerRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { createCustomElement } from '@angular/elements';
import { TestComponent } from './test.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TestComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private container = viewChild('customSelectorContainer', { read: ViewContainerRef });
  someVariable = signal('');

  private injector = inject(Injector);
  private envInjector = inject(EnvironmentInjector);
  private renderer = inject(Renderer2);

  ngOnInit() {
    this.loadScript().then(() => {
      const childElement: HTMLElement = this.renderer.createElement('child-app');
      this.envInjector, () => this.container()?.element.nativeElement.appendChild(childElement);
    });
  }

  private loadScript(): Promise<void> {
    const src = 'http://127.0.0.1:5500/dist/child/main.js';
    return new Promise((resolve, reject) => {
      const scriptElement = document.createElement('script');
      scriptElement.src = src;
      scriptElement.id = `test-script`;
      scriptElement.type = 'module';
      scriptElement.onload = () => {
        import(/* @vite-ignore */ src)
          .then(({ emConfig, emComponent }) => {
            const customElement = createCustomElement(emComponent, { injector: this.envInjector });
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
