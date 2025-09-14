import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { User } from '../../domain/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class GetProfileUseCase {
  constructor(private authRepository: AuthRepository) {}

  execute(): Observable<User> {
    return this.authRepository.getProfile();
  }
}
