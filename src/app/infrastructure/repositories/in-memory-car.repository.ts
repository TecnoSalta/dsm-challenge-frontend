import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Car } from '../../domain/models/car.model';
import { CarRepository } from '../../domain/repositories/car.repository';
import { CARS } from '../data/mock-cars';
import { CarMetadata } from '../../domain/models/car-metadata.model';
import { AvailableCar } from '../../domain/models/available-car.model';
import { AvailabilityRequest } from '../../domain/models/availability-request.model';

@Injectable({
  providedIn: 'root',
})
export class InMemoryCarRepository extends CarRepository {
  getAll(): Observable<Car[]> {
    return of(CARS);
  }

  getById(id: string): Observable<Car | undefined> {
    const car = CARS.find((c) => c.id === id);
    return of(car);
  }

  getCarMetadata(): Observable<CarMetadata[]> {
    const metadata: CarMetadata[] = [];
    const carTypes = new Set<string>();

    CARS.forEach(car => {
      if (!carTypes.has(car.type)) {
        carTypes.add(car.type);
        metadata.push({ type: car.type, models: [] });
      }
      const typeIndex = metadata.findIndex(m => m.type === car.type);
      if (typeIndex !== -1) {
        metadata[typeIndex].models.push(car.model);
      }
    });
    return of(metadata);
  }

  getAvailableCars(request: AvailabilityRequest): Observable<AvailableCar[]> {
    // Simulate availability based on request parameters
    let availableCars: AvailableCar[] = CARS.map(car => ({
      id: car.id,
      type: car.type,
      model: car.model,
      dailyRate: car.dailyRate
    }));

    if (request.carType) {
      availableCars = availableCars.filter(car => car.type.toLowerCase() === request.carType?.toLowerCase());
    }

    if (request.model) {
      availableCars = availableCars.filter(car => car.model.toLowerCase() === request.model?.toLowerCase());
    }

    // For simplicity, date range is not fully implemented in mock
    // In a real scenario, you'd check against existing rentals for the date range

    return of(availableCars);
  }
}
