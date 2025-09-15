
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Rental } from '../../domain/models/rental.model';
import { RentalRepository } from '../../domain/repositories/rental.repository';

@Injectable({
  providedIn: 'root',
})
export class InMemoryRentalRepository extends RentalRepository {
  private rentals: (Rental & { id: string })[] = [];
  private nextId = 1;

  create(rental: Rental): Observable<Rental> {
    const newRental = { ...rental, id: this.nextId.toString() };
    this.nextId++;
    this.rentals.push(newRental);
    return of(newRental);
  }

  getAll(): Observable<Rental[]> {
    return of(this.rentals);
  }

  getById(id: string): Observable<Rental | undefined> {
    const rental = this.rentals.find((r) => r.id === id);
    return of(rental);
  }

  update(updatedRental: Rental & { id: string }): Observable<Rental> {
    const index = this.rentals.findIndex((r) => r.id === updatedRental.id);
    if (index !== -1) {
      this.rentals[index] = updatedRental;
      return of(updatedRental);
    }
    return throwError(() => new Error('Rental not found'));
  }

  delete(id: string): Observable<void> {
    const index = this.rentals.findIndex((r) => r.id === id);
    if (index !== -1) {
      this.rentals.splice(index, 1);
      return of(undefined);
    }
    return throwError(() => new Error('Rental not found'));
  }
}
