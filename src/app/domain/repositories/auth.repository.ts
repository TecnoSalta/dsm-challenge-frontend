import { Observable } from 'rxjs';
import { Credentials } from '../models/credentials.model';
import { RegisterRequest } from '../models/register-request.model';
import { AuthResponse } from '../models/auth-response.model';
import { RefreshTokenRequest } from '../models/refresh-token-request.model';
import { IUserProfile } from '../models/user-profile.model';

export abstract class AuthRepository {
  abstract login(credentials: Credentials): Observable<AuthResponse>;
  abstract register(request: RegisterRequest): Observable<AuthResponse>;
  abstract getProfile(): Observable<IUserProfile | null>;
  abstract refreshToken(request: RefreshTokenRequest): Observable<AuthResponse>;
}
