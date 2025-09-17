import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface RentalRequestDto {
  carId: number;
  startDate: string;
  endDate: string;
  customerName: string;
  customerEmail: string;
}

interface RentalResponseDto {
  id: number;
  carId: number;
  startDate: string;
  endDate: string;
  customerName: string;
  customerEmail: string;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class RentalsService {
  private apiUrl = '/api/rentals'; // Adjust API URL as needed

  constructor(private http: HttpClient) {}

  createRental(rental: RentalRequestDto): Observable<RentalResponseDto> {
    return this.http.post<RentalResponseDto>(this.apiUrl, rental);
  }

  getRentals(): Observable<RentalResponseDto[]> {
    return this.http.get<RentalResponseDto[]>(this.apiUrl);
  }

  updateRental(id: number, rental: RentalRequestDto): Observable<RentalResponseDto> {
    return this.http.put<RentalResponseDto>(`${this.apiUrl}/${id}`, rental);
  }

  cancelRental(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
