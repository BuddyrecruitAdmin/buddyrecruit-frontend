import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'ngx-popup-message',
  templateUrl: './popup-message.component.html',
  styleUrls: ['./popup-message.component.css']
})
export class PopupMessageComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<PopupMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      type: string,
      title: string,
      content: string,
      content2: string,
      btnText: string
    }
  ) { }

  ngOnInit() {
    switch (this.data.type) {
      case "C": { // Confirmation
        this.data.title = this.data.title || "Confirmation";
        this.data.content = this.data.content || "Are you sure?";
        this.data.btnText = this.data.btnText || "OKAY";
        break;
      }
      case "I": { // Information
        this.data.content = this.data.content || "Warning!";
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
