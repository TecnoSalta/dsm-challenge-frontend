import { Injectable, signal } from '@angular/core';
import { Car } from '../../domain/models/car.model';
import { Customer } from '../../domain/models/customer.model'; // Import Customer

export interface RentalFormState {
  carId: string | null;
  startDate: string | null;
  endDate: string | null;
  selectedCar: Car | null;
  customer: Customer | null; // New property
  id: string | null; // New property for rental ID
  status: string | null; // New property for rental status
}

@Injectable({
  providedIn: 'root',
})
export class RentalStoreService {
  private rentalFormState = signal<RentalFormState>({
    carId: null,
    startDate: null,
    endDate: null,
    selectedCar: null,
    customer: null, // Initialize new property
    id: null, // Initialize new property
    status: null, // Initialize new property
  });

  setRentalFormState(state: Partial<RentalFormState>): void {
    this.rentalFormState.update(current => ({ ...current, ...state }));
  }

  getRentalFormState() {
    return this.rentalFormState.asReadonly();
  }

  clearRentalFormState(): void {
    this.rentalFormState.set({
      carId: null,
      startDate: null,
      endDate: null,
      selectedCar: null,
      customer: null,
      id: null,
      status: null,
    });
  }
}