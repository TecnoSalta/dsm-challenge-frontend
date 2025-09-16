import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUserProfile } from '../../domain/models/user-profile.model';
import { IUpdateProfileRequest } from '../../domain/models/update-profile-request.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl + '/profile';

  getProfile(): Observable<IUserProfile> {
    return this.http.get<IUserProfile>(`${this.apiUrl}/me`);
  }

  updateProfile(request: IUpdateProfileRequest): Observable<IUserProfile> {
    return this.http.put<IUserProfile>(this.apiUrl, request);
  }
}
