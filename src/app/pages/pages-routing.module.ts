import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      // {
      //   path: 'dashboard',
      //   component: DashboardComponent,
      // },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module')
          .then(m => m.DashboardModule),
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'setting',
        loadChildren: () => import('./setting/setting.module')
          .then(m => m.SettingModule),
      },
      {
        path: '**',
        redirectTo: '/auth/login',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
