import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { RefreshTokenRequest } from '../../domain/models/refresh-token-request.model';
import { AuthStoreService } from '../services/auth-store.service';
import { inject } from '@angular/core';
import { AuthInterceptorService } from '../services/auth-interceptor.service';

export function authInterceptor(request: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
  const authService = inject(AuthService);
  const router = inject(Router);
  const authStore = inject(AuthStoreService);
  const authInterceptorService = inject(AuthInterceptorService);

  const addToken = (req: HttpRequest<any>, token: string) => {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  };

  const handle401Error = (req: HttpRequest<any>, handler: HttpHandlerFn) => {
    if (!authInterceptorService.isRefreshing) {
      authInterceptorService.isRefreshing = true;
      authInterceptorService.refreshTokenSubject.next(null);

      const accessToken = authStore.accessToken();
      const refreshToken = authStore.refreshToken();

      if (accessToken && refreshToken) {
        const refreshRequest: RefreshTokenRequest = {
          accessToken: accessToken,
          refreshToken: refreshToken
        };
        return authService.refreshToken(refreshRequest).pipe(
          switchMap((response: any) => {
            authInterceptorService.isRefreshing = false;
            authStore.setTokens(response);
            authInterceptorService.refreshTokenSubject.next(response.accessToken);
            return handler(addToken(req, response.accessToken)); // Fixed: call handler directly
          }),
          catchError((err: any) => {
            authInterceptorService.isRefreshing = false;
            authStore.clearTokens();
            authService.logout();
            router.navigate(['/login']);
            return throwError(err);
          })
        );
      } else {
        authStore.clearTokens();
        authService.logout();
        router.navigate(['/login']);
        return throwError('No refresh token available');
      }
    } else {
      return authInterceptorService.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(jwt => {
          return handler(addToken(req, jwt)); // Fixed: call handler directly
        })
      );
    }
  };

  const token = authStore.accessToken();
  if (token) {
    request = addToken(request, token);
  }

  return next(request).pipe(catchError(error => { // Fixed: call next directly
    if (error instanceof HttpErrorResponse && error.status === 401) {
      return handle401Error(request, next);
    }
    return throwError(error);
  }));
}
