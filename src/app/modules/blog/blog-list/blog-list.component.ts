import { Component, OnInit } from '@angular/core';
import { setPathName } from '../../../shared/services';
import { Router } from "@angular/router";
@Component({
  selector: 'ngx-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent implements OnInit {
  navBlog: boolean;
  navContact: boolean;
  news: any;
  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
    this.news = '../../../assets/images/about1.jpg'
    this.navBlog = true;
    this.navContact = false;
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
