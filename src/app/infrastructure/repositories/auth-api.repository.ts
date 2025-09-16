import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { Credentials } from '../../domain/models/credentials.model';
import { RegisterRequest } from '../../domain/models/register-request.model';
import { AuthResponse } from '../../domain/models/auth-response.model';
import { RefreshTokenRequest } from '../../domain/models/refresh-token-request.model';
import { User } from '../../domain/models/user.model';
import { AuthApiService } from './auth-api.service';
import { IUserProfile } from '../../domain/models/user-profile.model';

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

  getProfile(): Observable<IUserProfile | null> {
    return this.authApiService.getProfile();
  }

  refreshToken(request: RefreshTokenRequest): Observable<AuthResponse> {
    return this.authApiService.refreshToken(request);
  }
}

