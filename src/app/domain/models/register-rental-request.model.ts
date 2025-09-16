export interface RegisterRentalRequest {
  customerId: string;
  carId: string;
  startDate: string; // YYYY-MM-DD format
  endDate: string;   // YYYY-MM-DD format
}
