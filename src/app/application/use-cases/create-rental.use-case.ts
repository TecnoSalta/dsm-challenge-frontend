
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rental } from '../../domain/models/rental.model';
import { RentalRepository } from '../../domain/repositories/rental.repository';

@Injectable({ providedIn: 'root' })
export class CreateRentalUseCase {
  constructor(private rentalRepository: RentalRepository) {}

  execute(rental: Rental): Observable<Rental> {
    return this.rentalRepository.create(rental);
  }
}
