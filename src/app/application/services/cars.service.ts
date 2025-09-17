import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

interface CarDto {
  id: string;
  licensePlate: string;
  type: string;
  model: string;
  dailyRate: number;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class CarsService {
  private readonly apiUrl = environment.apiUrl + '/Cars';

  constructor(private http: HttpClient) {}

  getAvailable(startDate: string, endDate: string, type?: string, model?: string): Observable<CarDto[]> {
    let params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);

    if (type) {
      params = params.set('carType', type);
    }
    if (model) {
      params = params.set('carModel', model);
    }

    return this.http.get<CarDto[]>(`${this.apiUrl}/available`, { params });
  }
}