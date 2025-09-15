import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CarRepository } from '../../domain/repositories/car.repository';
import { Car } from '../../domain/models/car.model';
import { CarMetadata } from '../../domain/models/car-metadata.model';
import { AvailableCar } from '../../domain/models/available-car.model';
import { AvailabilityRequest } from '../../domain/models/availability-request.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CarApiService extends CarRepository {
  private apiUrl = environment.apiUrl + '/Cars';
  private availabilityUrl = environment.apiUrl + '/Availability';

  constructor(private http: HttpClient) {
    super();
  }

  getAll(): Observable<Car[]> {
    // Assuming a backend endpoint for all cars if needed
    return this.http.get<Car[]>(`${this.apiUrl}`);
  }

  getById(id: string): Observable<Car | undefined> {
    // Assuming a backend endpoint for car by ID
    return this.http.get<Car | undefined>(`${this.apiUrl}/${id}`);
  }

  getCarMetadata(): Observable<CarMetadata[]> {
    return this.http.get<CarMetadata[]>(`${this.apiUrl}/metadata`);
  }

  getAvailableCars(request: AvailabilityRequest): Observable<AvailableCar[]> {
    return this.http.get<AvailableCar[]>(`${this.availabilityUrl}/disponibilidad`, { params: request as any });
  }
}
