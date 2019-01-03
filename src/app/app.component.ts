import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'emp-ng-root',
  encapsulation: ViewEncapsulation.None,
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {}
