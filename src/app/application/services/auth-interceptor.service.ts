import { Injectable, signal } from '@angular/core'; // Import signal
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService {
  private _isRefreshing = signal<boolean>(false); // Private writable signal
  isRefreshing = this._isRefreshing.asReadonly(); // Public readonly signal

  refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  setRefreshing(value: boolean): void {
    this._isRefreshing.set(value);
  }
}

