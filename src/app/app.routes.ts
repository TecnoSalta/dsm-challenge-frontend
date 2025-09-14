import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./presentation/pages/home/home.component').then(
        (m) => m.HomeComponent
      ),
  },
  {
    path: 'rental-registration',
    loadComponent: () =>
      import(
        './presentation/pages/rental-registration/rental-registration.component'
      ).then((m) => m.RentalRegistrationComponent),
  },
  {
    path: 'rental-management',
    loadComponent: () =>
      import(
        './presentation/pages/rental-management/rental-management.component'
      ).then((m) => m.RentalManagementComponent),
  },
  {
    path: 'statistics',
    loadComponent: () =>
      import('./presentation/pages/statistics/statistics.component').then(
        (m) => m.StatisticsComponent
      ),
  },
  {
    path: 'scheduled-service',
    loadComponent: () =>
      import(
        './presentation/pages/scheduled-service/scheduled-service.component'
      ).then((m) => m.ScheduledServiceComponent),
  },
];
