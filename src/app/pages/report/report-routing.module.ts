import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportComponent } from './report.component';
import { CandidateComponent } from './candidate/candidate.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { DetailCandidateComponent } from './detail-candidate/detail-candidate.component';

const routes: Routes = [
  {
    path: '',
    component: ReportComponent,
    children: [
      {
        path: 'candidate',
        component: CandidateComponent,
      },
      {
        path: 'feedback',
        component: FeedbackComponent,
      },
      {
        path: 'detail',
        component: DetailCandidateComponent,
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
export class ReportRoutingModule { }
