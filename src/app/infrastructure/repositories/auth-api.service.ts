import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, catchError, retry, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Credentials } from '../../domain/models/credentials.model';
import { RegisterRequest } from '../../domain/models/register-request.model';
import { AuthResponse } from '../../domain/models/auth-response.model';
import { RefreshTokenRequest } from '../../domain/models/refresh-token-request.model';
import { IUserProfile } from '../../domain/models/user-profile.model';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly baseUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);
  
  // Cache para el perfil de usuario
  private userProfileCache: Observable<IUserProfile> | null = null;

  login(credentials: Credentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        catchError(this.handleError('login'))
      );
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request)
      .pipe(
        catchError(this.handleError('register'))
      );
  }

  getProfile(forceRefresh = false): Observable<IUserProfile> {
    // Si forzamos refresco o no hay cache, hacemos la petición
    if (forceRefresh || !this.userProfileCache) {
      this.userProfileCache = this.http.get<IUserProfile>(`${this.baseUrl}/profile/me`)
        .pipe(
          retry(1),
          shareReplay(1),
          catchError(this.handleError('getProfile'))
        );
    }
    
    return this.userProfileCache;
  }

  refreshToken(request: RefreshTokenRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh-token`, request)
      .pipe(
        catchError(this.handleError('refreshToken'))
      );
  }

  // Limpiar cache del perfil
  clearProfileCache(): void {
    this.userProfileCache = null;
  }

  // Manejo centralizado de errores
  private handleError(operation = 'operation') {
    return (error: HttpErrorResponse): Observable<never> => {
      let errorMessage = `Error en ${operation}: `;
      
      if (error.error instanceof ErrorEvent) {
        // Error del lado del cliente
        errorMessage += `Error: ${error.error.message}`;
      } else {
        // Error del lado del servidor
        errorMessage += `Código: ${error.status}, Mensaje: ${error.message}`;
        
        // Lógica específica según el código de error
        if (error.status === 401) {
          console.error('No autorizado - redirigiendo al login');
        } else if (error.status === 403) {
          console.error('Acceso prohibido');
        }
      }
      
      console.error(errorMessage);
      return throwError(() => new Error(errorMessage));
    };
  }
}