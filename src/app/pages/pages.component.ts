import { Component } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import * as MENU from './pages-menu';
import { getRole, getToken, setUrl } from '../shared/services/auth.service';
import { ReportService } from '../pages/setting/report/report.service';
import { ResponseCode } from '../shared/app.constants';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent {
  menu: NbMenuItem[];

  constructor(
    private router: Router,
    private reportService: ReportService,
  ) {
    const token = getToken();
    if (!token) {
      setUrl(this.router.url);
      this.router.navigate(['/employer/login']);
    }

    this.menu = [];
    const role = getRole();
    // Home
    MENU.MENU_HOME.forEach(element => {
      this.menu.push(element);
    });
    if (role && role.refCompany && role.refCompany.menu) {
      const menu = role.refCompany.menu;
      if (menu) {
        // Dashboard
        if (menu.dashboard && menu.dashboard.active && role.refAuthorize.showDashboard) {
          MENU.MENU_DASHBOARD.forEach(element => {
            this.menu.push(element);
          });
        }
        // Masrter Data
        if ((menu.jd && menu.jd.active) || (menu.jr && menu.jr.active)) {
          this.menu.push(MENU.MENU_MASTER_DATA[0]);
          if (menu.jd && menu.jd.active) {
            this.menu.push(MENU.MENU_MASTER_DATA[1]);
          }
          if (menu.jr && menu.jr.active) {
            this.menu.push(MENU.MENU_MASTER_DATA[2]);
          }
        }
        // Process Flow
        if ((menu.talentPool && menu.talentPool.active)
          || (menu.pendingExam && menu.pendingExam.active)
          || (menu.pendingAppointment && menu.pendingAppointment.active)
          || (menu.pendingInterview && menu.pendingInterview.active)
          || (menu.pendingSignContract && menu.pendingSignContract.active)
          || (menu.onboard && menu.onboard.active)
        ) {
          this.menu.push(MENU.MENU_PROCESS_FLOW[0]);
          this.menu.push(MENU.MENU_PROCESS_FLOW[7]);
          if (menu.talentPool && menu.talentPool.active) {
            this.menu.push(MENU.MENU_PROCESS_FLOW[1]);
          }
          if (menu.pendingExam && menu.pendingExam.active) {
            this.menu.push(MENU.MENU_PROCESS_FLOW[2]);
          }
          if (menu.pendingAppointment && menu.pendingAppointment.active) {
            this.menu.push(MENU.MENU_PROCESS_FLOW[3]);
          }
          if (menu.pendingInterview && menu.pendingInterview.active) {
            this.menu.push(MENU.MENU_PROCESS_FLOW[4]);
          }
          if (menu.pendingSignContract && menu.pendingSignContract.active) {
            this.menu.push(MENU.MENU_PROCESS_FLOW[5]);
          }
          if (menu.onboard && menu.onboard.active) {
            this.menu.push(MENU.MENU_PROCESS_FLOW[6]);
          }
        }
        // Reporting
        if (menu.report && menu.report.active && menu.report.reports && role.refAuthorize.showReport) {
          this.reportService.getList(undefined, role.refCompany).subscribe(response => {
            if (response.code === ResponseCode.Success) {
              if (response.data && response.data.length) {
                if (response.data.find(element => {
                  return element.active;
                })) {
                  let menuReport: NbMenuItem[];
                  menuReport = [];
                  // group
                  MENU.MENU_REPORT.forEach(element => {
                    menuReport.push(element);
                  });
                  // children
                  menuReport[1].children = [];
                  if (response.data.find(element => {
                    return element.active && element.refReport.code === 'REPORT_01';
                  })) {
                    menuReport[1].children.push(MENU.MENU_REPORT_CHILD[0]);
                  }
                  if (response.data.find(element => {
                    return element.active && element.refReport.code === 'REPORT_02';
                  })) {
                    menuReport[1].children.push(MENU.MENU_REPORT_CHILD[1]);
                  }
                  if (response.data.find(element => {
                    return element.active && element.refReport.code === 'REPORT_03';
                  })) {
                    menuReport[1].children.push(MENU.MENU_REPORT_CHILD[2]);
                  }
                  menuReport.forEach(element => {
                    this.menu.push(element);
                  });
                }
              }
            }
          });
        }
      }
    }
    // Configuration
    if (role && role.refAuthorize && role.refAuthorize.configuration) {
      const configuration = role.refAuthorize.configuration;
      if ((configuration.company && configuration.company.visible)
        || (configuration.companyType && configuration.companyType.visible)
        || (configuration.department && configuration.department.visible)
        || (configuration.division && configuration.division.visible)
        || (configuration.authorize && configuration.authorize.visible)
        || (configuration.user && configuration.user.visible)
        || (configuration.jobPosition && configuration.jobPosition.visible)
        || (configuration.examOnline && configuration.examOnline.visible)
        || (configuration.evaluation && configuration.evaluation.visible)
        || (configuration.location && configuration.location.visible)
        || (configuration.mailTemplate && configuration.mailTemplate.visible)
        || (configuration.rejection && configuration.rejection.visible)
        || (configuration.dashboard && configuration.dashboard.visible)
        || (configuration.report && configuration.report.visible)
      ) {
        let menuSetting: NbMenuItem[];
        menuSetting = [];
        // group
        MENU.MENU_SETTING.forEach(element => {
          menuSetting.push(element);
        });
        // children
        menuSetting[1].children = [];
        if (configuration.companyType && configuration.companyType.visible) {
          menuSetting[1].children.push(MENU.MENU_SETTING_CHILD[0]);
        }
        if (configuration.company && configuration.company.visible) {
          menuSetting[1].children.push(MENU.MENU_SETTING_CHILD[1]);
        }
        if (configuration.department && configuration.department.visible) {
          menuSetting[1].children.push(MENU.MENU_SETTING_CHILD[2]);
        }
        // if (configuration.division && configuration.division.visible) {
        //   menuSetting[1].children.push(MENU.MENU_SETTING_CHILD[3]);
        // }
        if (configuration.authorize && configuration.authorize.visible) {
          menuSetting[1].children.push(MENU.MENU_SETTING_CHILD[4]);
        }
        if (configuration.user && configuration.user.visible) {
          menuSetting[1].children.push(MENU.MENU_SETTING_CHILD[5]);
        }
        if (configuration.jobPosition && configuration.jobPosition.visible) {
          menuSetting[1].children.push(MENU.MENU_SETTING_CHILD[6]);
        }
        if (configuration.examOnline && configuration.examOnline.visible) {
          menuSetting[1].children.push(MENU.MENU_SETTING_CHILD[16]);
        }
        if (configuration.examOnline && configuration.examOnline.visible) {
          menuSetting[1].children.push(MENU.MENU_SETTING_CHILD[15]);
        }
        if (configuration.evaluation && configuration.evaluation.visible) {
          menuSetting[1].children.push(MENU.MENU_SETTING_CHILD[7]);
        }
        if (configuration.location && configuration.location.visible) {
          menuSetting[1].children.push(MENU.MENU_SETTING_CHILD[8]);
        }
        if (configuration.mailTemplate && configuration.mailTemplate.visible) {
          menuSetting[1].children.push(MENU.MENU_SETTING_CHILD[9]);
        }
        if (configuration.rejection && configuration.rejection.visible) {
          menuSetting[1].children.push(MENU.MENU_SETTING_CHILD[10]);
          menuSetting[1].children.push(MENU.MENU_SETTING_CHILD[11]);
        }
        if (configuration.dashboard && configuration.dashboard.visible) {
          menuSetting[1].children.push(MENU.MENU_SETTING_CHILD[12]);
        }
        if (configuration.report && configuration.report.visible) {
          menuSetting[1].children.push(MENU.MENU_SETTING_CHILD[13]);
        }
        if (configuration.blacklist && configuration.blacklist.visible && !role.refHero.isSuperAdmin) {
          menuSetting[1].children.push(MENU.MENU_SETTING_CHILD[14]);
        }
        // is Super Admin
        if (role.refHero.isSuperAdmin) {
          menuSetting[1].children.push({
            title: 'Contact List',
            link: '/employer/setting/contact-list',
            hidden: false,
          });
        }

        menuSetting.forEach(element => {
          this.menu.push(element);
        });
      }
    }
  }
}
