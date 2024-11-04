import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LoggerService } from './shared/services/logger/logger.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'kfir-bracha';
  private logger = inject(LoggerService);
  private router = inject(Router);

  constructor() {
    this.logger.info('Initializing the app');
  }
}
