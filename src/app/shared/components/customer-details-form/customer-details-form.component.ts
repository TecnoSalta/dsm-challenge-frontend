import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

// Angular Material Imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-customer-details-form',
  templateUrl: './customer-details-form.component.html',
  styleUrls: ['./customer-details-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class CustomerDetailsFormComponent {
  @Input() form!: FormGroup;
  @Input() customerFound: boolean = false;

  @Output() dniChange = new EventEmitter<string>();

  onDniBlur(): void {
    const dni = this.form.get('dni')?.value;
    this.dniChange.emit(dni);
  }
}
