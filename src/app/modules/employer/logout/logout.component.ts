import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LogoutService } from './logout.service';
import { setAuthentication, setUrl } from '../../../shared/services/auth.service';

@Component({
  selector: 'ngx-logout',
  template: ''
})
export class LogoutComponent implements OnInit {

  constructor(
    private router: Router,
    private logoutService: LogoutService,
  ) { }

  ngOnInit() {
    this.logoutService.logout().subscribe(response => {
      setAuthentication();
      setUrl();
      this.router.navigate(['/employer/login']);
    });
  }

}
