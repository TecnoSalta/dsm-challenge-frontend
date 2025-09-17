import { Injectable, signal } from '@angular/core';

interface CarDto {
  id: number;
  type: string;
  model: string;
  plate: string;
  status: string;
}

interface CustomerDto {
  name: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class RentalStoreService {
  // signals
  startDate = signal<Date | null>(null);
  endDate = signal<Date | null>(null);
  selectedCar = signal<CarDto | null>(null);
  customer = signal<CustomerDto | null>(null);

  // metodos de acciones
  setDates(start: Date, end: Date) {
    this.startDate.set(start);
    this.endDate.set(end);
  }

  setCar(car: CarDto) {
    this.selectedCar.set(car);
  }

  setCustomer(cust: CustomerDto) {
    this.customer.set(cust);
  }

  resetStore() {
    this.startDate.set(null);
    this.endDate.set(null);
    this.selectedCar.set(null);
    this.customer.set(null);
  }
}
