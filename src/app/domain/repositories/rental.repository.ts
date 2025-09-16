
import { Observable } from 'rxjs';
import { Rental } from '../models/rental.model';
import { RegisterRentalRequest } from '../models/register-rental-request.model';

export abstract class RentalRepository {
  abstract create(rental: Rental): Observable<Rental>;
  abstract getAll(): Observable<Rental[]>;
  abstract getById(id: string): Observable<Rental | undefined>;
  abstract update(rental: Rental): Observable<Rental>;
  abstract delete(id: string): Observable<void>;
  abstract registerRental(request: RegisterRentalRequest): Observable<Rental>;
}
