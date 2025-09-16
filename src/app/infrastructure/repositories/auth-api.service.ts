import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Credentials } from '../../domain/models/credentials.model';
import { RegisterRequest } from '../../domain/models/register-request.model';
import { AuthResponse } from '../../domain/models/auth-response.model';
import { RefreshTokenRequest } from '../../domain/models/refresh-token-request.model';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private apiUrl = environment.apiUrl + '/auth';
  private http = inject(HttpClient);

  login(credentials: Credentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials);
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request);
  }

  refreshToken(request: RefreshTokenRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh-token`, request);
  }
}
