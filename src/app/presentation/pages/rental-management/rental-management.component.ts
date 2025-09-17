import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GetAllRentalsUseCase } from '../../../application/use-cases/get-all-rentals.use-case';
import { DeleteRentalUseCase } from '../../../application/use-cases/delete-rental.use-case';
import { RentalWithCar } from '../../../domain/models/rental-with-car.model'; // Import RentalWithCar
import { Observable } from 'rxjs'; // Only Observable is needed now

@Component({
  selector: 'app-rental-management',
  templateUrl: './rental-management.component.html',
  styleUrls: ['./rental-management.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class RentalManagementComponent implements OnInit {
  private _rentalsWithCarDetails = signal<RentalWithCar[]>([]);
  rentalsWithCarDetails = this._rentalsWithCarDetails.asReadonly();

  private getAllRentalsUseCase = inject(GetAllRentalsUseCase);
  private deleteRentalUseCase = inject(DeleteRentalUseCase);

  ngOnInit(): void {
    this.getAllRentalsUseCase.execute().subscribe(rentals => {
      this._rentalsWithCarDetails.set(rentals);
    });
  }

  deleteRental(id: string): void {
    this.deleteRentalUseCase.execute(id).subscribe(() => {
      // Re-fetch rentals after deletion to update the list
      this.getAllRentalsUseCase.execute().subscribe(rentals => {
        this._rentalsWithCarDetails.set(rentals);
      });
    });
  }
}
