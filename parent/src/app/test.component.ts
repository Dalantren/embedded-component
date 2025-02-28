import { Component, inject } from '@angular/core';
import { TEST_INJECTION_TOKEN } from './app.config';


@Component({
  standalone: true,
  selector: 'test-component',
  template: `Parent component`
})
export class TestComponent {
  token = inject(TEST_INJECTION_TOKEN)

  ngOnInit() {
    console.log(this.token);
  }
}