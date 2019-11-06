import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { setKeyword } from '../../shared/services/auth.service';

@Component({
  selector: 'ngx-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  keyword: any;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.keyword = '';
  }

  search() {
    setKeyword(this.keyword);
    this.router.navigate(["/employer/candidate/list"]);
  }
}
