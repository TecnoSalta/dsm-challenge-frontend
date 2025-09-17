import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { RentalStoreService } from '../../../../application/services/rental-store.service';
import { CarsService } from '../../../../application/services/cars.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Car } from 'src/app/domain/models/car.model';

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
    HttpClientModule,
  ],
  templateUrl: './rental-search-step.component.html',
  styleUrls: ['./rental-search-step.component.scss']
})
export class RentalSearchStepComponent implements OnInit {
  @Input() searchForm!: FormGroup;
  @Input() selectedCar: Car | null = null;
  @Output() selectedCarChange = new EventEmitter<Car>();
  
  carTypes: string[] = [];
  carModels: string[] = [];

  availableCars: Car[] = []; // Initialize as empty array

  displayedColumns: string[] = ['id', 'licensePlate', 'type', 'model', 'dailyRate', 'status'];

  
  constructor(private rentalStore: RentalStoreService, private carsService: CarsService, private http: HttpClient) {}

 

  ngOnInit(): void {
    this.getCarMetadata();
  }

  getCarMetadata() {
    this.http.get<any[]>('https://localhost:9081/api/Cars/metadata').subscribe(data => {
      this.carTypes = data.map(item => item.type);
      this.carModels = data.flatMap(item => item.models);
    });
  }

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
  

  selectCar(car: Car) {
    this.selectedCar = car;
    this.selectedCarChange.emit(car);
    console.log('Selected car:', car);
  }
}
