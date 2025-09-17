import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CustomerRepository } from '../../domain/repositories/customer.repository';
import { Customer } from '../../domain/models/customer.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerApiService implements CustomerRepository {
  getCustomerByDni(dni: string): Observable<Customer | undefined> {
    // This is a mock implementation. In a real application, this would make an API call.
    if (dni === '123456789') {
      return of({
        id: 'fd69da50-249c-4297-92f0-7c1ec40384bd',
        dni: '123456789',
        fullName: 'Mock Customer',
        address: '123 Mock Street',
        email: 'mock.customer@example.com',
      });
    }
    return of(undefined);
  }
}