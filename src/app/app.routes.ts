import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { RedirectGuard } from './guards/redirect.guard';

export const routes: Routes = [
  // Ruta pública de autenticación
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth.page').then((m) => m.AuthPage),
    canActivate: [RedirectGuard],
  },
  
  // Dashboard del medidor
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.page').then((m) => m.DashboardPage),
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'medidor' },
  },
  
  // Panel de admin
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin.page').then((m) => m.AdminPage),
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'admin' },
  },
  
  // Ver mediciones (solo admin)
  {
    path: 'admin/measurements',
    loadComponent: () => import('./admin-measurements/admin-measurements.page').then((m) => m.AdminMeasurementsPage),
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'admin' },
  },
  
  // Crear nueva medición (solo medidor)
  {
    path: 'new-measurement',
    loadComponent: () => import('./new-measurement/new-measurement.page').then((m) => m.NewMeasurementPage),
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'medidor' },
  },
  
  // Página de no autorizado
  {
    path: 'unauthorized',
    loadComponent: () => import('./unauthorized/unauthorized.page').then((m) => m.UnauthorizedPage),
  },
  
  // Redirecciones
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'auth',
  },
];