import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { ModulesComponent } from './modules.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';

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
