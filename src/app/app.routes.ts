import { Routes } from '@angular/router';
import { roleGuard } from './core/auth/guards/role-guard';

export const routes: Routes = [
  { path: 'auth', loadComponent: () => import('./features/auth/auth').then(m => m.AuthComponent) },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard').then(m => m.DashboardComponent),
    canActivate: [roleGuard]
  },
  {
    path: 'sales',
    loadComponent: () => import('./features/sales/sales').then(m => m.SalesComponent),
    canActivate: [roleGuard]
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin').then(m => m.AdminComponent),
    canActivate: [roleGuard]
  },
  { path: '', redirectTo: 'sales', pathMatch: 'full' },
  { path: '**', redirectTo: 'sales' }
];
