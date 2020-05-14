import { Component, OnInit } from '@angular/core';
import { setPathName, getRole } from '../../../shared/services';
import { Router } from "@angular/router";
import { BlogService } from "../blog.service"
import { ResponseCode } from '../../../shared/app.constants';
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
  constructor(
    private router: Router,
    public service: BlogService
  ) {
    this.role = getRole();
  }

  ngOnInit() {
    this.navBlog = true;
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
        this.items.splice(0, 1)
      }
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

  changePath(name) {
    setPathName(name);
    this.router.navigate(['/index']);
  }

}
