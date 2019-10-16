/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
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
    if (!getToken()) {
      this.url = window.location.pathname.slice(0, 14);
      if (this.url != "/auth/appform/") {
        if (this.url != "/auth/forgot") {
          this.url = window.location.pathname.slice(0, 21);
          if (this.url != "/auth/changepassword/") {
            this.router.navigate(["/auth/login"]);
          }
        }
      }
    }
  }

  ngOnInit(): void {
    this.analytics.trackPageViews();
  }
}
