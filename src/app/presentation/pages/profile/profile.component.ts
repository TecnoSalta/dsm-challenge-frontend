import { Component, OnInit, inject, effect } from '@angular/core'; // Import effect
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Import MatProgressSpinnerModule
import { AuthStoreService } from '../../../application/services/auth-store.service';
import { ProfileService } from '../../../application/services/profile.service';
import { IUpdateProfileRequest } from '../../../domain/models/update-profile-request.model';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule, // Add MatProgressSpinnerModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  loading = false;
  error: string | null = null;
  successMessage: string | null = null;

  private fb = inject(FormBuilder);
  public authStore = inject(AuthStoreService);
  private profileService = inject(ProfileService);

  constructor() { // Use constructor for effect
    effect(() => {
      const profile = this.authStore.userProfile(); // Access signal value
      if (profile) {
        this.profileForm.patchValue({
          dni: profile.customer?.dni,
          fullName: profile.customer?.fullName,
          address: profile.customer?.address,
          email: profile.email,
        });
        this.profileForm.get('dni')?.disable();
        this.profileForm.get('email')?.disable();
      } else if (this.authStore.isAuthenticated()) {
        this.loading = true;
        this.profileService.getProfile().pipe(
          tap(fetchedProfile => {
            this.authStore.setUserProfile(fetchedProfile);
          }),
          catchError(err => {
            console.error('Error fetching profile:', err);
            this.error = 'Failed to load profile.';
            return of(null);
          })
        ).subscribe(() => this.loading = false);
      }
    });
  }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      dni: ['', Validators.required],
      fullName: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = null;
    this.successMessage = null;

    const updateRequest: IUpdateProfileRequest = {
      fullName: this.profileForm.get('fullName')?.value,
      address: this.profileForm.get('address')?.value,
    };

    this.profileService.updateProfile(updateRequest).pipe(
      tap(updatedProfile => {
        this.authStore.setUserProfile(updatedProfile);
        this.successMessage = 'Profile updated successfully!';
      }),
      catchError(err => {
        console.error('Error updating profile:', err);
        this.error = 'Failed to update profile.';
        return of(null);
      })
    ).subscribe(() => this.loading = false);
  }
}
