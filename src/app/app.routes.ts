import { Routes } from '@angular/router';
import { roleGuard } from './core/auth/guards/role-guard';

export const routes: Routes = [
  { path: 'auth', loadComponent: () => import('./features/auth/auth').then(m => m.AuthComponent) },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard').then(m => m.DashboardComponent),
    canActivate: [roleGuard],
    data: { roles: ['dueña'] }
  },
  {
    path: 'sales',
    loadComponent: () => import('./features/sales/sales').then(m => m.SalesComponent),
    canActivate: [roleGuard],
    data: { roles: ['empleada', 'dueña'] }
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin').then(m => m.AdminComponent),
    canActivate: [roleGuard],
    data: { roles: ['dueña'] }
  },
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth' }
];
