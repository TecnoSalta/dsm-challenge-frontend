
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rental } from '../../domain/models/rental.model';
import { RegisterRentalRequest } from '../../domain/models/register-rental-request.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RentalApiService {
  private apiUrl = environment.apiUrl + '/rentals';
  private http = inject(HttpClient);

  create(rental: Partial<Rental>): Observable<Rental> {
    return this.http.post<Rental>(this.apiUrl, rental);
  }

  getAll(): Observable<Rental[]> {
    return this.http.get<Rental[]>(this.apiUrl);
  }

  getById(id: string): Observable<Rental> {
    return this.http.get<Rental>(`${this.apiUrl}/${id}`);
  }

  update(rental: Partial<Rental>): Observable<Rental> {
    return this.http.put<Rental>(`${this.apiUrl}/${rental.id}`, rental);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  registerRental(request: RegisterRentalRequest): Observable<Rental> {
    return this.http.post<Rental>(this.apiUrl, request);
  }
}
