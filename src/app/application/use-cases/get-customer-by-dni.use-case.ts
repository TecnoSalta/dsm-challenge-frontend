import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../../domain/models/customer.model';
import { CustomerRepository } from '../../domain/repositories/customer.repository';

@Injectable({
  providedIn: 'root',
})
export class GetCustomerByDniUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  execute(dni: string): Observable<Customer | undefined> {
    return this.customerRepository.getByDni(dni);
  }
}
