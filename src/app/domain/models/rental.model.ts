import { Customer } from './customer.model';

export interface Rental {
  id?: string;
  customer?: Customer; // Make customer optional
  startDate: string;
  endDate: string;
  carId: string;
  status: string;
}
