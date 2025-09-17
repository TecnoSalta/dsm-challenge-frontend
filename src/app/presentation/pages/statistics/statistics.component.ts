import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CarRentalStatsComponent,
  CarTypeRentalCount,
} from './car-rental-stats/car-rental-stats.component';
import { StatisticService } from 'src/app/application/services/statistics.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
  standalone: true,
  imports: [CommonModule, CarRentalStatsComponent],
})
export class StatisticsComponent implements OnInit {
  private statisticService = inject(StatisticService);
  rentalData: CarTypeRentalCount[] = [];

  ngOnInit(): void {
    this.statisticService.getMostRentedCarTypes().subscribe({
      next: (response) => {
        console.log(`StatisticsComponent > ngOnInit > response`, response);
        this.rentalData = response;
      },
      error: (err) => {
        console.error(`StatisticsComponent > ngOnInit > err`, err);
      },
    });
  }
}
