import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GetAllRentalsUseCase } from '../../../application/use-cases/get-all-rentals.use-case';
import { DeleteRentalUseCase } from '../../../application/use-cases/delete-rental.use-case';
import { Rental } from '../../../domain/models/rental.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-rental-management',
  templateUrl: './rental-management.component.html',
  styleUrls: ['./rental-management.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class RentalManagementComponent implements OnInit {
  rentals$!: Observable<Rental[]>;

  private getAllRentalsUseCase = inject(GetAllRentalsUseCase);
  private deleteRentalUseCase = inject(DeleteRentalUseCase);

  ngOnInit(): void {
    this.rentals$ = this.getAllRentalsUseCase.execute();
  }

  deleteRental(id: string): void {
    this.deleteRentalUseCase.execute(id).subscribe(() => {
      this.rentals$ = this.getAllRentalsUseCase.execute();
    });
  }
}
