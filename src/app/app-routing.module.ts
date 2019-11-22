import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('../app/modules/modules.module')
      .then(m => m.ModulesModule),
  },
  // {
  //   path: 'employer',
  //   loadChildren: () => import('../app/pages/pages.module')
  //     .then(m => m.PagesModule),
  // },
  {
    path: '**',
    redirectTo: '/index',
    pathMatch: 'full'
  },
];

const config: ExtraOptions = {
  useHash: false,
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled',
  scrollOffset: [0, 64],
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
