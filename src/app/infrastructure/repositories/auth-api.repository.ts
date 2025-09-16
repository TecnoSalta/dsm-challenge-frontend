import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { Credentials } from '../../domain/models/credentials.model';
import { RegisterRequest } from '../../domain/models/register-request.model';
import { AuthResponse } from '../../domain/models/auth-response.model';
import { RefreshTokenRequest } from '../../domain/models/refresh-token-request.model';
import { User } from '../../domain/models/user.model';
import { AuthApiService } from './auth-api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthApiRepository extends AuthRepository {
  private authApiService = inject(AuthApiService);

  login(credentials: Credentials): Observable<AuthResponse> {
    return this.authApiService.login(credentials);
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.authApiService.register(request);
  }

  getProfile(): Observable<User | null> {
    // This would typically involve decoding the JWT or making another API call
    // For now, we'll return null or a dummy user
    return new Observable<User | null>(observer => {
      observer.next(null); // Or a dummy user if needed
      observer.complete();
    });
  }

  isAuthenticated(): boolean {
    // This would typically involve checking for a valid token
    return false; // For now
  }

  refreshToken(request: RefreshTokenRequest): Observable<AuthResponse> {
    return this.authApiService.refreshToken(request);
  }
}
