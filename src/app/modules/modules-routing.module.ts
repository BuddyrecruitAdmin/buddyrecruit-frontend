import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { ModulesComponent } from './modules.component';
import { IndexComponent } from './index/index.component';

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
