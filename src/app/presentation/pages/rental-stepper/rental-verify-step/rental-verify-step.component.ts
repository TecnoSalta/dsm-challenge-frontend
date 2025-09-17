import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RentalStoreService } from '../../../../application/services/rental-store.service';
import { RentalsService } from '../../../../application/services/rentals.service';

@Component({
  selector: 'app-rental-verify-step',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './rental-verify-step.component.html',
  styleUrls: ['./rental-verify-step.component.scss']
})
export class RentalVerifyStepComponent {
  @Input() verifyForm!: FormGroup;

  constructor(private rentalStore: RentalStoreService, private rentalsService: RentalsService) {}

  ngOnInit() {
    this.verifyForm.valueChanges.subscribe(value => {
      if (this.verifyForm.valid) {
        this.rentalStore.setCustomer(value);
      }
    });
  }

  confirmRental() {
    const selectedCar = this.rentalStore.selectedCar();
    const customer = this.rentalStore.customer();
    const startDate = this.rentalStore.startDate();
    const endDate = this.rentalStore.endDate();

    if (selectedCar && customer && startDate && endDate) {
      const rentalRequest = {
        carId: selectedCar.id,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        customerName: customer.name,
        customerEmail: customer.email,
      };

      this.rentalsService.createRental(rentalRequest).subscribe({
        next: (response) => {
          console.log('Rental created successfully:', response);
          // Optionally, navigate to success step or update store with rental confirmation
        },
        error: (error) => {
          console.error('Error creating rental:', error);
        }
      });
    }
  }
}
