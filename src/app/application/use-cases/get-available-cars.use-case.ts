import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CarRepository } from '../../domain/repositories/car.repository';
import { AvailableCar } from '../../domain/models/available-car.model';
import { AvailabilityRequest } from '../../domain/models/availability-request.model';

@Injectable({
  providedIn: 'root'
})
export class GetAvailableCarsUseCase {

  private carRepository = inject(CarRepository);

  execute(request: AvailabilityRequest): Observable<AvailableCar[]> {
    return this.carRepository.getAvailableCars(request);
  }
}
