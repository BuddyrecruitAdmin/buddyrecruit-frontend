import { Component } from '@angular/core';

@Component({
  selector: 'ngx-full-columns-layout',
  styleUrls: ['./full-columns.layout.scss'],
  template: `
    <nb-layout windowMode>
      <nb-layout-column style="padding: 0">
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>
    </nb-layout>
  `,
})
export class FullColumnsLayoutComponent {}
