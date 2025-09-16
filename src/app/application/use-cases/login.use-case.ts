import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { Credentials } from '../../domain/models/credentials.model';

@Injectable({
  providedIn: 'root',
})
export class LoginUseCase {
  private readonly authRepository = inject(AuthRepository);

  execute(credentials: Credentials): Observable<{ token: string }> {
    return this.authRepository.login(credentials);
  }
}
