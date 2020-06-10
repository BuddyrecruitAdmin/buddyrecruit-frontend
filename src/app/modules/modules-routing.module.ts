import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { ModulesComponent } from './modules.component';
import { IndexComponent } from './index/index.component';
import { AppFormComponent } from './app-form/app-form.component';
import { ExamFormComponent } from './exam-form/exam-form.component';
import { ResumeComponent } from './resume/resume.component';
import { ApplicationFormComponent } from './application-form/application-form.component';
import { HomeComponent } from './home/home.component';
import { FeaturesComponent } from './features/features.component';
import { BlogListComponent } from './blog/blog-list/blog-list.component';
import { BlogDetailComponent } from './blog/blog-detail/blog-detail.component';
import { PdpaComponent } from './pdpa/pdpa.component';
const routes: Routes = [
  {
    path: '',
    component: ModulesComponent,
    children: [
      {
        path: 'index',
        component: IndexComponent,
      },
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'features',
        component: FeaturesComponent,
      },
      {
        path: 'appform/:id',
        component: AppFormComponent,
      },
      {
        path: 'appform/:action/:id',
        component: AppFormComponent,
      },
      {
        path: 'exam-form/:examId/:id',
        component: ExamFormComponent,
      },
      {
        path: 'exam-form/:action/:examId/:id',
        component: ExamFormComponent,
      },
      {
        path: 'application-form/:action',
        component: ApplicationFormComponent,
      },
      {
        path: 'application-form/:action/:id',
        component: ApplicationFormComponent,
      },
      {
        path: 'resume',
        component: ResumeComponent,
      },
      {
        path: 'blog',
        component: BlogListComponent,
      },
      {
        path: 'blog/:action',
        component: BlogDetailComponent,
      },
      {
        path: 'blog/:action/:id',
        component: BlogDetailComponent,
      },
      {
        path: 'pdpa',
        component: PdpaComponent,
      },
      {
        path: 'employer',
        loadChildren: () => import('./employer/employer.module')
          .then(m => m.EmployerModule),
      },
      {
        path: 'jobseeker',
        loadChildren: () => import('./jobseeker/jobseeker.module')
          .then(m => m.JobseekerModule),
      },
      {
        path: '**',
        redirectTo: '/index',
        pathMatch: 'full'
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModulesRoutingModule {
}
