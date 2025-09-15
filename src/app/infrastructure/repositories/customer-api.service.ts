import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../../domain/models/customer.model';
import { CustomerRepository } from '../../domain/repositories/customer.repository';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CustomerApiService extends CustomerRepository {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getByDni(dni: string): Observable<Customer | undefined> {
    return this.http.get<Customer>(`${this.apiUrl}/Customers/${dni}`);
  }

  // If we need to create new customers via API
  // create(customer: Customer): Observable<Customer> {
  //   return this.http.post<Customer>(`${this.apiUrl}/Customers`, customer);
  // }
}
