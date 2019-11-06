import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { JobseekerComponent } from './jobseeker.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { ForgotComponent } from './forgot/forgot.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

const routes: Routes = [
  {
    path: '',
    component: JobseekerComponent,
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
        path: '**',
        redirectTo: '/jobseeker/login',
        pathMatch: 'full'
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JobseekerRoutingModule {
}
