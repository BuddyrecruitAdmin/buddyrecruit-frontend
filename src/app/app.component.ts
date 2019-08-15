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

  constructor(
    private analytics: AnalyticsService,
    private router: Router,
  ) {
    if (!getToken()) {
      this.router.navigate(["/auth/login"]);
    }
  }

  ngOnInit(): void {
    this.analytics.trackPageViews();
  }
}
