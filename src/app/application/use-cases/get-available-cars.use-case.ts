import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CarRepository } from '../../domain/repositories/car.repository';
import { AvailableCar } from '../../domain/models/available-car.model';
import { AvailabilityRequest } from '../../domain/models/availability-request.model';

@Injectable({
  providedIn: 'root'
})
export class GetAvailableCarsUseCase {

  constructor(private carRepository: CarRepository) { }

  execute(request: AvailabilityRequest): Observable<AvailableCar[]> {
    return this.carRepository.getAvailableCars(request);
  }
}
