
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RentalRepository } from '../../domain/repositories/rental.repository';

@Injectable({ providedIn: 'root' })
export class DeleteRentalUseCase {
  constructor(private rentalRepository: RentalRepository) {}

  execute(id: string): Observable<void> {
    return this.rentalRepository.delete(id);
  }
}
