
import { Routes } from '@angular/router';

import { Layout } from './layout/layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { Login } from './pages/login/login';
import { Reportes } from './pages/reportes/reportes';
import { authGuard } from './core/guards/auth.guard';
import { Administracion } from './pages/administracion/administracion';

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
        path: 'reportes/nuevo',
        component: Reportes,
      },
      {
         path: 'reportes',
         component: Reportes,
      },
      {
         path: 'usuarios',
         component: Administracion,
         data: { titulo: 'Usuarios' }
      },
      {
         path: 'tecnicos',
         component: Administracion,
         data: { titulo: 'Técnicos' }
      },
      {
         path: 'categorias',
         component: Administracion,
         data: { titulo: 'Categorías' }
      },
      {
         path: 'ubicaciones',
         component: Administracion,
         data: { titulo: 'Ubicaciones' }
      },
      {
         path: 'historial',
         component: Administracion,
         data: { titulo: 'Historial' }
      },
      {
         path: 'reportes/asignados',
         component: Reportes
      },
      {
         path: 'perfil',
         component: Administracion,
         data: { titulo: 'Mi perfil' }
      },
     
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
