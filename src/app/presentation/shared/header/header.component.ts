import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../application/services/auth.service';
import { CommonModule } from '@angular/common';
import { ConnectionStatusComponent } from '../../../shared/components/connection-status/connection-status.component';
import { AuthStoreService } from '../../../application/services/auth-store.service'; // Import AuthStoreService

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule, MatToolbarModule, RouterLink, ConnectionStatusComponent],
})
export class HeaderComponent {
  public authService = inject(AuthService); // Keep AuthService for logout method
  public authStore = inject(AuthStoreService); // Inject AuthStoreService
  private router = inject(Router);

  onLogout(): void {
    this.authService.logout(); // AuthService.logout() now calls authStore.clearTokens()
    this.router.navigate(['/login']);
  }
}