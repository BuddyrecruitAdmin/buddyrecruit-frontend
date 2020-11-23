import { Component, OnInit } from '@angular/core';
import { setPathName, getRole } from '../../../shared/services';
import { Router } from "@angular/router";
import { BlogService } from "../blog.service"
import { ResponseCode } from '../../../shared/app.constants';
import { UtilitiesService } from '../../../shared/services/utilities.service';
import { MatDialog } from '@angular/material';
import { PopupMessageComponent } from '../../../component/popup-message/popup-message.component';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
@Component({
  selector: 'ngx-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent implements OnInit {
  navBlog: boolean;
  navContact: boolean;
  role: any;
  items: any;
  itemNew: any;
  adminCheck: any;
  loading: boolean;
  date: any;
  constructor(
    private router: Router,
    public service: BlogService,
    private utilitiesService: UtilitiesService,
    public matDialog: MatDialog,
    private toastrService: NbToastrService,
  ) {
    this.role = getRole();
    this.date = new Date().getFullYear();
  }

  ngOnInit() {
    this.navBlog = true;
    this.loading = true;
    this.adminCheck = false;
    this.navContact = false;
    this.items = [];
    if (this.role && this.role.refHero.isSuperAdmin) {
      this.adminCheck = true;
    }
    this.getList();
  }

  getList() {
    this.service.getList().subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.items = response.data;
        this.items.reverse();
        this.itemNew = this.items[0];
        this.items.splice(0, 1);
      }
      this.loading = false;
    })
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

  delete(item: any) {
    const confirm = this.matDialog.open(PopupMessageComponent, {
      width: `${this.utilitiesService.getWidthOfPopupCard()}px`,
      data: { type: 'D' }
    });
    confirm.afterClosed().subscribe(result => {
      if (result) {
        this.service.deleteItem(item).subscribe(response => {
          if (response.code === ResponseCode.Success) {
            this.showToast('success', 'Success Message', response.message);
            this.getList();
          } else {
            this.showToast('danger', 'Error Message', response.message);
          }
        });
      }
    });
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

  changePath(name) {
    setPathName(name);
    this.router.navigate(['/index']);
  }

}
