import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { setUserEmail, getUserEmail } from '../../shared/services/auth.service';
import { Devices } from '../../shared/interfaces/common.interface';
import { UtilitiesService } from '../../shared/services/utilities.service';
@Component({
  selector: 'ngx-popup-message',
  templateUrl: './popup-message.component.html',
  styleUrls: ['./popup-message.component.css']
})
export class PopupMessageComponent implements OnInit {
  userEmail: any;
  devices: Devices;
  innerHeight: any;
  constructor(
    public dialogRef: MatDialogRef<PopupMessageComponent>,
    private utilitiesService: UtilitiesService,
    @Inject(MAT_DIALOG_DATA) public data: {
      type: string,
      title: string,
      content: string,
      contents: string[],
      btnText: string,
      btnText2: string
    }
  ) {
    this.userEmail = getUserEmail();
    setUserEmail();
    this.devices = this.utilitiesService.getDevice();
    this.innerHeight = window.innerHeight * 0.7;
  }

  ngOnInit() {
    // console.log(this.data)
    switch (this.data.type) {
      case "C": { // Confirmation
        this.data.title = this.data.title || "Confirmation";
        this.data.content = this.data.content || "Do you want to continue?";
        this.data.btnText = this.data.btnText || "YES";
        break;
      }
      case "I": { // Information
        this.data.title = this.data.title || "Information";
        this.data.btnText = this.data.btnText || "OK";
        break;
      }
      case "E": { // Expect
        this.data.title = this.data.title || "Information";
        this.data.btnText = this.data.btnText || "EDIT";
        this.data.btnText2 = this.data.btnText2 || "OK";
        if (this.data.contents) {
          this.data.contents = this.data.contents;
        }
        break;
      }
      case "W": { // Warning
        this.data.title = this.data.title || "Warning";
        this.data.btnText = this.data.btnText || "CONTINUE";
        break;
      }
      case "S": { // Suceess
        this.data.title = this.data.title || "Successfully";
        this.data.btnText = this.data.btnText || "CONTINUE";
        break;
      }
      case "D": { // Confirm to Delete
        this.data.title = this.data.title || "Confirmation";
        this.data.content = this.data.content || "Do you want to delete?";
        this.data.btnText = this.data.btnText || "DELETE";
        break;
      }
    }
  }
}
