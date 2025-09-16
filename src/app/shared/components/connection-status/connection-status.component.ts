import { Component, OnInit, inject } from '@angular/core';
import { SyncService } from '../../../core/services/sync.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-connection-status',
  template: `
    <div class="connection-status" [class.offline]="!isOnline">
      <mat-icon>{{ isOnline ? 'wifi' : 'wifi_off' }}</mat-icon>
      <span>{{ isOnline ? 'En línea' : 'Modo offline' }}</span>
    </div>
  `,
  styles: [`
    .connection-status {
      display: flex;
      align-items: center;
      padding: 8px 12px;
      border-radius: 4px;
      background-color: #4caf50;
      color: white;
      font-size: 14px;
    }
    .connection-status.offline {
      background-color: #f44336;
    }
    .connection-status mat-icon {
      margin-right: 5px;
      font-size: 18px;
    }
  `],
  standalone: true,
  imports: [CommonModule, MatIconModule]
})
export class ConnectionStatusComponent implements OnInit {
  isOnline = true;

  private syncService = inject(SyncService);

  ngOnInit(): void {
    this.isOnline = this.syncService.isConnected();
    
    // Escuchar cambios en el estado de conexión
    window.addEventListener('online', () => {
      this.isOnline = true;
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }
}
