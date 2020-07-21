import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { BlogComponent } from './blog.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { BlogListComponent } from './blog-list/blog-list.component';
const routes: Routes = [
  {
    path: '',
    component: BlogComponent,
    children: [
      {
        path: ':action',
        component: BlogDetailComponent,
      },
      {
        path: ':action/:id',
        component: BlogDetailComponent,
      },
      {
        path: '',
        component: BlogListComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlogRoutingModule {
}
