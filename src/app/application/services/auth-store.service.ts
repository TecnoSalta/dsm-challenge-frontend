import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthStoreService {
  private readonly ACCESS_TOKEN_KEY = 'accessToken'; // Use a specific key
  private readonly REFRESH_TOKEN_KEY = 'refreshToken'; // New key for refresh token

  private _accessToken = signal<string | null>(localStorage.getItem(this.ACCESS_TOKEN_KEY));
  private _refreshToken = signal<string | null>(localStorage.getItem(this.REFRESH_TOKEN_KEY)); // New signal for refresh token

  accessToken = this._accessToken.asReadonly();
  refreshToken = this._refreshToken.asReadonly(); // Expose refresh token as readonly signal

  setTokens(accessToken: string, refreshToken: string) { // Updated method to set both tokens
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    this._accessToken.set(accessToken);
    this._refreshToken.set(refreshToken);
  }

  clearTokens() { // Updated method to clear both tokens
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    this._accessToken.set(null);
    this._refreshToken.set(null);
  }
}