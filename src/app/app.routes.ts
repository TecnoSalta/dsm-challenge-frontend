import { Routes } from '@angular/router';

import { authGuard } from './application/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Home principal
  { path: 'home', loadComponent: () => import('./presentation/pages/home/home.component').then(m => m.HomeComponent) },

  // Flujo de renta (stepper en un solo contenedor)
  { path: 'rental', loadComponent: () => import('./presentation/pages/rental-stepper/rental-stepper.component').then(m => m.RentalStepperComponent) },

  // Otras vistas del sistema
  { path: 'rental-management', loadComponent: () => import('./presentation/pages/rental-management/rental-management.component').then(m => m.RentalManagementComponent) },  // modificación/cancelación
  { path: 'statistics', loadComponent: () => import('./presentation/pages/statistics/statistics.component').then(m => m.StatisticsComponent) },
  { path: 'scheduled-service', loadComponent: () => import('./presentation/pages/scheduled-service/scheduled-service.component').then(m => m.ScheduledServiceComponent) },
  { path: 'login', loadComponent: () => import('./presentation/pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./presentation/pages/register/register.component').then(m => m.RegisterComponent) },
  { path: 'profile', loadComponent: () => import('./presentation/pages/profile/profile.component').then(m => m.ProfileComponent), canActivate: [authGuard] },

  { path: '**', redirectTo: 'home' }
];
