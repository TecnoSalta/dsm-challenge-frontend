import { Injectable, signal, computed, inject } from '@angular/core';
import { IUserProfile } from '../../domain/models/user-profile.model'; // Import IUserProfile
import { AuthResponse } from 'src/app/domain/models/auth-response.model';
import { GetProfileUseCase } from '../use-cases/get-profile.use-case';
import { switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthStoreService {
  private readonly ACCESS_TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private readonly USER_PROFILE_KEY = 'authUser'; // Key for persisting user profile

  private getProfileUseCase = inject(GetProfileUseCase);

  private readonly _accessToken = signal<string | null>(localStorage.getItem(this.ACCESS_TOKEN_KEY));
  private readonly _refreshToken = signal<string | null>(localStorage.getItem(this.REFRESH_TOKEN_KEY));
  private readonly _userProfile = signal<IUserProfile | null>(this.loadUserProfile()); // Initialize from localStorage

  accessToken = this._accessToken.asReadonly();
  refreshToken = this._refreshToken.asReadonly();
  userProfile = this._userProfile.asReadonly(); // Expose user profile as readonly signal

  isAuthenticated = computed(() => !!this.accessToken() && !!this.userProfile()); // Computed signal for authentication status
  role = computed(() => this.userProfile()?.role || null); // Computed signal for user role
  
  

  setTokens(authResponse: AuthResponse) {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, authResponse.token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, authResponse.refreshToken);
    this._accessToken.set(authResponse.token);
    this._refreshToken.set(authResponse.refreshToken);

    // Fetch the full user profile after setting tokens
    this.getProfileUseCase.execute().subscribe({
      next: (profile) => {
        this.setUserProfile(profile);
      },
      error: (err) => {
        console.error('Error fetching user profile:', err);
        // Optionally clear tokens or handle error appropriately
        this.clearTokens();
      }
    });
  }

  setUserProfile(profile: IUserProfile | null) {
    if (profile) {
      localStorage.setItem(this.USER_PROFILE_KEY, JSON.stringify(profile));
    }
    else {
      localStorage.removeItem(this.USER_PROFILE_KEY);
    }
    this._userProfile.set(profile);
  }

  clearTokens() {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_PROFILE_KEY); // Clear user profile as well
    this._accessToken.set(null);
    this._refreshToken.set(null);
    this._userProfile.set(null);
  }

  private loadUserProfile(): IUserProfile | null {
    const storedProfile = localStorage.getItem(this.USER_PROFILE_KEY);
    return storedProfile ? JSON.parse(storedProfile) : null;
  }
}
