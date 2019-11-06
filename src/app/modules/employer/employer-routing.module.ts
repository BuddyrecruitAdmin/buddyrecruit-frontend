import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { EmployerComponent } from './employer.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { AppFormComponent } from './app-form/app-form.component';
import { ForgotComponent } from './forgot/forgot.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

const routes: Routes = [
  {
    path: '',
    component: EmployerComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'logout',
        component: LogoutComponent,
      },
      {
        path: 'forgot',
        component: ForgotComponent,
      },
      {
        path: 'changepassword/:id',
        component: ChangePasswordComponent,
      },
      {
        path: 'appform/:id',
        component: AppFormComponent,
      },
      {
        path: 'appform/:action/:id',
        component: AppFormComponent,
      },
    ],
  },
  {
    path: '',
    loadChildren: () => import('../../pages/pages.module')
      .then(m => m.PagesModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployerRoutingModule {
}
