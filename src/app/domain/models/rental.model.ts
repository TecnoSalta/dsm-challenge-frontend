import { Customer } from './customer.model';

export interface Rental {
  id?: string;
  customer: Customer;
  startDate: string;
  endDate: string;
  carId: string;
  status: string;
}
