import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

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
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/create-post/create-post.component').then(
        (m) => m.CreatePostComponent
      )
  },
  {
    path: 'posts/edit-post/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/edit-post/edit-post.component').then(
        (m) => m.EditPostComponent
      )
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.component').then(m => m.LoginComponent)
  },
  // 👇 Catch-all route
  {
    path: '**',
    redirectTo: 'posts'
  }
];
