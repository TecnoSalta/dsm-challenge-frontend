import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RentalStoreService } from '../../../application/services/rental-store.service';
import { Rental } from '../../../domain/models/rental.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router'; // Add Router and RouterModule
import { Car } from '../../../domain/models/car.model'; // Add this import

import { AuthStoreService } from '../../../application/services/auth-store.service';

@Component({
  selector: 'app-rental-confirmation',
  templateUrl: './rental-confirmation.component.html',
  styleUrls: ['./rental-confirmation.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    RouterModule
  ]
})
export class RentalConfirmationComponent implements OnInit {
  private readonly _rentalDetails = signal<Rental | null>(null);
  rentalDetails = this._rentalDetails.asReadonly();

  private readonly _selectedCar = signal<Car | null>(null);
  selectedCar = this._selectedCar.asReadonly();

  private rentalStoreService = inject(RentalStoreService);
  private router = inject(Router);
  public readonly authStore = inject(AuthStoreService);

  ngOnInit(): void {
    const state = this.rentalStoreService.getRentalFormState()();
    console.log('Rental-confirmation Retrieved rental form state:', state);
    if (state.id && state.selectedCar && state.startDate && state.endDate && state.status) {
      this._selectedCar.set(state.selectedCar); // Assign selectedCar
      this._rentalDetails.set({
        id: state.id,
        
        carId: state.selectedCar.id,
        startDate: state.startDate,
        endDate: state.endDate,
        status: state.status
      });
    } else {
      console.log('No rental details found in state.');
      // Redirect to home or show error if no rental details are found
      this.router.navigate(['/']);
    }
    // Clear the state after retrieving it
    this.rentalStoreService.clearRentalFormState();
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }
}
