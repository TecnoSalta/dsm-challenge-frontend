
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rental } from '../../domain/models/rental.model';
import { RentalRepository } from '../../domain/repositories/rental.repository';

@Injectable({ providedIn: 'root' })
export class GetRentalByIdUseCase {
  constructor(private rentalRepository: RentalRepository) {}

  execute(id: string): Observable<Rental | undefined> {
    return this.rentalRepository.getById(id);
  }
}
