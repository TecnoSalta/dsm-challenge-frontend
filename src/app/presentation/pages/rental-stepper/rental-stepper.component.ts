import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RentalSearchStepComponent } from './rental-search-step/rental-search-step.component';
import { RentalVerifyStepComponent } from './rental-verify-step/rental-verify-step.component';
import { RentalSuccessStepComponent } from './rental-success-step/rental-success-step.component';
import { Car } from 'src/app/domain/models/car.model';
import { CarRentalService, RentalResponseDto } from 'src/app/application/services/rentals.service';
import { NotificationService } from 'src/app/application/services/notification.service';
import { Customer } from 'src/app/domain/models/customer.model';

@Component({
  selector: 'app-rental-stepper',
  standalone: true,
  imports: [
    CommonModule,
    MatStepperModule,
    MatButtonModule,
    ReactiveFormsModule,
    RentalSearchStepComponent,
    RentalVerifyStepComponent,
    RentalSuccessStepComponent,
  ],
  templateUrl: './rental-stepper.component.html',
  styleUrls: ['./rental-stepper.component.scss']
})
export class RentalStepperComponent {
  searchForm: FormGroup;
  verifyForm: FormGroup;
  selectedCar: Car | null = null;
  selectedCustomer: Customer | null = null;
  rentalResponse: RentalResponseDto | null = null;

  constructor(
    private _formBuilder: FormBuilder,
    private rentalService: CarRentalService,
    private toastService: NotificationService
  ) {
    this.searchForm = this._formBuilder.group({
      // Controls for RentalSearchStepComponent
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      carType: [null],
      carModel: [null],
    });

    this.verifyForm = this._formBuilder.group({
      // Controls for RentalVerifyStepComponent
      customerName: ['', Validators.required],
      customerEmail: ['', [Validators.required, Validators.email]],
    });
  }

  confirmRental(stepper: MatStepper) {
    if (!this.verifyForm.valid || !this.selectedCar || !this.selectedCustomer) return;

    const rentalRequest = {
      customerId: this.selectedCustomer.id,
      carId: this.selectedCar.id,
      startDate: this.searchForm.value.startDate.toISOString().split('T')[0],
      endDate: this.searchForm.value.endDate.toISOString().split('T')[0],
    };
    console.error('Submitting rental request:', rentalRequest);

    this.rentalService.createRental(rentalRequest).subscribe({
      next: (res: RentalResponseDto) => {
        this.rentalResponse = res;
        this.toastService.show('Reserva confirmada con éxito ✅', 'success');
        stepper.next();
      },
      error: () => {
        this.toastService.show('Error al confirmar la reserva ❌', 'error');
      }
    });
  }
}