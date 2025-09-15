import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './presentation/shared/header/header.component';
import { ConnectionStatusComponent } from './shared/components/connection-status/connection-status.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ConnectionStatusComponent],
})
export class AppComponent {
  title = 'AngularClient';
}
