import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CarRepository } from './app/domain/repositories/car.repository';
import { InMemoryCarRepository } from './app/infrastructure/repositories/in-memory-car.repository';
import { AuthRepository } from './app/domain/repositories/auth.repository';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from './app/application/services/auth.service';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    { provide: CarRepository, useClass: InMemoryCarRepository },
    { provide: AuthRepository, useClass: AuthService },
  ],
}).catch((err) => console.error(err));