import { Service } from './service.model';

export interface Car {
  id: string;
  make: string;
  type?: string;
  model: string;
  dailyRate: number;
  services: Service[];
}
