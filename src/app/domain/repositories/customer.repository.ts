import { Observable } from 'rxjs';
import { Customer } from '../models/customer.model';

export abstract class CustomerRepository {
  abstract getByDni(dni: string): Observable<Customer | undefined>;
  // abstract create(customer: Customer): Observable<Customer>; // If we need to create new customers
}
