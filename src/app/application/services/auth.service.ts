import { inject, Injectable } from '@angular/core';
import { Observable, of, tap, catchError } from 'rxjs'; // Added catchError
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { Credentials } from '../../domain/models/credentials.model';
import { RegisterRequest } from '../../domain/models/register-request.model';
import { AuthResponse } from '../../domain/models/auth-response.model';
import { RefreshTokenRequest } from '../../domain/models/refresh-token-request.model';
import { AuthStoreService } from './auth-store.service';
import { IUserProfile } from '../../domain/models/user-profile.model'; // Import IUserProfile

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authStore = inject(AuthStoreService);
  private authRepository = inject(AuthRepository);

  constructor() {
    if (this.authStore.accessToken()) {
      this.getProfile().subscribe();
    }
  }

  login(credentials: Credentials): Observable<AuthResponse> {
    return this.authRepository.login(credentials).pipe(
      tap(response => {
        this.authStore.setTokens(response);
        this.getProfile().subscribe();
      })
    );
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.authRepository.register(request).pipe(
      tap(response => {
        this.authStore.setTokens(response);
        this.getProfile().subscribe();
      })
    );
  }

  refreshToken(request: RefreshTokenRequest): Observable<AuthResponse> {
    return this.authRepository.refreshToken(request).pipe(
      tap(response => {
        this.authStore.setTokens(response);
      })
    );
  }

  getProfile(): Observable<IUserProfile | null> { // Changed return type to IUserProfile | null
    if (!this.authStore.accessToken()) {
      this.authStore.setUserProfile(null); // Clear profile if no access token
      return of(null);
    }

    return this.authRepository.getProfile().pipe(
      tap(profile => {
        this.authStore.setUserProfile(profile);
      }),
      catchError(error => {
        console.error('Error fetching user profile:', error);
        this.authStore.clearTokens(); // Clear tokens if profile fetch fails (e.g., token invalid)
        return of(null);
      })
    );
  }

  isAuthenticated(): boolean {
    return this.authRepository.isAuthenticated();
  }

  getRefreshToken(): string | null {
    return this.authStore.refreshToken();
  }

  logout(): void {
    this.authStore.clearTokens(); // Clear all tokens and profile
    // _user signal is removed, so no need to set it to null
  }
}
