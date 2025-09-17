import { Service } from './service.model';

export interface Car {
  id: string;
  licensePlate: string;
  type?: string;
  model: string;
  dailyRate: number;
  status: string;
  services: Service[];
}
