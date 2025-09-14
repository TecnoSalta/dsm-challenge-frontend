import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Car } from '../../domain/models/car.model';
import { CarRepository } from '../../domain/repositories/car.repository';
import { CARS } from '../data/mock-cars';

@Injectable({
  providedIn: 'root',
})
export class InMemoryCarRepository extends CarRepository {
  getAll(): Observable<Car[]> {
    return of(CARS);
  }

  getById(id: string): Observable<Car | undefined> {
    const car = CARS.find((c) => c.model === id); // Using model as ID for now
    return of(car);
  }
}
