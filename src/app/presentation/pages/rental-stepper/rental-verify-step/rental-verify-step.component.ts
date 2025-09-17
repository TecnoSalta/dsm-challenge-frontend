import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RentalStoreService } from '../../../../application/services/rental-store.service';
import { Car } from 'src/app/domain/models/car.model';
import { Customer } from 'src/app/domain/models/customer.model';

@Component({
  selector: 'app-rental-verify-step',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './rental-verify-step.component.html',
  styleUrls: ['./rental-verify-step.component.scss']
})
export class RentalVerifyStepComponent implements OnInit {
  @Input() verifyForm!: FormGroup;
  @Input() selectedCar: Car | null = null;
  @Input() selectedCustomer: Customer | null = null;
  @Output() selectedCustomerChange = new EventEmitter<Customer>();

  constructor(private rentalStore: RentalStoreService) { }

  ngOnInit() {
    const authUserString = localStorage.getItem('authUser');
    if (authUserString) {
      try {
        const authUser = JSON.parse(authUserString);
        if (authUser && authUser.customer) {
          this.verifyForm.patchValue({
            customerName: authUser.customer.fullName,
            customerEmail: authUser.email
          });
          const customer: Customer = {
            id: authUser.customer.id,
            dni: authUser.customer.dni || '',
            fullName: authUser.customer.fullName,
            address: authUser.customer.address || '',
            email: authUser.email,
          };
          Promise.resolve().then(() => {
            this.selectedCustomerChange.emit(customer);
            this.rentalStore.setCustomer(customer);
          });
        }
      } catch (e) {
        console.error('Error parsing authuser from localStorage', e);
      }
    }

    this.verifyForm.valueChanges.subscribe(value => {
      if (this.verifyForm.valid) {
        const customer: Customer = {
          id: this.rentalStore.customer()?.id || '',
          dni: this.rentalStore.customer()?.dni || '',
          fullName: value.customerName,
          address: this.rentalStore.customer()?.address || '',
          email: value.customerEmail,
        };
        Promise.resolve().then(() => {
          this.selectedCustomerChange.emit(customer);
          this.rentalStore.setCustomer(customer);
        });
      }
    });
  }
}