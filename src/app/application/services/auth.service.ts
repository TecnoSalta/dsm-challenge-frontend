import { Injectable, signal, Signal } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { Credentials } from '../../domain/models/credentials.model';
import { User } from '../../domain/models/user.model';
import { RegisterRequest } from '../../domain/models/register-request.model';
import { AuthResponse } from '../../domain/models/auth-response.model';
import { RefreshTokenRequest } from '../../domain/models/refresh-token-request.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthStoreService } from './auth-store.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends AuthRepository {
  private apiUrl = environment.apiUrl + '/auth';

  private _user = signal<User | null>(null);
  readonly user: Signal<User | null> = this._user.asReadonly();

  constructor(private http: HttpClient, private authStore: AuthStoreService) {
    super();
    if (this.authStore.accessToken()) {
      this.getProfile().subscribe();
    }
  }

  login(credentials: Credentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.authStore.setTokens(response.token, response.refreshToken); // Use response.token
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
        this.authStore.setTokens(response.token, response.refreshToken); // Use response.token
        this.getProfile().subscribe();
      })
    );
  }

  refreshToken(request: RefreshTokenRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh-token`, request).pipe(
      tap(response => {
        this.authStore.setTokens(response.token, response.refreshToken); // Use response.token
      })
    );
  }

  getProfile(): Observable<User | null> {
    if (!this.authStore.accessToken()) {
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
    return !!this.authStore.accessToken();
  }

  getRefreshToken(): string | null {
    return this.authStore.refreshToken();
  }

  logout(): void {
    this.authStore.clearTokens();
    this._user.set(null);
  }
}