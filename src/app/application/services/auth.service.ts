import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { Credentials } from '../../domain/models/credentials.model';
import { User } from '../../domain/models/user.model';
import { RegisterRequest } from '../../domain/models/register-request.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends AuthRepository {
  private apiUrl = environment.apiUrl + '/auth';

  constructor(private http: HttpClient) {
    super();
  }

  login(credentials: Credentials): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials);
  }

  register(request: RegisterRequest): Observable<{ token: string }> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'accept': 'text/plain'
    });
    return this.http.post<{ token: string }>(`${this.apiUrl}/register`, request, { headers });
  }

  getProfile(): Observable<User> {
    // This would typically involve sending a token in the headers
    // For now, returning a mock user
    const mockUser: User = {
      id: '1',
      email: 'test@test.com',
      fullName: 'Test User',
    };
    return of(mockUser);
  }
}