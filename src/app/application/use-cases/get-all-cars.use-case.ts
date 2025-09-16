import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Car } from '../../domain/models/car.model';
import { CarRepository } from '../../domain/repositories/car.repository';

@Injectable({
  providedIn: 'root',
})
export class GetAllCarsUseCase {
  private carRepository = inject(CarRepository);

  execute(): Observable<Car[]> {
    return this.carRepository.getAll();
  }
}
