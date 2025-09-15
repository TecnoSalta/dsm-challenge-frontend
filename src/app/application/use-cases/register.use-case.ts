import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { RegisterRequest } from '../../domain/models/register-request.model';
import { AuthResponse } from '../../domain/models/auth-response.model';

@Injectable({
  providedIn: 'root'
})
export class RegisterUseCase {

  constructor(private authRepository: AuthRepository) { }

  execute(request: RegisterRequest): Observable<AuthResponse> {
    return this.authRepository.register(request);
  }
}
