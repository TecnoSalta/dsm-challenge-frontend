import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rental } from '../../domain/models/rental.model';
import { RentalRepository } from '../../domain/repositories/rental.repository';
import { RegisterRentalRequest } from '../../domain/models/register-rental-request.model';

@Injectable({ providedIn: 'root' })
export class RegisterRentalUseCase {
  private rentalRepository = inject(RentalRepository);

  execute(request: RegisterRentalRequest): Observable<Rental> {
    return this.rentalRepository.registerRental(request);
  }
}
