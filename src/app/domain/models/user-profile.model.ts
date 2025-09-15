import { User } from './user.model'; // Import User

export interface IUserProfile extends User {
  customerId: string;
  dni: string;
  address: string;
  role?: string;
}