
import { inject, Injectable } from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs'; // Import combineLatest and map
import { RentalRepository } from '../../domain/repositories/rental.repository';
import { GetAllCarsUseCase } from './get-all-cars.use-case'; // Import GetAllCarsUseCase
import { Car } from '../../domain/models/car.model'; // Import Car
import { RentalWithCar } from '../../domain/models/rental-with-car.model'; // Import RentalWithCar

@Injectable({ providedIn: 'root' })
export class GetAllRentalsUseCase {
  private rentalRepository = inject(RentalRepository);
  private getAllCarsUseCase = inject(GetAllCarsUseCase); // Inject GetAllCarsUseCase

  execute(): Observable<RentalWithCar[]> { // Change return type to RentalWithCar[]
    const allRentals$ = this.rentalRepository.getAll();
    const allCars$ = this.getAllCarsUseCase.execute();

    return combineLatest([allRentals$, allCars$]).pipe(
      map(([rentals, cars]) => {
        const carMap = new Map<string, Car>();
        cars.forEach(car => carMap.set(car.id, car));

        return rentals.map(rental => ({
          ...rental,
          carDetails: carMap.get(rental.carId)! // Assuming carId will always have a matching car
        }));
      })
    );
  }
}
