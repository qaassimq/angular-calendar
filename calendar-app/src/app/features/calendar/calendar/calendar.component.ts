import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EventService } from '../services/event.service';
import { CalendarEvent } from '../models/calendar-event.interface';
import { EventModalComponent } from '../event-modal/event-modal.component';
import { finalize } from 'rxjs/operators';

type ViewType = 'month' | 'week' | 'day';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  currentDate = new Date();
  currentView: ViewType = 'month';
  events: CalendarEvent[] = [];
  isLoading = false;

  constructor(
    private eventService: EventService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadEvents();
  }

  private loadEvents() {
    this.isLoading = true;
    this.eventService.getEventsForMonth(this.currentDate)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(events => {
        this.events = events;
      });
  }

  onPreviousMonth() {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() - 1,
      1
    );
    this.loadEvents();
  }

  onNextMonth() {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      1
    );
    this.loadEvents();
  }

  onToday() {
    this.currentDate = new Date();
    this.loadEvents();
  }

  onDateSelected(date: Date) {
    this.openEventModal(date);
  }

  onEventClicked(event: CalendarEvent) {
    this.openEventModal(event.start, event);
  }

  onEventMoved(data: { event: CalendarEvent, newDate: Date }) {
    const { event, newDate } = data;
    const updatedEvent: CalendarEvent = {
      ...event,
      start: newDate,
      end: new Date(newDate.getTime() + (event.end.getTime() - event.start.getTime()))
    };
    
    this.eventService.updateEvent(updatedEvent);
    this.loadEvents();
  }

  private openEventModal(date: Date, event?: CalendarEvent) {
    const dialogRef = this.dialog.open(EventModalComponent, {
      width: '400px',
      data: {
        date,
        event
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      
      if (result.delete) {
        this.eventService.deleteEvent(event!.id);
      } else if (event) {
        this.eventService.updateEvent({ ...event, ...result });
      } else {
        this.eventService.addEvent({
          ...result,
          start: date,
          end: new Date(date.getTime() + 60 * 60 * 1000) // 1 hour duration by default
        });
      }
      this.loadEvents();
    });
  }
}
