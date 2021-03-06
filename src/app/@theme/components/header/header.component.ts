import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';
import { ProfileService } from '../../../pages/profile/profile.service';
import { LayoutService } from '../../../@core/utils';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { getRole, setFlowId, getAuthentication, setAuthentication, setAppURL } from '../../../shared/services/auth.service';
import { Router } from "@angular/router";
import { NbSearchService } from '@nebular/theme';
import { setKeyword } from '../../../shared/services/auth.service';
import { HeaderService } from './header.service';
import { ResponseCode, Paging } from '../../../shared/app.constants';
import { Paging as IPaging } from '../../../shared/interfaces/common.interface';
import { UtilitiesService } from '../../../shared/services/utilities.service';
import { AuthorizeService } from '../../../pages/setting/authorize/authorize.service';
import { PusherService } from '../../../shared/services/pusher.service';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;
  sss = getRole();

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  currentTheme = 'default';

  userMenu = [
    { title: 'Profile', icon: 'person-outline', link: '/employer/profile' },
    { title: 'Log out', icon: 'log-out-outline', link: '/employer/logout' }
  ];
  imagePath: any;
  paging: IPaging;
  notificationData: any;
  notifications: any;
  innerWidth: any;
  innerHeight: any;
  noticeHeight: any;
  showNotice: boolean = false;
  showSeeMore: boolean = true;
  countUnread: number = 0;
  countUnseen: number = 0;
  loading: boolean;
  role: any;

  counter: {
    notification: {
      unread: 0,
      unseen: 2,
      data: []
    },
    processFlow: {
      talentPool: 1,
      pendingExam: 2,
      pendingAppointment: 1,
      pendingInterview: 0,
      pendingSignContract: 0,
      onboard: 0
    }
  }

  constructor(
    private router: Router,
    private service: HeaderService,
    private proService: ProfileService,
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private layoutService: LayoutService,
    private breakpointService: NbMediaBreakpointsService,
    private searchService: NbSearchService,
    private utilitiesService: UtilitiesService,
    private authorizeService: AuthorizeService,
    private pusherService: PusherService
  ) {
    this.role = getRole();
    if (this.role && this.role.refAuthorize) {
      this.authorizeService.getDetail(this.role.refAuthorize._id).subscribe(response => {
        if (response.code === ResponseCode.Success) {
          this.role.refAuthorize = response.data;
          let token = getAuthentication();
          token.role = this.role;
          setAuthentication(token);
        }
      });
    }
    setKeyword();
    this.searchService.onSearchSubmit().subscribe((data: any) => {
      setKeyword(data.term);
      this.router.navigate(['/employer/candidate/list/' + data.term]);
    });
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    this.noticeHeight = window.innerHeight * 0.7;
  }

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;
    this.proService.getProfile(this.role.refHero._id).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.user = {
          name: this.utilitiesService.setFullname(response.data),
          title: this.role.refHero.name,
          picture: response.data.imageData,
        };
        if (response.data.refCompany.appFormsURL) {
          setAppURL(this.getURL(response.data.refCompany.appFormsURL))
        }
      }
    });
    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    // this.themeService.onThemeChange()
    //   .pipe(
    //     map(({ name }) => name),
    //     takeUntil(this.destroy$),
    //   )
    //   .subscribe(themeName => this.currentTheme = themeName);

    this.paging = {
      length: 0,
      pageIndex: 0,
      pageSize: Paging.pageSizeOptions[0],
      pageSizeOptions: Paging.pageSizeOptions
    };
    this.loading = true;
    this.notificationData = [];
    this.notifications = [];

    this.checkNewNotification();
    this.getNotification();
    // if (this.role) {
    //   setInterval(() => {
    //     if (this.utilitiesService.getRole() && this.utilitiesService.getToken()) {
    //       this.checkNewNotification();
    //     }
    //   }, 30000);
    // }

    if (this.role && this.role._id) {
      this.pusherService.channel.bind(`counter-${this.role._id}`, data => {
        // console.log('pusherService', data);
        const counter = data.counter;
        if (counter && counter.notification) {
          this.countUnseen = counter.notification.unseen || 0;
          this.countUnread = counter.notification.unread || 0;
          if (counter.notification.data && counter.notification.data.length) {
            counter.notification.data.forEach(element => {
              if (element.fromUser.refUser) {
                this.notifications.unshift({
                  name: element.title,
                  title: this.utilitiesService.convertDateTimeFromSystem(element.date) ||
                    this.utilitiesService.convertDateTimeFromSystem(element.lastChangedInfo.date),
                  picture: element.fromUser.refUser.imageData,
                  hidden: element.readed
                });
              } else {
                this.notifications.unshift({
                  name: element.title,
                  title: this.utilitiesService.convertDateTimeFromSystem(element.date) ||
                    this.utilitiesService.convertDateTimeFromSystem(element.lastChangedInfo.date),
                  picture: 'https://image.flaticon.com/icons/png/512/55/55089.png',
                  hidden: element.readed
                });
              }
            });
          }
        }
      });
    }
  }

  getURL(str) {
    return str.split('index')[0];
  }

  checkNewNotification() {
    this.service.checkNew().subscribe(response => {
      if (response.code === ResponseCode.Success) {
        if (response.count.unseen) {
          this.countUnseen = response.count.unseen || 0;
          this.countUnread = response.count.unread || 0;
        }
      }
    });
  }

  openNotification() {
    if (this.countUnseen) {
      this.getNotification();
    }
  }

  getNotification() {
    let criteria = {
      skip: this.paging.pageIndex * this.paging.pageSize,
      limit: this.paging.pageSize
    };
    if (this.countUnseen) {
      criteria.skip = 0;
      criteria.limit = (this.paging.pageIndex * this.paging.pageSize) + this.paging.pageSize;
      this.countUnseen = 0;
      this.notificationData = [];
      this.notifications = [];
      this.service.markAsSeen().subscribe(response => {
        if (response.code === ResponseCode.Success) {
        }
      });
    }
    this.service.getNotification(criteria).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.countUnread = response.count.unread || response.count.unRead || 0;
        if (this.notifications.length >= response.count.data) {
          this.showSeeMore = false;
        }
        response.data.forEach(element => {
          this.notificationData.push(element);
          if (element.fromUser.refUser) {
            this.notifications.push({
              name: element.title,
              title: this.utilitiesService.convertDateTimeFromSystem(element.date) ||
                this.utilitiesService.convertDateTimeFromSystem(element.lastChangedInfo.date),
              picture: element.fromUser.refUser.imageData || 'https://image.flaticon.com/icons/png/512/55/55089.png',
              hidden: element.readed
            });
          } else {
            this.notifications.push({
              name: element.title,
              title: this.utilitiesService.convertDateTimeFromSystem(element.date) ||
                this.utilitiesService.convertDateTimeFromSystem(element.lastChangedInfo.date),
              picture: 'https://image.flaticon.com/icons/png/512/55/55089.png',
              hidden: element.readed
            });
          }
        });
        this.loading = false;
      }
    });
  }

  seeMore() {
    this.paging.pageIndex++;
    this.loading = true;
    this.getNotification();
  }

  seeLess() {
    this.paging = {
      length: 0,
      pageIndex: 0,
      pageSize: Paging.pageSizeOptions[0],
      pageSizeOptions: Paging.pageSizeOptions
    };
    this.showSeeMore = true;
    this.loading = true;
    this.notificationData = [];
    this.notifications = [];
    this.getNotification();
  }

  onClickNotification(index: number) {
    const item = this.notificationData[index];
    const ids = [item._id];
    this.showNotice = false;
    this.service.markAsRead(ids).subscribe(response => {
      this.countUnread = response.count.unread || 0;
      if (response.code === ResponseCode.Success) {
        this.notifications[index].hidden = true;
      }
    });
    if (item.refCandidateFlow) {
      setFlowId(item.refCandidateFlow);
    }
    this.router.navigate([item.link]);
  }

  markAllAsRead() {
    let ids = [];
    this.notificationData.forEach(element => {
      ids.push(element._id);
    });
    this.service.markAsRead(ids).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.countUnread = response.count.unread || 0;
        this.notifications.forEach(element => {
          element.hidden = true;
        });
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();
    return false;
  }

  gotoCalendar() {
    this.router.navigate(['/employer/calendar']);
  }

  gotoProfile() {
    this.showNotice = false;
    this.router.navigate(['/employer/profile']);
  }

}
