import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { CalendarComponent } from './calendar/calendar.component';
import { MonthViewComponent } from './month-view/month-view.component';
import { EventModalComponent } from './event-modal/event-modal.component';

@NgModule({
  declarations: [
    CalendarComponent,
    MonthViewComponent,
    EventModalComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    DragDropModule
  ],
  exports: [
    CalendarComponent
  ]
})
export class CalendarModule { }
