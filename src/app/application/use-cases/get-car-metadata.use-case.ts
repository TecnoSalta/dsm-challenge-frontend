import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CarRepository } from '../../domain/repositories/car.repository';
import { CarMetadata } from '../../domain/models/car-metadata.model';

@Injectable({
  providedIn: 'root'
})
export class GetCarMetadataUseCase {

  private carRepository = inject(CarRepository);

  execute(): Observable<CarMetadata[]> {
    return this.carRepository.getCarMetadata();
  }
}
