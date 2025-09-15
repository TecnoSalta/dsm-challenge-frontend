import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CarRepository } from './app/domain/repositories/car.repository';
import { AuthRepository } from './app/domain/repositories/auth.repository';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from './app/application/services/auth.service';
import { AuthInterceptor } from './app/application/interceptors/auth.interceptor';
import { CarApiService } from './app/infrastructure/repositories/car-api.service';
import { RentalRepository } from './app/domain/repositories/rental.repository';
import { RentalApiRepository } from './app/infrastructure/repositories/rental-api.repository';
import { InMemoryRentalRepository } from './app/infrastructure/repositories/in-memory-rental.repository';
import { CustomerRepository } from './app/domain/repositories/customer.repository'; // Import CustomerRepository
import { CustomerApiService } from './app/infrastructure/repositories/customer-api.service'; // Import CustomerApiService

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: CarRepository, useClass: CarApiService },
    { provide: AuthRepository, useClass: AuthService },
    { provide: RentalRepository, useClass: RentalApiRepository },
    { provide: CustomerRepository, useClass: CustomerApiService }, // Add CustomerRepository provider
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
}).catch((err) => console.error(err));
