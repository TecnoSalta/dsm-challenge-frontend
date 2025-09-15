import { Injectable, signal, computed, Signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { Credentials } from '../../domain/models/credentials.model';
import { User } from '../../domain/models/user.model';
import { RegisterRequest } from '../../domain/models/register-request.model';

@Injectable({
  providedIn: 'root',
})
export class InMemoryAuthRepository extends AuthRepository {
  private _user = signal<User | null>(null);
  readonly user: Signal<User | null> = this._user.asReadonly();

  login(credentials: Credentials): Observable<{ token: string }> {
    if (credentials.email === 'test@test.com' && credentials.password === 'password') {
      const mockUser: User = {
        id: '1',
        email: credentials.email,
        fullName: 'Test User',
      };
      return of({ token: 'fake-jwt-token' }).pipe(
        delay(1000),
        tap(() => this._user.set(mockUser))
      );
    }
    return throwError(() => new Error('Invalid credentials'));
  }

  register(request: RegisterRequest): Observable<{ token: string }> {
    if (request.email && request.password && request.firstName && request.lastName) {
      const mockUser: User = {
        id: '2',
        email: request.email,
        fullName: `${request.firstName} ${request.lastName}`,
      };
      return of({ token: 'fake-jwt-token-for-new-user' }).pipe(
        delay(1000),
        tap(() => this._user.set(mockUser))
      );
    }
    return throwError(() => new Error('Invalid registration data'));
  }

  getProfile(): Observable<User | null> {
    // In a real app, this would fetch the user from the backend using the token
    // For now, we'll simulate it.
    if (!this.isAuthenticated()) {
      this._user.set(null);
      return of(null);
    }

    const mockUser: User = {
      id: '1',
      email: 'test@test.com',
      fullName: 'Test User',
    };
    this._user.set(mockUser);
    return of(mockUser);
  }

  isAuthenticated(): boolean {
    return !!this._user();
  }

  logout(): void {
    this._user.set(null);
  }
}
