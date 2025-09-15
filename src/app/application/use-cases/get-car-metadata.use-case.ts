import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CarRepository } from '../../domain/repositories/car.repository';
import { CarMetadata } from '../../domain/models/car-metadata.model';

@Injectable({
  providedIn: 'root'
})
export class GetCarMetadataUseCase {

  constructor(private carRepository: CarRepository) { }

  execute(): Observable<CarMetadata[]> {
    return this.carRepository.getCarMetadata();
  }
}
