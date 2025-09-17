import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { ChartType, GoogleChartsModule } from 'angular-google-charts';

export interface CarTypeRentalCount {
  carType: string;
  rentalCount: number;
  percentage: number;
}

@Component({
  selector: 'app-car-rental-stats',
  standalone: true,
  imports: [CommonModule, GoogleChartsModule],
  templateUrl: './car-rental-stats.component.html',
  styleUrl: './car-rental-stats.component.scss',
})
export class CarRentalStatsComponent implements OnChanges {
  @Input() rentalData: CarTypeRentalCount[] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chartData: any[] = [];
  chartOptions = {
    title: 'Tipos de Auto Más Rentados',
    is3D: false,
    pieHole: 0.4, // Para donut chart
    legend: { position: 'labeled' },
    pieSliceText: 'percentage',
    colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
    chartArea: { width: '90%', height: '80%' },
  };

  chartType = ChartType.PieChart; // También puede ser 'BarChart'

  ngOnChanges(): void {
    this.updateChartData();
  }

  private updateChartData() {
    if (!this.rentalData || this.rentalData.length === 0) {
      this.chartData = [['No hay datos', 0]];
      return;
    }

    this.chartData = this.rentalData.map((item) => [
      this.capitalizeFirstLetter(item.carType),
      item.rentalCount,
    ]);
  }

  public capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  get mostRentedCarType(): string {
    if (!this.rentalData?.length) return 'No hay datos';

    const mostRented = this.rentalData.reduce((prev, current) =>
      prev.rentalCount > current.rentalCount ? prev : current
    );

    return this.capitalizeFirstLetter(mostRented.carType);
  }
}
