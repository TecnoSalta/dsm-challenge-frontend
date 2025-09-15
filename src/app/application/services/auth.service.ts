import { Injectable } from '@angular/core';
import { Observable, of, tap, catchError } from 'rxjs'; // Added catchError
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { Credentials } from '../../domain/models/credentials.model';
import { RegisterRequest } from '../../domain/models/register-request.model';
import { AuthResponse } from '../../domain/models/auth-response.model';
import { RefreshTokenRequest } from '../../domain/models/refresh-token-request.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthStoreService } from './auth-store.service';
import { ProfileService } from './profile.service'; // Import ProfileService
import { IUserProfile } from '../../domain/models/user-profile.model'; // Import IUserProfile

@Injectable({
  providedIn: 'root',
})
export class AuthService extends AuthRepository {
  private apiUrl = environment.apiUrl + '/auth';

  // Removed _user and user signals, as AuthStoreService will manage user profile

  constructor(
    private http: HttpClient,
    private authStore: AuthStoreService,
    private profileService: ProfileService // Inject ProfileService
  ) {
    super();
    if (this.authStore.accessToken()) {
      this.getProfile().subscribe();
    }
  }

  login(credentials: Credentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.authStore.setTokens(response.token, response.refreshToken);
        this.getProfile().subscribe();
      })
    );
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'accept': 'text/plain'
    });
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request, { headers }).pipe(
      tap(response => {
        this.authStore.setTokens(response.token, response.refreshToken);
        this.getProfile().subscribe();
      })
    );
  }

  refreshToken(request: RefreshTokenRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh-token`, request).pipe(
      tap(response => {
        this.authStore.setTokens(response.token, response.refreshToken);
      })
    );
  }

  getProfile(): Observable<IUserProfile | null> { // Changed return type to IUserProfile | null
    if (!this.authStore.accessToken()) {
      this.authStore.setUserProfile(null); // Clear profile if no access token
      return of(null);
    }

    return this.profileService.getProfile().pipe(
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
    return !!this.authStore.accessToken();
  }

  getRefreshToken(): string | null {
    return this.authStore.refreshToken();
  }

  logout(): void {
    this.authStore.clearTokens(); // Clear all tokens and profile
    // _user signal is removed, so no need to set it to null
  }
}
