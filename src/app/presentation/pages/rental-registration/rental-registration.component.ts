import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CreateRentalUseCase } from '../../../application/use-cases/create-rental.use-case';
import { GetAllCarsUseCase } from '../../../application/use-cases/get-all-cars.use-case';
import { Car } from '../../../domain/models/car.model';
import { Rental } from '../../../domain/models/rental.model';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../../../application/services/auth.service';
import { Customer } from '../../../domain/models/customer.model';

@Component({
  selector: 'app-rental-registration',
  templateUrl: './rental-registration.component.html',
  styleUrls: ['./rental-registration.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class RentalRegistrationComponent implements OnInit {
  rentalForm!: FormGroup;
  cars$!: Observable<Car[]>;
  cars: Car[] = [];

  private fb = inject(FormBuilder);
  private createRentalUseCase = inject(CreateRentalUseCase);
  private getAllCarsUseCase = inject(GetAllCarsUseCase);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    this.rentalForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      carId: ['', Validators.required],
    });

    this.cars$ = this.getAllCarsUseCase.execute().pipe(tap(cars => this.cars = cars));
  }

  onSubmit(): void {
    if (this.rentalForm.valid) {
      const user = this.authService.user();
      const selectedCar = this.cars.find(car => car.id === this.rentalForm.value.carId);

      if (user && selectedCar) {
        const customer: Customer = {
          ID: user.id,
          fullName: user.fullName,
          address: '', // Address is not available in the User model
        };

        const newRental: Rental = {
          startDate: this.rentalForm.value.startDate,
          endDate: this.rentalForm.value.endDate,
          car: selectedCar,
          customer: customer,
        };

        this.createRentalUseCase.execute(newRental).subscribe(() => {
          this.router.navigate(['/rental-management']);
        });
      }
    }
  }
}
