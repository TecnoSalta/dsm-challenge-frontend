import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CarRepository } from './app/domain/repositories/car.repository';
import { AuthRepository } from './app/domain/repositories/auth.repository';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthService } from './app/application/services/auth.service';
import { authInterceptor } from './app/application/interceptors/auth.interceptor'; // Import authInterceptor
import { httpErrorInterceptor } from './app/application/interceptors/http-error.interceptor';
import { CarApiService } from './app/infrastructure/repositories/car-api.service';
import { RentalRepository } from './app/domain/repositories/rental.repository';
import { RentalApiRepository } from './app/infrastructure/repositories/rental-api.repository';
import { CustomerRepository } from './app/domain/repositories/customer.repository';
import { CustomerApiService } from './app/infrastructure/repositories/customer-api.service';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptors([authInterceptor, httpErrorInterceptor])), // Use authInterceptor
    { provide: CarRepository, useClass: CarApiService },
    { provide: AuthRepository, useClass: AuthService },
    { provide: RentalRepository, useClass: RentalApiRepository },
    { provide: CustomerRepository, useClass: CustomerApiService },
  ],
}).catch((err) => console.error(err));
