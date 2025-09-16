import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from '../../presentation/shared/notification/notification.component';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private snackBar = inject(MatSnackBar);

  show(message: string, type: NotificationType = 'info') {
    this.snackBar.openFromComponent(NotificationComponent, {
      data: {
        message,
        type
      },
      duration: this.getDuration(type),
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [`notification-${type}`]
    });
  }

  private getDuration(type: NotificationType): number {
    switch (type) {
      case 'success':
      case 'info':
        return 3000; // 3 seconds as per guidelines
      case 'warning':
      case 'error':
        return 8000; // 8 seconds
      default:
        return 5000;
    }
  }
}
