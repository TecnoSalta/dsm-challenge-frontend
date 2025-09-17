import { Observable } from 'rxjs';
import { Customer } from '../models/customer.model';
import { InjectionToken } from '@angular/core'; // Import InjectionToken

export interface CustomerRepository {
  getCustomerByDni(dni: string): Observable<Customer | undefined>;
}

export const CUSTOMER_REPOSITORY = new InjectionToken<CustomerRepository>('CustomerRepository'); // Define InjectionToken