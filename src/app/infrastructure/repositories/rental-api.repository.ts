
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Rental } from '../../domain/models/rental.model';
import { RentalRepository } from '../../domain/repositories/rental.repository';
import { RentalApiService } from './rental-api.service';
import { RegisterRentalRequest } from '../../domain/models/register-rental-request.model';

@Injectable({
  providedIn: 'root',
})
export class RentalApiRepository extends RentalRepository {
  private rentalApiService = inject(RentalApiService);

  create(rental: Rental): Observable<Rental> {
    return this.rentalApiService.create(rental);
  }

  getAll(): Observable<Rental[]> {
    return this.rentalApiService.getAll();
  }

  getById(id: string): Observable<Rental | undefined> {
    return this.rentalApiService.getById(id);
  }

  update(rental: Rental): Observable<Rental> {
    return this.rentalApiService.update(rental);
  }

  delete(id: string): Observable<void> {
    return this.rentalApiService.delete(id);
  }

  registerRental(request: RegisterRentalRequest): Observable<Rental> {
    return this.rentalApiService.registerRental(request);
  }
}
