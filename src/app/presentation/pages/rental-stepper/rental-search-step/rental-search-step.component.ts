import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { RentalStoreService } from '../../../../application/services/rental-store.service';
import { CarsService } from '../../../../application/services/cars.service';

interface Car {
  id: string; // Changed from number to string
  type: string;
  model: string;
  plate: string;
  status: string;
}

@Component({
  selector: 'app-rental-search-step',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
  ],
  templateUrl: './rental-search-step.component.html',
  styleUrls: ['./rental-search-step.component.scss']
})
export class RentalSearchStepComponent {
  @Input() searchForm!: FormGroup;

  carTypes: string[] = ['SUV', 'Sedan', 'Hatchback'];
  carModels: string[] = ['Toyota Corolla', 'Nissan Sentra', 'Toyota RAV4', 'Jeep Compass'];

  availableCars: Car[] = []; // Initialize as empty array

  displayedColumns: string[] = ['id', 'type', 'model', 'plate', 'status'];

  constructor(private rentalStore: RentalStoreService, private carsService: CarsService) {}

  onSearchAvailability() {
    console.log('Search criteria:', this.searchForm.value);
    const { startDate, endDate, carType, carModel } = this.searchForm.value;

    if (startDate && endDate) {
      this.rentalStore.setDates(startDate, endDate);
      this.carsService.getAvailable(
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0],
        carType,
        carModel
      ).subscribe(cars => {
        this.availableCars = cars;
      });
    }
  }

  // Method to select a car (to be called when a car is selected from the table)
  selectCar(car: Car) {
    this.rentalStore.setCar(car);
    console.log('Selected car:', car);
  }
}