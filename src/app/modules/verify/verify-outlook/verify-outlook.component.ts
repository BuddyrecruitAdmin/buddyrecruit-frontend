import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'ngx-verify-outlook',
  templateUrl: './verify-outlook.component.html',
  styleUrls: ['./verify-outlook.component.scss']
})
export class VerifyOutlookComponent implements OnInit {

  jsonFile: any;
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getJSON().subscribe(data => {
      this.jsonFile = data;
    });
  }

  public getJSON(): Observable<any> {
    return this.http.get('../../../../assets/data/microsoft-identity-association.json');
  }

}
