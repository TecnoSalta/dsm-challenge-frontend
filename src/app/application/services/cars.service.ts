import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Car } from 'src/app/domain/models/car.model';

@Injectable({ providedIn: 'root' })
export class CarsService {
  private readonly apiUrl = environment.apiUrl + '/Cars';

  constructor(private http: HttpClient) {}

  getAvailable(startDate: string, endDate: string, type?: string, model?: string): Observable<Car[]> {
    let params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);

    if (type) {
      params = params.set('carType', type);
    }
    if (model) {
      params = params.set('carModel', model);
    }

    return this.http.get<Car[]>(`${this.apiUrl}/available`, { params });
  }
}