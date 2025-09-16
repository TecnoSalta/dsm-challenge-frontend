import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { IUserProfile } from 'src/app/domain/models/user-profile.model';

@Injectable({
  providedIn: 'root',
})
export class GetProfileUseCase {
  private readonly authRepository = inject(AuthRepository);

  execute(): Observable<IUserProfile | null> {
    return this.authRepository.getProfile();
  }
}
