import { Component, OnInit, SecurityContext } from '@angular/core';
import { UtilitiesService } from '../../../../shared/services/utilities.service';
import { ConsentListService } from '../consent-list.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ResponseCode } from '../../../../shared/app.constants';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { getRole } from '../../../../shared/services/auth.service';
@Component({
  selector: 'ngx-consent-list',
  templateUrl: './consent-list.component.html',
  styleUrls: ['./consent-list.component.scss']
})
export class ConsentListComponent implements OnInit {
  innerHeight: any;
  innerWidth: any;
  preview: boolean;
  text: SafeHtml;
  _id: any;
  role: any;
  loading: boolean;
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
    defaultFontName: 'Kanit',
    defaultFontSize: '',
    fonts: [
      { class: 'kanit', name: 'Kanit' },
    ]
  };
  constructor(
    private utilitiesService: UtilitiesService,
    private service: ConsentListService,
    private toastrService: NbToastrService,
    public sanitizer: DomSanitizer
  ) {
    this.innerHeight = window.innerHeight * 0.8;
    this.innerWidth = this.utilitiesService.getWidthOfPopupCard();
    this.role = getRole();
  }


  ngOnInit() {
    this.preview = true;
    this.loading = true;
    this.getDetail();
  }

  getDetail() {
    this.service.getDetail(this.role.refCompany._id).subscribe(response => {
      this.loading = false;
      if (response.code === ResponseCode.Success) {
        if (this.preview) {
          this.text = this.sanitizer.bypassSecurityTrustHtml(response.data.text);
        } else {
          this.text = this.sanitizer.sanitize(SecurityContext.HTML, this.sanitizer.bypassSecurityTrustHtml(response.data.text));
        }
        this._id = response.data._id;
      }
    })
  }

  editStatus() {
    this.preview = false;
    this.loading = true;
    this.getDetail();
  }

  editText() {
    this.service.edit(this._id, this.text).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.showToast('success', 'Success Message', response.message);
        this.preview = true;
        this.loading = true;
        this.getDetail();
      } else {
        this.showToast('danger', 'Error Message', response.message);
      }
    })
  }

  showToast(type: NbComponentStatus, title: string, body: string) {
    const config = {
      status: type,
      destroyByClick: true,
      duration: 5000,
      hasIcon: true,
      position: NbGlobalPhysicalPosition.TOP_RIGHT,
      preventDuplicates: false,
    };
    this.toastrService.show(body, title, config);
  }

}
