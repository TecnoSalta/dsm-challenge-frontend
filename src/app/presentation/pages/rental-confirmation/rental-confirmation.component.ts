import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RentalStoreService } from '../../../application/services/rental-store.service';
import { Rental } from '../../../domain/models/rental.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';

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
  rentalDetails: Rental | null = null;

  private rentalStoreService = inject(RentalStoreService);
  private router = inject(Router);

  ngOnInit(): void {
    const state = this.rentalStoreService.getRentalFormState()();
    if (state.selectedCar && state.carId && state.startDate && state.endDate) {
      this.rentalDetails = {
        id: state.carId, // Using carId as a placeholder for rentalId
        customer: { ID: '', fullName: '', address: '' }, // Customer details will be filled later
        car: state.selectedCar,
        startDate: new Date(state.startDate),
        endDate: new Date(state.endDate),
      };
    } else {
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
