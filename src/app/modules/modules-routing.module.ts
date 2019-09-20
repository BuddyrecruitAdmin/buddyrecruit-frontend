import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { ModulesComponent } from './modules.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { AppFormComponent } from './app-form/app-form.component';
const routes: Routes = [
  {
    path: '',
    component: ModulesComponent,
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
        path: 'appform/:id',  //cant view
        component: AppFormComponent,
      },
      {
        path: 'appform/:action/:id',// can view
        component: AppFormComponent,
      },
      // {
      //   path: 'layout',
      //   loadChildren: () => import('./layout/layout.module')
      //     .then(m => m.LayoutModule),
      // },
      {
        path: '**',
        redirectTo: 'login'
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
