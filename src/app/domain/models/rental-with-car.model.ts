import { Rental } from './rental.model';
import { Car } from './car.model';

export interface RentalWithCar extends Rental {
  carDetails: Car;
}
