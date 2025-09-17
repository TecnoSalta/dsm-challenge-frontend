import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RentalSearchStepComponent } from './rental-search-step/rental-search-step.component';
import { RentalVerifyStepComponent } from './rental-verify-step/rental-verify-step.component';
import { RentalSuccessStepComponent } from './rental-success-step/rental-success-step.component';

@Component({
  selector: 'app-rental-stepper',
  standalone: true,
  imports: [
    CommonModule,
    MatStepperModule,
    MatButtonModule,
    ReactiveFormsModule,
    RentalSearchStepComponent,
    RentalVerifyStepComponent,
    RentalSuccessStepComponent,
  ],
  templateUrl: './rental-stepper.component.html',
  styleUrls: ['./rental-stepper.component.scss']
})
export class RentalStepperComponent {
  searchForm: FormGroup;
  verifyForm: FormGroup;

  constructor(private _formBuilder: FormBuilder) {
    this.searchForm = this._formBuilder.group({
      // Controls for RentalSearchStepComponent
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      carType: [null],
      carModel: [null],
    });

    this.verifyForm = this._formBuilder.group({
      // Controls for RentalVerifyStepComponent
      customerName: ['', Validators.required],
      customerEmail: ['', [Validators.required, Validators.email]],
    });
  }
}