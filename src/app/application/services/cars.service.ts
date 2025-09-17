import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

interface CarDto {
  id: string; // Changed from number to string
  type: string;
  model: string;
  plate: string;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class CarsService {
  private apiUrl = '/api/cars'; // Adjust API URL as needed

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