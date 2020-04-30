import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { Devices } from '../../shared/interfaces';
@Component({
  selector: 'ngx-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  devices: Devices;
  constructor(
    private utilitiesService: UtilitiesService,
  ) {
    this.devices = this.utilitiesService.getDevice();
  }

  ngOnInit() {
  }

  scrollToElement(element): void {
    element.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  }
}
