import { Injectable, signal, computed, Signal } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { Credentials } from '../../domain/models/credentials.model';
import { User } from '../../domain/models/user.model';
import { RegisterRequest } from '../../domain/models/register-request.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends AuthRepository {
  private apiUrl = environment.apiUrl + '/auth';
  private readonly TOKEN_KEY = 'authToken';

  private _user = signal<User | null>(null);
  readonly user: Signal<User | null> = this._user.asReadonly();

  constructor(private http: HttpClient) {
    super();
    if (this.isAuthenticated()) {
      this.getProfile().subscribe(); // Fetch user on service initialization if authenticated
    }
  }

  login(credentials: Credentials): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.setToken(response.token);
        this.getProfile().subscribe();
      })
    );
  }

  register(request: RegisterRequest): Observable<{ token: string }> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'accept': 'text/plain'
    });
    return this.http.post<{ token: string }>(`${this.apiUrl}/register`, request, { headers }).pipe(
      tap(response => {
        this.setToken(response.token);
        this.getProfile().subscribe();
      })
    );
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
    return !!this.getToken();
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this._user.set(null);
  }
}

