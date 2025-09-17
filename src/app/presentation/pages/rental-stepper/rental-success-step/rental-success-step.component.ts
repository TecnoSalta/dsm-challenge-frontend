import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RentalStoreService } from '../../../../application/services/rental-store.service';

@Component({
  selector: 'app-rental-success-step',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rental-success-step.component.html',
  styleUrls: ['./rental-success-step.component.scss']
})
export class RentalSuccessStepComponent implements OnInit {
  startDate: Date | null = null;
  endDate: Date | null = null;
  selectedCar: any | null = null;
  customer: any | null = null;

  constructor(private rentalStore: RentalStoreService) {}

  ngOnInit(): void {
    this.startDate = this.rentalStore.startDate();
    this.endDate = this.rentalStore.endDate();
    this.selectedCar = this.rentalStore.selectedCar();
    this.customer = this.rentalStore.customer();
  }
}