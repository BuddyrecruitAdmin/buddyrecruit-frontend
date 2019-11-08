/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnalyticsService } from './@core/utils/analytics.service';
import { getToken } from './shared/services/auth.service';

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  url: any;
  constructor(
    private analytics: AnalyticsService,
    private router: Router,
  ) {
    // if (!getToken()) {
    //   this.url = window.location.pathname.slice(0, 18);
    //   if (this.url !== '/employer/appform/') {
    //     if (this.url !== '/employer/forgot') {
    //       this.url = window.location.pathname.slice(0, 25);
    //       if (this.url !== '/employer/changepassword/') {
    //         this.router.navigate(['/employer/login']);
    //       }
    //     }
    //   }
    // }
  }

  ngOnInit(): void {
    this.analytics.trackPageViews();
  }
}
