import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RentalStoreService } from '../../../../application/services/rental-store.service';
import { Car } from 'src/app/domain/models/car.model';
import { Customer } from 'src/app/domain/models/customer.model';

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
  
  @Input() selectedCar: Car | null = null;
  @Input() selectedCustomer: Customer | null = null;
  @Input() rentalResponse: any | null = null;

  constructor(private rentalStore: RentalStoreService) {}

  ngOnInit(): void {
    this.startDate = this.rentalStore.startDate();
    this.endDate = this.rentalStore.endDate();
  }
}