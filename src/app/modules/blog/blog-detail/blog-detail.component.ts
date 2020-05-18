import { Component, OnInit } from '@angular/core';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { ArgumentType } from '@angular/compiler/src/core';
import { setPathName, getRole } from '../../../shared/services';
import { Router, ActivatedRoute } from "@angular/router";
import { BlogService } from "../blog.service"
import { ResponseCode } from '../../../shared/app.constants';
import { MESSAGE } from '../../../shared/constants/message';
import { UtilitiesService } from '../../../shared/services/utilities.service';
@Component({
  selector: 'ngx-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss']
})
export class BlogDetailComponent implements OnInit {
  topic: any;
  src: any;
  imgHeight: any;
  description: any;
  navBlog: boolean;
  navContact: boolean;
  touchedTopic: boolean;
  // touchedSrc: boolean;
  touchedDescription: boolean;
  sErrorTopic: string;
  // sErrorSrc: string;
  sErrorDesc: string;
  role: any;
  state: string;
  preview: boolean;
  _id: any;
  adminCheck: boolean;
  dob: any;
  constructor(
    private toastrService: NbToastrService,
    private router: Router,
    public service: BlogService,
    private activatedRoute: ActivatedRoute,
    private utilitiesService: UtilitiesService,
  ) {
    this.role = getRole();
  }

  ngOnInit() {
    this.topic = "";
    this.adminCheck = false;
    this.description = "";
    this.navBlog = true;
    this.navContact = false;
    this.preview = false;
    this.activatedRoute.params.subscribe(params => {
      if (params.action === "create") {
        this.state = "create";
      }
      if (params.action === "edit") {
        console.log("dc")
        this.preview = false;
        this._id = params.id;
        this.state = "edit";
        this.getDetail();
      }
      if (params.action === "detail") {
        if (this.role && this.role.refHero.isSuperAdmin) {
          this.adminCheck = true;
        }
        this._id = params.id;
        this.preview = true;
        this.getDetail();
      }
    });
  }

  getDetail() {
    this.service.getDetail(this._id).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.topic = response.data.topic;
        this.src = response.data.src;
        this.description = response.data.description;
        this.dob = response.data.lastChangedInfo.date;
      }
    })
  }

  fileChangeEvent(option, files: FileList): void {
    var reader = new FileReader();
    reader.readAsDataURL(files[0]); // read file as data url
    reader.onload = (e) => {
      var img = new Image;
      const chImg = reader.result;
      img.src = chImg.toString();
      img.onload = (ee) => {
        this.imgHeight = img.height;
      };
      const FileSize = files.item(0).size / 1024 / 1024; // in MB
      if (FileSize > 10) {
        this.showToast('danger', 'Error Message', 'file size more than 10 mb');
      } else {
        this.src = img.src;
      }
    };
  }

  save() {
    if (this.validation()) {
      if (this.state === 'create') {
        this.service.create(this.topic, this.src, this.description).subscribe(response => {
          if (response.code === ResponseCode.Success) {
            this.showToast('success', 'Success Message', response.message);
            this.router.navigate(['/blog']);
          } else {
            this.showToast('danger', 'Error Message', response.message);
          }
        });
      } else {
        this.service.edit(this._id,this.topic, this.src, this.description).subscribe(response => {
          if (response.code === ResponseCode.Success) {
            this.showToast('success', 'Success Message', response.message);
            this.router.navigate(['/blog']);
          } else {
            this.showToast('danger', 'Error Message', response.message);
          }
        });
      }
    }
  }

  validation(): boolean {
    let isValid = true;
    this.touchedTopic = false;
    this.touchedDescription = false;
    if (!this.topic) {
      this.touchedTopic = true;
      this.sErrorTopic = MESSAGE[161];
      isValid = false;
    }
    if (!this.description) {
      this.touchedDescription = true;
      this.sErrorDesc = MESSAGE[162];
      isValid = false;
    }
    return isValid;
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

  scrollToElement(element, name): void {
    this.navBlog = false;
    this.navContact = false;
    switch (name) {
      case 'home':
        this.navBlog = true;
        break;
      case 'contact':
        this.navContact = true;
        break;
      default:
        break;
    }
    element.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  }

  changePath(name) {
    setPathName(name);
    this.router.navigate(['/index']);
  }


}
