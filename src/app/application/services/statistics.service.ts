import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CarTypeRentalCount } from 'src/app/presentation/pages/statistics/car-rental-stats/car-rental-stats.component';

@Injectable({
  providedIn: 'root',
})
export class StatisticService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl + '/Statistics';

  getMostRentedCarTypes(): Observable<CarTypeRentalCount[]> {
    return this.http.get<CarTypeRentalCount[]>(
      `${this.apiUrl}/MostRentedCarTypes`
    );
  }
}
