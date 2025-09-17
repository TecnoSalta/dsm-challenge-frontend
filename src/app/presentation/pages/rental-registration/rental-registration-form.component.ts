import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { RegisterRentalUseCase } from '../../../application/use-cases/register-rental.use-case';
import { Car } from '../../../domain/models/car.model';
import { Observable,  } from 'rxjs';
import { RegisterRentalRequest } from '../../../domain/models/register-rental-request.model';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { RentalStoreService } from '../../../application/services/rental-store.service';
import { AuthStoreService } from '../../../application/services/auth-store.service'; // Import AuthStoreService

@Component({
  selector: 'app-rental-registration-form',
  templateUrl: './rental-registration-form.component.html',
  styleUrls: ['./rental-registration-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatDividerModule,
  ],
})
export class RentalRegistrationFormComponent implements OnInit {
  rentalForm!: FormGroup;
  // private _cars = signal<Car[]>([]); // REMOVED
  // cars = this._cars.asReadonly(); // REMOVED

  private _selectedCar = signal<Car | undefined>(undefined);
  selectedCar = this._selectedCar.asReadonly();

  private _isCarPreselected = signal<boolean>(false);
  isCarPreselected = this._isCarPreselected.asReadonly();

  private _customerFound = signal<boolean>(false);
  customerFound = this._customerFound.asReadonly();

  private readonly fb = inject(FormBuilder);
  private readonly registerRentalUseCase = inject(RegisterRentalUseCase);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly rentalStoreService = inject(RentalStoreService);
  private readonly authStore = inject(AuthStoreService); 

  ngOnInit(): void {
    this.rentalForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      carId: ['', Validators.required],
      dni: ['', Validators.required],
      fullName: ['', Validators.required],
      address: ['', Validators.required],
    });


    const rentalFormState = this.rentalStoreService.getRentalFormState()();

    if (rentalFormState.carId && rentalFormState.startDate && rentalFormState.endDate) {
      this.rentalForm.get('carId')?.setValue(rentalFormState.carId);
      this.rentalForm.get('startDate')?.setValue(new Date(rentalFormState.startDate));
      this.rentalForm.get('endDate')?.setValue(new Date(rentalFormState.endDate));
      this._selectedCar.set(rentalFormState.selectedCar || undefined); // Use selectedCar directly from state
      this._isCarPreselected.set(true);
      this.rentalForm.get('startDate')?.disable(); // Disable startDate
      this.rentalForm.get('endDate')?.disable();   // Disable endDate
    } else {
      // Fallback to query params if no state from store
      this.route.queryParams.subscribe(params => {
        const carId = params['carId'];
        if (carId) {
          this.rentalForm.get('carId')?.setValue(carId);
          this._isCarPreselected.set(true);          
        }
      });
    }

    // Pre-fill customer details if logged in as a customer
    const userProfile = this.authStore.userProfile();
    if (this.authStore.isAuthenticated() && userProfile && userProfile.role === 'Customer' && userProfile.customer) {
      this.rentalForm.get('dni')?.setValue(userProfile.customer.dni);
      this.rentalForm.get('fullName')?.setValue(userProfile.customer.fullName);
      this.rentalForm.get('address')?.setValue(userProfile.customer.address);
      this._customerFound.set(true); // Mark as customer found
      // Disable fields
      this.rentalForm.get('dni')?.disable();
      this.rentalForm.get('fullName')?.disable();
      this.rentalForm.get('address')?.disable();
    }
    
  }

  onDniChange(): void {
    const dni = this.rentalForm.get('dni')?.value;
    if (!dni) {
      this.rentalForm.get('fullName')?.setValue('');
      this.rentalForm.get('address')?.setValue('');
      this._customerFound.set(false);
      this.rentalForm.get('fullName')?.enable();
      this.rentalForm.get('address')?.enable();
    }
  }

  onSubmit(): void {
    if (this.rentalForm.valid) {
      console.log('Register Rental button pressed. Form is valid.');
      const userProfile = this.authStore.userProfile(); // Use userProfile from AuthStoreService

      if (userProfile && this.selectedCar()) { // Check userProfile instead of user
        const formRawValue = this.rentalForm.getRawValue(); // Get all values, including disabled ones

        const registerRentalRequest: RegisterRentalRequest = {
          customerId: userProfile.customer?.id || '',
          carId: this.selectedCar()!.id || '',
          startDate: formRawValue.startDate.toISOString().split('T')[0], // Use raw value
          endDate: formRawValue.endDate.toISOString().split('T')[0],     // Use raw value
        };

        console.log('Sending rental registration request:', registerRentalRequest);
        this.registerRentalUseCase.execute(registerRentalRequest).subscribe(
          (createdRental) => {
            console.log('Rental registration successful. Response:', createdRental);
            this.rentalStoreService.setRentalFormState({
              carId: createdRental.carId,
              startDate: createdRental.startDate, // Removed .toISOString().split('T')[0]
              endDate: createdRental.endDate,     // Removed .toISOString().split('T')[0]
              selectedCar: this.selectedCar(),
              customer: createdRental.customer,
              id: createdRental.id,
              status: createdRental.status // Add status from createdRental
            });
            this.router.navigate(['/rental-confirmation']);
          },
          (error) => {
            console.error('Error creating rental:', error);
          }
        );
      } else {
        console.warn('Cannot send rental request: userProfile or selectedCar is missing.', { userProfile, selectedCar: this.selectedCar() });
      }
    }
  }
}
