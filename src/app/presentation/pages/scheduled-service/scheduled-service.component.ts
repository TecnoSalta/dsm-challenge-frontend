import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NextCarServicesComponent } from './next-car-services/next-car-services.component';
import { CarApiService } from 'src/app/infrastructure/repositories/car-api.service';
import { Car } from 'src/app/domain/models/car.model';

@Component({
  selector: 'app-scheduled-service',
  templateUrl: './scheduled-service.component.html',
  styleUrls: ['./scheduled-service.component.scss'],
  standalone: true,
  imports: [CommonModule, NextCarServicesComponent],
})
export class ScheduledServiceComponent implements OnInit {
  private carApiService = inject(CarApiService);
  cars: Car[] = [];

  ngOnInit(): void {
    this.carApiService.getNextCarServices().subscribe({
      next: (response) => {
        this.cars = response;
      },
      error: (err) => {
        console.error(`ScheduledServiceComponent > ngOnInit > err`, err);
      },
    });
  }
}
