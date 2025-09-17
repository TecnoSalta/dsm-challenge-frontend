import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Car } from 'src/app/domain/models/car.model';

@Component({
  selector: 'app-next-car-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './next-car-services.component.html',
  styleUrl: './next-car-services.component.scss',
})
export class NextCarServicesComponent {
  @Input() cars: Car[] = [];

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }
}
