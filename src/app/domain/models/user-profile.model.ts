import { User } from './user.model';

export interface ICustomerProfile {
  id: string;
  dni: string;
  fullName: string;
  address: string;
}

export interface IUserProfile extends User {
  role?: string;
  customer?: ICustomerProfile;
}
