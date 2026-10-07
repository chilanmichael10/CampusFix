
import { Routes } from '@angular/router';

import { Layout } from './layout/layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { Login } from './pages/login/login';
import { Reportes } from './pages/reportes/reportes';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: Dashboard,
      },
      {
        path: 'reportes',
        component: Reportes,
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
