import { Injectable, signal } from '@angular/core';
import { Car } from 'src/app/domain/models/car.model';
import { Customer } from 'src/app/domain/models/customer.model';

@Injectable({ providedIn: 'root' })
export class RentalStoreService {
  // signals
  startDate = signal<Date | null>(null);
  endDate = signal<Date | null>(null);
  selectedCar = signal<Car | null>(null);
  customer = signal<Customer | null>(null);

  // metodos de acciones
  setDates(start: Date, end: Date) {
    this.startDate.set(start);
    this.endDate.set(end);
  }

  setCar(car: Car) {
    this.selectedCar.set(car);
  }

  setCustomer(cust: Customer) {
    this.customer.set(cust);
  }

  resetStore() {
    this.startDate.set(null);
    this.endDate.set(null);
    this.selectedCar.set(null);
    this.customer.set(null);
  }
}