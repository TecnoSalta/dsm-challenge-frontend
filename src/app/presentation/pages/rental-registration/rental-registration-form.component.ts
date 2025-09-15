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
  isCarPreselected: boolean = false;
  customerFound: boolean = false;

  private fb = inject(FormBuilder);
  private createRentalUseCase = inject(CreateRentalUseCase);
  private getAllCarsUseCase = inject(GetAllCarsUseCase);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private rentalStoreService = inject(RentalStoreService);
  private getCustomerByDniUseCase = inject(GetCustomerByDniUseCase);

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
          // Fetch car details if preselected by query param and not from store
          this.getAllCarsUseCase.execute().subscribe(cars => {
            this.cars = cars;
            this.selectedCar = this.cars.find(car => car.id === carId);
          });
        }
      });
    }

    // Always fetch all cars for the dropdown, regardless of pre-selection
    this.cars$ = this.getAllCarsUseCase.execute().pipe(
      tap(cars => {
        this.cars = cars;
        // If car was preselected by query param, ensure selectedCar is set from fetched cars
        if (this.isCarPreselected && !this.selectedCar) {
          const carId = this.rentalForm.get('carId')?.value;
          this.selectedCar = this.cars.find(car => car.id === carId);
        }
      })
    );
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
          } else {
            this.rentalForm.get('fullName')?.setValue('');
            this.rentalForm.get('address')?.setValue('');
            this.customerFound = false;
          }
        },
        error: (err) => {
          console.error('Error fetching customer by DNI:', err);
          this.rentalForm.get('fullName')?.setValue('');
          this.rentalForm.get('address')?.setValue('');
          this.customerFound = false;
        }
      });
    } else {
      this.rentalForm.get('fullName')?.setValue('');
      this.rentalForm.get('address')?.setValue('');
      this.customerFound = false;
    }
  }

  onSubmit(): void {
    if (this.rentalForm.valid) {
      const user = this.authService.user();
      const selectedCar = this.cars.find(car => car.id === this.rentalForm.value.carId);

      if (user && selectedCar) {
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
          (createdRental) => { // Get the created rental with its ID
            this.rentalStoreService.setRentalFormState({
              carId: createdRental.car.id,
              startDate: createdRental.startDate.toISOString().split('T')[0],
              endDate: createdRental.endDate.toISOString().split('T')[0],
              selectedCar: createdRental.car,
              customer: createdRental.customer,
              id: createdRental.id // Store the rental ID
            });
            this.router.navigate(['/rental-confirmation']); // Navigate to confirmation page
          },
          (error) => {
            console.error('Error creating rental:', error);
            // Handle error, show message to user
          }
        );
      }
    }
  }
}
