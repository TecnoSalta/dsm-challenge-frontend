import { Customer } from './customer.model';
import { Car } from './car.model';

export interface Rental {
  id?: string;
  customer: Customer;
  startDate: Date;
  endDate: Date;
  car: Car;
}
