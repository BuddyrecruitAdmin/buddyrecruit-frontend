import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ModulesComponent } from './modules.component';
import { IndexComponent } from './index/index.component';
import { AppFormComponent } from './app-form/app-form.component';
import { ExamFormComponent } from './exam-form/exam-form.component';
import { ResumeComponent } from './resume/resume.component';
import { FeaturesComponent } from './features/features.component';
import { PdpaComponent } from './pdpa/pdpa.component';
import { GalleryComponent } from '../pages/gallery/gallery.component';
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
        path: 'resume',
        component: ResumeComponent,
      },
      {
        path: 'pdpa',
        component: PdpaComponent,
      },
      {
        path: 'file/:name',
        component: GalleryComponent,
      },
      {
        path: 'blog',
        loadChildren: () => import('./blog/blog.module')
          .then(m => m.BlogModule),
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
