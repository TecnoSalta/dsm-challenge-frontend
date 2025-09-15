import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { Credentials } from '../../domain/models/credentials.model';
import { User } from '../../domain/models/user.model';
import { RegisterRequest } from '../../domain/models/register-request.model';

@Injectable({
  providedIn: 'root',
})
export class InMemoryAuthRepository extends AuthRepository {
  login(credentials: Credentials): Observable<{ token: string }> {
    if (credentials.email === 'test@test.com' && credentials.password === 'password') {
      // Simulate a network delay
      return of({ token: 'fake-jwt-token' }).pipe(delay(1000));
    }
    return throwError(() => new Error('Invalid credentials'));
  }

  register(request: RegisterRequest): Observable<{ token: string }> {
    if (request.email && request.password && request.firstName && request.lastName) {
      // Simulate a network delay and successful registration
      return of({ token: 'fake-jwt-token-for-new-user' }).pipe(delay(1000));
    }
    return throwError(() => new Error('Invalid registration data'));
  }

  getProfile(): Observable<User> {
    const mockUser: User = {
      id: '1',
      email: 'test@test.com',
      fullName: 'Test User',
    };
    // Simulate a network delay
    return of(mockUser).pipe(delay(500));
  }
}
