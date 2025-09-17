import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';

export const httpErrorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const injector = inject(Injector);

  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        if (event.status >= 200 && event.status < 300) {
          if (req.method !== 'GET') {
            const successMessage = event.headers.get('X-Success-Message') || 'Operation successful';
            console.log(successMessage);
          }
        }
      }
    }),
    catchError((error: HttpErrorResponse) => {
      const router = injector.get(Router);
      const notificationService = injector.get(NotificationService);
      let errorMessage = 'An unknown error occurred!';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}`;
        console.error(errorMessage);
      } else {
        switch (error.status) {
          case 400:
            if (error.error && error.error.detail) {
              notificationService.show(error.error.detail, 'error');
            }
            errorMessage = typeof error.error === 'string' ? error.error : error.error?.detail || 'Invalid data';
            console.error(errorMessage);
            break;
          
          case 403:
            errorMessage = 'You do not have permission for this action.';
            console.error(errorMessage);
            break;
          case 404:
            errorMessage = 'Resource not found.';
            console.error(errorMessage);
            break;
          case 500:
          case 501:
          case 502:
          case 503:
          case 504:
            errorMessage = 'Server error. Please try again later.';
            console.error(errorMessage);
            break;
          default:
            if (error.status === 0) {
              errorMessage = 'No connection. Please check your network.';
              console.error(errorMessage);
            } else {
              errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
              console.error(errorMessage);
            }
        }
      }
      return throwError(() => error);
    })
  );
};
