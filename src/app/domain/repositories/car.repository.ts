import { Observable } from 'rxjs';
import { Car } from '../models/car.model';
import { CarMetadata } from '../models/car-metadata.model';
import { AvailableCar } from '../models/available-car.model';
import { AvailabilityRequest } from '../models/availability-request.model';

export abstract class CarRepository {
  abstract getAll(): Observable<Car[]>;
  abstract getById(id: string): Observable<Car | undefined>;
  abstract getCarMetadata(): Observable<CarMetadata[]>;
  abstract getAvailableCars(request: AvailabilityRequest): Observable<AvailableCar[]>;
}
