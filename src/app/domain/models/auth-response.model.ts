export interface AuthResponse {
  token: string;
  refreshToken: string;
  expiration: string;
  role: string;
  customerId?: string;
}
