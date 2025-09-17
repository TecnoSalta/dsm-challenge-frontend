import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

export interface RentalRequestDto {
  startDate: string;
  endDate: string;
  carType?: string;
  carModel?: string;
}

export interface RentalResponseDto {
  // Define la estructura de la respuesta según tu API
  id: number;
  confirmationNumber: string;
  totalPrice: number;
  // ... otras propiedades
}

@Injectable({
  providedIn: 'root'
})
export class CarRentalService {

  constructor(private http: HttpClient) { }

  // Método para obtener coches disponibles (GET)
  getAvailableCars(startDate: string, endDate: string, carType?: string, carModel?: string): Observable<any> {
    let params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    
    if (carType) {
      params = params.set('carType', carType);
    }
    
    if (carModel) {
      params = params.set('carModel', carModel);
    }
    
    return this.http.get(`${environment.apiUrl}/api/Cars/available`, { params });
  }

  // Método para crear una reserva (POST)
  createRental(rental: RentalRequestDto): Observable<RentalResponseDto> {
    console.error('Submitting rental request:', rental);

    return this.http.post<RentalResponseDto>(`${environment.apiUrl}/Rentals`, rental);
  }
}