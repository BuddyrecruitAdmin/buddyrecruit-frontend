import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingComponent } from './setting.component';
import { CompanyListComponent } from './company/company-list/company-list.component';
import { CompanyTypeComponent } from './company-type/company-type.component';
import { CompanyDetailComponent } from './company/company-detail/company-detail.component';
import { JobPositionComponent } from './job-position/job-position.component';
import { LocationComponent } from './location/location.component';
import { MailTemplateListComponent } from './mail-template/mail-template-list/mail-template-list.component';
import { MailTemplateDetailComponent } from './mail-template/mail-template-detail/mail-template-detail.component';
import { RejectionComponent } from './rejection/rejection.component';
import { ReportComponent } from './report/report.component';
import { DepartmentListComponent } from './department/department-list/department-list.component';
import { DepartmentDetailComponent } from './department/department-detail/department-detail.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { UserDetailComponent } from './user/user-detail/user-detail.component';
import { AuthorizeListComponent } from './authorize/authorize-list/authorize-list.component';
import { AuthorizeDetailComponent } from './authorize/authorize-detail/authorize-detail.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RejectStageComponent } from './reject-stage/reject-stage.component';
import { EvaluationDetailComponent } from './evaluation/evaluation-detail/evaluation-detail.component';
import { EvaluationListComponent } from './evaluation/evaluation-list/evaluation-list.component';
import { BlacklistComponent } from './blacklist/blacklist.component';
import { ExanOnlineListComponent } from './exam-online/exan-online-list/exan-online-list.component';
import { ExanOnlineDetailComponent } from './exam-online/exan-online-detail/exan-online-detail.component';

import { ContactUsComponent } from './contact-us/contact-us.component';

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
        component: DepartmentListComponent,
      },
      {
        path: 'department-detail',
        component: DepartmentDetailComponent,
      },
      {
        path: 'department-detail/:id',
        component: DepartmentDetailComponent,
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
        component: MailTemplateListComponent,
      },
      {
        path: 'mail-template-detail',
        component: MailTemplateDetailComponent,
      },
      {
        path: 'mail-template-detail/:id',
        component: MailTemplateDetailComponent,
      },
      {
        path: 'exam-online',
        component: ExanOnlineListComponent,
      },
      {
        path: 'exam-online/:action',
        component: ExanOnlineDetailComponent,
      },
      {
        path: 'exam-online/:action/:id',
        component: ExanOnlineDetailComponent,
      },
      {
        path: 'evaluation',
        component: EvaluationListComponent,
      },
      {
        path: 'evaluation-detail/:action',
        component: EvaluationDetailComponent,
      },
      {
        path: 'evaluation-detail/:action/:id',
        component: EvaluationDetailComponent,
      },
      {
        path: 'rejection',
        component: RejectionComponent,
      },
      {
        path: 'reject-stage',
        component: RejectStageComponent,
      },
      {
        path: 'report',
        component: ReportComponent,
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'user',
        component: UserListComponent,
      },
      {
        path: 'user-detail',
        component: UserDetailComponent,
      },
      {
        path: 'user-detail/:id',
        component: UserDetailComponent,
      },
      {
        path: 'authorize',
        component: AuthorizeListComponent,
      },
      {
        path: 'authorize/:action',
        component: AuthorizeDetailComponent,
      },
      {
        path: 'authorize/:action/:id',
        component: AuthorizeDetailComponent,
      },
      {
        path: 'blacklist',
        component: BlacklistComponent,
      },
      {
        path: 'contact-list',
        component: ContactUsComponent,
      },
      {
        path: '**',
        redirectTo: '/employer/home',
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
