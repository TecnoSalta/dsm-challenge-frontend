import { Injectable, signal, computed, WritableSignal, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { LoginUseCase } from '../use-cases/login.use-case';
import { GetProfileUseCase } from '../use-cases/get-profile.use-case';
import { Credentials } from '../../domain/models/credentials.model';
import { User } from '../../domain/models/user.model';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authToken: WritableSignal<string | null> = signal(null);
  private currentUser: WritableSignal<User | null> = signal(null);

  public isAuthenticated: Signal<boolean> = computed(() => !!this.authToken());
  public user: Signal<User | null> = computed(() => this.currentUser());

  constructor(
    private router: Router,
    private loginUseCase: LoginUseCase,
    private getProfileUseCase: GetProfileUseCase
  ) {
    // Check for a token in local storage on service initialization
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.authToken.set(token);
      this.getProfileUseCase.execute().subscribe(user => this.currentUser.set(user));
    }
  }

  login(credentials: Credentials) {
    return this.loginUseCase.execute(credentials).pipe(
      tap(({ token }) => {
        this.authToken.set(token);
        localStorage.setItem('auth_token', token);
        this.getProfileUseCase.execute().subscribe(user => this.currentUser.set(user));
        this.router.navigate(['/profile']);
      })
    );
  }

  logout() {
    this.authToken.set(null);
    this.currentUser.set(null);
    localStorage.removeItem('auth_token');
    this.router.navigate(['/login']);
  }
}
