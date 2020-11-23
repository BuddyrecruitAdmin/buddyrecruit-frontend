import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { GalleryService } from './gallery.service'
import { NbDialogService, NbDialogRef, NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { ResponseCode } from '../../shared/app.constants';
@Component({
  selector: 'ngx-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  pathName: any;
  imgURL: any;
  imgShow: any = 'https://www.flaticon.com/svg/static/icons/svg/3601/3601157.svg';
  fileType: any;
  listType: any = ['png', 'jpg', 'jpeg'];
  constructor(
    private activatedRoute: ActivatedRoute,
    private service: GalleryService,
    private toastrService: NbToastrService,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(param => {
      this.pathName = param.name;
      this.service.fileDownload(this.pathName).subscribe(response => {
        if (response.code === ResponseCode.Success) {
          this.fileType = this.pathName.split(".").pop().toLowerCase();
          this.imgURL = response.data.url;
          if (this.listType.includes(this.fileType)) {
            this.imgShow = response.data.url;
          } else {
            switch (this.fileType) {
              case 'xls':
                this.imgShow = 'https://www.flaticon.com/svg/static/icons/svg/337/337958.svg';
                break;
              case 'pdf':
                this.imgShow = 'https://www.flaticon.com/svg/static/icons/svg/337/337946.svg';
                break;
              case 'xlsx':
                this.imgShow = 'https://www.flaticon.com/svg/static/icons/svg/337/337958.svg';
                break;
              case 'doc':
                this.imgShow = 'https://www.flaticon.com/svg/static/icons/svg/337/337932.svg';
                break;
              case 'docx':
                this.imgShow = 'https://www.flaticon.com/svg/static/icons/svg/337/337932.svg';
                break;
              default:
                this.imgShow = 'https://www.flaticon.com/svg/static/icons/svg/3601/3601157.svg';
                break;
            }
            // this.imgURL = ;
          }
          this.downloadPicture()
          this.showToast('success', 'Success Message', response.message);
        } else {
          this.showToast('danger', 'Error Message', response.message);
        }
      })
    })
  }

  downloadPicture() {
    window.open(this.imgURL);
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
