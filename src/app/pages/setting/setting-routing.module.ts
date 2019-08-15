import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingComponent } from './setting.component';
import { CompanyListComponent } from './company/company-list/company-list.component';
import { CompanyTypeComponent } from './company-type/company-type.component';
import { CompanyDetailComponent } from './company/company-detail/company-detail.component';
import { DepartmentComponent } from './department/department.component';
import { JobPositionComponent } from './job-position/job-position.component';
import { LocationComponent } from './location/location.component';
import { MailTemplateComponent } from './mail-template/mail-template.component';
import { RejectionComponent } from './rejection/rejection.component';
import { ReportComponent } from './report/report.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  {
    path: '',
    component: SettingComponent,
    children: [
      {
        path: 'company-type',
        component: CompanyTypeComponent,
      },
      {
        path: 'company',
        component: CompanyListComponent,
      },
      {
        path: 'company-detail',
        component: CompanyDetailComponent,
      },
      {
        path: 'company-detail/:id',
        component: CompanyDetailComponent,
      },
      {
        path: 'department',
        component: DepartmentComponent,
      },
      {
        path: 'job-position',
        component: JobPositionComponent,
      },
      {
        path: 'location',
        component: LocationComponent,
      },
      {
        path: 'mail-template',
        component: MailTemplateComponent,
      },
      {
        path: 'rejection',
        component: RejectionComponent,
      },
      {
        path: 'report',
        component: ReportComponent,
      },
      {
        path: 'user',
        component: UserComponent,
      },
      {
        path: '**',
        redirectTo: '/auth/login',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule { }
