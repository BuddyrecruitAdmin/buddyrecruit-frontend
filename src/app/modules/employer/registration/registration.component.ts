import { Component, OnInit } from '@angular/core';
import { RegistrationService } from './registration.service';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'ngx-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  innerHeight: any;
  topic: string;
  bgClass: string;
  message: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private service: RegistrationService,
  ) {

  }

  ngOnInit() {
    this.innerHeight = window.innerHeight;
    this.topic = 'Your registration';
    this.message = 'Thank you for submitting an account verification request.';

    this.activatedRoute.queryParams.subscribe(params => {
      if (params.code) {
        if (params.code.toString() === '200') {
          this.bgClass = 'success';
          this.topic = 'Your registration was successful';
        } else {
          this.bgClass = 'danger';
          this.topic = 'Your registration failed';
        }
      }
      if (params.message) {
        this.message = params.message;
      }
    });

    // this.service.test().subscribe(response => {
    //   console.log(response);
    // });
  }

  close() {
    window.close();
  }

}
