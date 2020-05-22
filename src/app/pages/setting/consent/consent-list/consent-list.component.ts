import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../../../shared/services/utilities.service';
import { ConsentListService } from '../consent-list.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ResponseCode } from '../../../../shared/app.constants';
@Component({
  selector: 'ngx-consent-list',
  templateUrl: './consent-list.component.html',
  styleUrls: ['./consent-list.component.scss']
})
export class ConsentListComponent implements OnInit {
  innerHeight: any;
  innerWidth: any;
  preview: boolean;
  text: any;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'no',
    sanitize: false,
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
  }
  constructor(
    private utilitiesService: UtilitiesService,
    private service: ConsentListService
  ) {
    this.innerHeight = window.innerHeight * 0.8;
    this.innerWidth = this.utilitiesService.getWidthOfPopupCard();
  }


  ngOnInit() {
    this.preview = true;
    this.text = '';
    this.getDetail();
  }

  getDetail() {
    this.service.getDetail().subscribe(response => {
      if (response.code === ResponseCode.Success) {
        console.log("check")
      }
    })
  }

  editStatus() {
    this.preview = false;
  }

  editText() {
    this.service.edit(this.text).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        console.log("Edit")
      }
    })
  }

}
