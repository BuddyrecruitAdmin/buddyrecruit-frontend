import { Component } from '@angular/core';

@Component({
  selector: 'ngx-jobseeker',
  styleUrls: ['jobseeker.component.scss'],
  template: `
    <ngx-full-columns-layout>
      <router-outlet></router-outlet>
    <ngx-full-columns-layout>
  `,
})
export class JobseekerComponent {
}
