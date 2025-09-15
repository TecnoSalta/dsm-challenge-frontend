import { Injectable, signal, computed, Signal } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { Credentials } from '../../domain/models/credentials.model';
import { User } from '../../domain/models/user.model';
import { RegisterRequest } from '../../domain/models/register-request.model';
import { AuthResponse } from '../../domain/models/auth-response.model';
import { RefreshTokenRequest } from '../../domain/models/refresh-token-request.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends AuthRepository {
  private apiUrl = environment.apiUrl + '/auth';
  private readonly ACCESS_TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';

  private _user = signal<User | null>(null);
  readonly user: Signal<User | null> = this._user.asReadonly();

  constructor(private http: HttpClient) {
    super();
    if (this.isAuthenticated()) {
      this.getProfile().subscribe(); // Fetch user on service initialization if authenticated
    }
  }

  login(credentials: Credentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.setTokens(response.accessToken, response.refreshToken);
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
        this.setTokens(response.accessToken, response.refreshToken);
        this.getProfile().subscribe();
      })
    );
  }

  refreshToken(request: RefreshTokenRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh-token`, request).pipe(
      tap(response => {
        this.setTokens(response.accessToken, response.refreshToken);
      })
    );
  }

  getProfile(): Observable<User | null> {
    // In a real app, this would fetch the user from the backend using the access token
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
    return !!this.getAccessToken();
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  logout(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    this._user.set(null);
  }
}

