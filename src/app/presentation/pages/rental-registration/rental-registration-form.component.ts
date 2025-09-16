import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CreateRentalUseCase } from '../../../application/use-cases/create-rental.use-case';
import { GetAllCarsUseCase } from '../../../application/use-cases/get-all-cars.use-case';
import { Car } from '../../../domain/models/car.model';
import { Rental } from '../../../domain/models/rental.model';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../../../application/services/auth.service';
import { Customer } from '../../../domain/models/customer.model';

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
import { GetCustomerByDniUseCase } from '../../../application/use-cases/get-customer-by-dni.use-case';
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
  cars$!: Observable<Car[]>;
  cars: Car[] = [];
  selectedCar: Car | undefined;
  isCarPreselected = false;
  customerFound = false;

  private fb = inject(FormBuilder);
  private createRentalUseCase = inject(CreateRentalUseCase);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private rentalStoreService = inject(RentalStoreService);
  private getCustomerByDniUseCase = inject(GetCustomerByDniUseCase);
  private authStore = inject(AuthStoreService); // Inject AuthStoreService

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
      this.selectedCar = rentalFormState.selectedCar || undefined; // Use selectedCar directly from state
      this.isCarPreselected = true;
    } else {
      // Fallback to query params if no state from store
      this.route.queryParams.subscribe(params => {
        const carId = params['carId'];
        if (carId) {
          this.rentalForm.get('carId')?.setValue(carId);
          this.isCarPreselected = true;          
        }
      });
    }

    // Pre-fill customer details if logged in as a customer
    const userProfile = this.authStore.userProfile();
    if (this.authStore.isAuthenticated() && userProfile && userProfile.role === 'Customer') {
      this.rentalForm.get('dni')?.setValue(userProfile.dni);
      this.rentalForm.get('fullName')?.setValue(userProfile.fullName);
      this.rentalForm.get('address')?.setValue(userProfile.address);
      this.customerFound = true; // Mark as customer found
      // Disable fields
      this.rentalForm.get('dni')?.disable();
      this.rentalForm.get('fullName')?.disable();
      this.rentalForm.get('address')?.disable();
    }
    
  }

  onCarSelectionChange(): void {
    const selectedCarId = this.rentalForm.get('carId')?.value;
    this.selectedCar = this.cars.find(car => car.id === selectedCarId);
  }

  onDniChange(): void {
    const dni = this.rentalForm.get('dni')?.value;
    if (dni) {
      this.getCustomerByDniUseCase.execute(dni).subscribe({
        next: (customer) => {
          if (customer) {
            this.rentalForm.get('fullName')?.setValue(customer.fullName);
            this.rentalForm.get('address')?.setValue(customer.address);
            this.customerFound = true;
            this.rentalForm.get('fullName')?.disable(); // Disable if found
            this.rentalForm.get('address')?.disable(); // Disable if found
          } else {
            this.rentalForm.get('fullName')?.setValue('');
            this.rentalForm.get('address')?.setValue('');
            this.customerFound = false;
            this.rentalForm.get('fullName')?.enable(); // Enable if not found
            this.rentalForm.get('address')?.enable(); // Enable if not found
          }
        },
        error: (err) => {
          console.error('Error fetching customer by DNI:', err);
          this.rentalForm.get('fullName')?.setValue('');
          this.rentalForm.get('address')?.setValue('');
          this.customerFound = false;
          this.rentalForm.get('fullName')?.enable();
          this.rentalForm.get('address')?.enable();
        }
      });
    } else {
      this.rentalForm.get('fullName')?.setValue('');
      this.rentalForm.get('address')?.setValue('');
      this.customerFound = false;
      this.rentalForm.get('fullName')?.enable();
      this.rentalForm.get('address')?.enable();
    }
  }

  onSubmit(): void {
    if (this.rentalForm.valid) {
      const userProfile = this.authStore.userProfile(); // Use userProfile from AuthStoreService
      const selectedCar = this.cars.find(car => car.id === this.rentalForm.value.carId);

      if (userProfile && selectedCar) { // Check userProfile instead of user
        const customer: Customer = {
          ID: this.rentalForm.value.dni,
          fullName: this.rentalForm.value.fullName,
          address: this.rentalForm.value.address,
        };

        const newRental: Rental = {
          startDate: this.rentalForm.value.startDate,
          endDate: this.rentalForm.value.endDate,
          car: selectedCar,
          customer: customer,
        };

        this.createRentalUseCase.execute(newRental).subscribe(
          (createdRental) => {
            this.rentalStoreService.setRentalFormState({
              carId: createdRental.car.id,
              startDate: createdRental.startDate.toISOString().split('T')[0],
              endDate: createdRental.endDate.toISOString().split('T')[0],
              selectedCar: createdRental.car,
              customer: createdRental.customer,
              id: createdRental.id
            });
            this.router.navigate(['/rental-confirmation']);
          },
          (error) => {
            console.error('Error creating rental:', error);
          }
        );
      }
    }
  }
}