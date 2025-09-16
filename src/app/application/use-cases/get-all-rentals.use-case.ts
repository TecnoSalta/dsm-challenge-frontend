
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rental } from '../../domain/models/rental.model';
import { RentalRepository } from '../../domain/repositories/rental.repository';

@Injectable({ providedIn: 'root' })
export class GetAllRentalsUseCase {
  private rentalRepository = inject(RentalRepository);

  execute(): Observable<Rental[]> {
    return this.rentalRepository.getAll();
  }
}
