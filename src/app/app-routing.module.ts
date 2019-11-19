import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

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
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
