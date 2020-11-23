import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">Copyright &copy; 2018-{{ date }} <a target="_blank" href="http://www.zygencenter.com/">ZyGen Company Limited</a>.
    All rights reserved.</span>
  `,
})
export class FooterComponent {
  date: any;
  constructor() {
    this.date = new Date().getFullYear();
  }
}
