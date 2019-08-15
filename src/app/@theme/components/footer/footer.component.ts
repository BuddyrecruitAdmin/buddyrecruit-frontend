import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">Copyright &copy; 2018-2019 <a href="http://www.zygencenter.com/">ZyGen Company Limited</a>.
    All rights reserved.</span>
  `,
})
export class FooterComponent {
}
