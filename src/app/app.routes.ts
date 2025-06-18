import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'posts',
    pathMatch: 'full'
  },
  {
    path: 'posts',
    loadComponent: () =>
      import('./features/post-list/post-list.component').then(
        (m) => m.PostListComponent
      )
  },
    {
    path: 'posts/:id',
    loadComponent: () =>
      import('./features/post-detail/post-detail.component').then(
        (m) => m.PostDetailComponent
      )
  },
  {
    path: 'create-post',
    loadComponent: () =>
      import('./features/create-post/create-post.component').then(
        (m) => m.CreatePostComponent
      )
  }
];
