import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CarRepository } from './app/domain/repositories/car.repository';
import { InMemoryCarRepository } from './app/infrastructure/repositories/in-memory-car.repository';
import { AuthRepository } from './app/domain/repositories/auth.repository';
import { InMemoryAuthRepository } from './app/infrastructure/repositories/in-memory-auth.repository';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    { provide: CarRepository, useClass: InMemoryCarRepository },
    { provide: AuthRepository, useClass: InMemoryAuthRepository },
  ],
}).catch((err) => console.error(err));