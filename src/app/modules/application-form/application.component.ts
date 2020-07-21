import { Component } from '@angular/core';

@Component({
  selector: 'ngx-application',
  styleUrls: ['application.component.scss'],
  template: `
    <ngx-full-columns-layout>
      <router-outlet></router-outlet>
    </ngx-full-columns-layout>
  `,
})
export class ApplicationComponent {
}
