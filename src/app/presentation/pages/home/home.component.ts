import { Component, OnInit, inject, signal } from '@angular/core';
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
  private _carMetadata = signal<CarMetadata[]>([]);
  carMetadata = this._carMetadata.asReadonly();

  private _availableCars = signal<AvailableCar[]>([]);
  availableCars = this._availableCars.asReadonly();

  private _filteredModels = signal<string[]>([]);
  filteredModels = this._filteredModels.asReadonly();

  private _loading = signal<boolean>(false);
  loading = this._loading.asReadonly();

  private _error = signal<string | null>(null);
  error = this._error.asReadonly();

  private readonly getCarMetadataUseCase = inject(GetCarMetadataUseCase);
  private readonly getAvailableCarsUseCase = inject(GetAvailableCarsUseCase);
  private readonly router = inject(Router);
  private readonly rentalStoreService = inject(RentalStoreService);

  private readonly fb = inject(FormBuilder);

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
        this._carMetadata.set(metadata);
      },
      error: (err) => {
        console.error('Error fetching car metadata:', err);
        this._error.set('Failed to load car metadata.');
      }
    });
  }

  onTypeChange(): void {
    const selectedType = this.searchForm.get('carType')?.value;
    this.searchForm.get('model')?.setValue('');
    if (selectedType) {
      this._filteredModels.set(this.carMetadata().find(m => m.type === selectedType)?.models || []);
    } else {
      this._filteredModels.set([]);
    }
  }

  onSearch(): void {
    if (this.searchForm.invalid) {
      this._error.set('Please select start and end dates.');
      return;
    }

    this._loading.set(true);
    this._error.set(null);

    const formValue = this.searchForm.value;
    const request: AvailabilityRequest = {
      startDate: formValue.startDate.toISOString().split('T')[0],
      endDate: formValue.endDate.toISOString().split('T')[0],
      carType: formValue.carType || undefined,
      model: formValue.model ? encodeURIComponent(formValue.model) : undefined // Apply encodeURIComponent
    };

    this.getAvailableCarsUseCase.execute(request)
      .pipe(
        finalize(() => {
          this._loading.set(false);
        })
      )
      .subscribe({
        next: (cars) => {
          this._availableCars.set(cars);
          if (cars.length === 0) {
            this._error.set('No cars available for the selected criteria.');
          }
        },
        error: (err) => {
          console.error('Error fetching available cars:', err);
          this._error.set('Failed to fetch available cars.');
        }
      });
  }

  rentCar(carId: string): void {
    const selectedAvailableCar = this.availableCars().find(car => car.id === carId);
    const startDate = this.searchForm.get('startDate')?.value;
    const endDate = this.searchForm.get('endDate')?.value;

    if (selectedAvailableCar && startDate && endDate) {
      const carToRent: Car = {
        id: selectedAvailableCar.id,
        type: selectedAvailableCar.type,
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

