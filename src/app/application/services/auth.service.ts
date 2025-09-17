import { inject, Injectable } from '@angular/core';
import { Observable, of, tap, catchError } from 'rxjs'; 
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
  private readonly authStore = inject(AuthStoreService);
  private readonly authRepository = inject(AuthRepository);

  constructor() {
    // Removed this.getProfile().subscribe() to break circular dependency
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

  getProfile(): Observable<IUserProfile | null> { 
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
    return this.authStore.isAuthenticated();
  }

  getRefreshToken(): string | null {
    return this.authStore.refreshToken();
  }

  logout(): void {
    this.authStore.clearTokens(); // Clear all tokens and profile
    // _user signal is removed, so no need to set it to null
  }
}
