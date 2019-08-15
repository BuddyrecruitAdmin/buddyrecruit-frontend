import { Component } from '@angular/core';

@Component({
  selector: 'ngx-modules',
  styleUrls: ['modules.component.scss'],
  template: `
    <ngx-full-columns-layout>
      <router-outlet></router-outlet>
    <ngx-full-columns-layout>
  `,
})
export class ModulesComponent {
}
