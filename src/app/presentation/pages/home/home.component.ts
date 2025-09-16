import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';

import { GetCarMetadataUseCase } from '../../../application/use-cases/get-car-metadata.use-case';
import { GetAvailableCarsUseCase } from '../../../application/use-cases/get-available-cars.use-case';
import { CarMetadata } from '../../../domain/models/car-metadata.model';
import { AvailableCar } from '../../../domain/models/available-car.model';
import { AvailabilityRequest } from '../../../domain/models/availability-request.model';
import { finalize } from 'rxjs';
import { RentalStoreService } from '../../../application/services/rental-store.service';
import { Car } from '../../../domain/models/car.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
})
export class HomeComponent implements OnInit {
  searchForm: FormGroup;
  carMetadata: CarMetadata[] = [];
  availableCars: AvailableCar[] = [];
  filteredModels: string[] = [];
  loading = false;
  error: string | null = null;

  private getCarMetadataUseCase = inject(GetCarMetadataUseCase);
  private getAvailableCarsUseCase = inject(GetAvailableCarsUseCase);
  private router = inject(Router);
  private rentalStoreService = inject(RentalStoreService);

  private fb = inject(FormBuilder);

  constructor() {
    this.searchForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      carType: [''],
      model: ['']
    });
  }

  ngOnInit(): void {
    this.getCarMetadata();
  }

  getCarMetadata(): void {
    this.getCarMetadataUseCase.execute().subscribe({
      next: (metadata) => {
        this.carMetadata = metadata;
      },
      error: (err) => {
        console.error('Error fetching car metadata:', err);
        this.error = 'Failed to load car metadata.';
      }
    });
  }

  onTypeChange(): void {
    const selectedType = this.searchForm.get('carType')?.value;
    this.searchForm.get('model')?.setValue('');
    if (selectedType) {
      this.filteredModels = this.carMetadata.find(m => m.type === selectedType)?.models || [];
    } else {
      this.filteredModels = [];
    }
  }

  onSearch(): void {
    if (this.searchForm.invalid) {
      this.error = 'Please select start and end dates.';
      return;
    }

    this.loading = true;
    this.error = null;

    const formValue = this.searchForm.value;
    const request: AvailabilityRequest = {
      startDate: formValue.startDate.toISOString().split('T')[0],
      endDate: formValue.endDate.toISOString().split('T')[0],
      carType: formValue.carType || undefined,
      model: formValue.model || undefined
    };

    this.getAvailableCarsUseCase.execute(request)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (cars) => {
          this.availableCars = cars;
          if (cars.length === 0) {
            this.error = 'No cars available for the selected criteria.';
          }
        },
        error: (err) => {
          console.error('Error fetching available cars:', err);
          this.error = 'Failed to fetch available cars.';
        }
      });
  }

  rentCar(carId: string): void {
    const selectedAvailableCar = this.availableCars.find(car => car.id === carId);
    const startDate = this.searchForm.get('startDate')?.value;
    const endDate = this.searchForm.get('endDate')?.value;

    if (selectedAvailableCar && startDate && endDate) {
      const carToRent: Car = {
        id: selectedAvailableCar.id,
        make: selectedAvailableCar.type,
        model: selectedAvailableCar.model,
        dailyRate: selectedAvailableCar.dailyRate,
        services: [],
      };

      this.rentalStoreService.setRentalFormState({
        carId: carToRent.id,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        selectedCar: carToRent,
      });
      this.router.navigate(['/rental-registration']);
    } else {
      console.error('Could not rent car: missing car details or dates.');
    }
  }
}
