import { Observable } from 'rxjs';
import { Credentials } from '../models/credentials.model';
import { User } from '../models/user.model';

export abstract class AuthRepository {
  abstract login(credentials: Credentials): Observable<{token: string}>;
  abstract getProfile(): Observable<User>;
}
