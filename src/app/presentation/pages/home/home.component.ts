import { Component, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Car } from '../../../domain/models/car.model';
import { GetAllCarsUseCase } from '../../../application/use-cases/get-all-cars.use-case';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, MatCardModule],
})
export class HomeComponent {
  public cars: WritableSignal<Car[]> = signal([]);

  constructor(private getAllCarsUseCase: GetAllCarsUseCase) {
    this.getAllCarsUseCase.execute().subscribe((cars: Car[]) => {
      this.cars.set(cars);
    });
  }
}
