import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { EmployerComponent } from './employer.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { ForgotComponent } from './forgot/forgot.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { RegistrationComponent } from './registration/registration.component';

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
        path: 'registration',
        component: RegistrationComponent
      },
      // {
      //   path: 'registration/:code',
      //   component: RegistrationComponent
      // },
      // {
      //   path: 'registration/:code/:message',
      //   component: RegistrationComponent
      // }
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
