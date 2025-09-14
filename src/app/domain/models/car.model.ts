import { Service } from './service.model';

export interface Car {
  services: Service[];
  type: string;
  model: string;
}
