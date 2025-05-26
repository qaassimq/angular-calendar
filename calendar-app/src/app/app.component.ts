import { Component } from '@angular/core';
import { CalendarModule } from './features/calendar/calendar.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CalendarModule],
  template: `
    <div class="app-container">
      <app-calendar></app-calendar>
    </div>
  `,
  styles: [`
    .app-container {
      height: 100vh;
      padding: 2rem;
      background-color: #f3f4f6;
    }
  `]
})
export class AppComponent {}
