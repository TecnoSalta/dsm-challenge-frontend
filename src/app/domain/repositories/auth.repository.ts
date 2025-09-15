import { Observable } from 'rxjs';
import { Credentials } from '../models/credentials.model';
import { User } from '../models/user.model';
import { RegisterRequest } from '../models/register-request.model';
import { AuthResponse } from '../models/auth-response.model';

export abstract class AuthRepository {
  abstract login(credentials: Credentials): Observable<AuthResponse>;
  abstract register(request: RegisterRequest): Observable<AuthResponse>;
  abstract getProfile(): Observable<User | null>;
  abstract isAuthenticated(): boolean;
}
