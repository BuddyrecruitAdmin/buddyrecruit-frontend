import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ApplicationComponent } from './application.component';
import { ApplicationFormComponent } from './application-form.component';
import { ApplicationFormIndexComponent } from './application-form-index/application-form-index/application-form-index.component';
import { ApplicationFormStatusComponent } from './application-form-status/application-form-status/application-form-status.component';

const routes: Routes = [
  {
    path: '',
    component: ApplicationComponent,
    children: [
      {
        path: 'index/:id',
        component: ApplicationFormIndexComponent,
      },
      {
        path: 'status',
        component: ApplicationFormStatusComponent,
      },
      {
        path: ':action',
        component: ApplicationFormComponent,
      },
      {
        path: ':action/:id',
        component: ApplicationFormComponent,
      }
    ]
  }
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplicationFormRoutingModule {
}
