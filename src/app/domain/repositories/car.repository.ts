import { Observable } from 'rxjs';
import { Car } from '../models/car.model';

export abstract class CarRepository {
  abstract getAll(): Observable<Car[]>;
  abstract getById(id: string): Observable<Car | undefined>;
}
