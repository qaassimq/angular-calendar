import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { CalendarEvent } from '../models/calendar-event.interface';

interface CalendarDay {
  date: Date;
  events: CalendarEvent[];
  isCurrentMonth: boolean;
  isToday: boolean;
}

@Component({
  selector: 'app-month-view',
  templateUrl: './month-view.component.html',
  styleUrls: ['./month-view.component.scss']
})
export class MonthViewComponent implements OnInit {
  @Input() currentDate: Date = new Date();
  @Input() events: CalendarEvent[] = [];
  @Output() dateSelected = new EventEmitter<Date>();
  @Output() eventClicked = new EventEmitter<CalendarEvent>();
  @Output() eventMoved = new EventEmitter<{event: CalendarEvent, newDate: Date}>();

  calendarDays: CalendarDay[] = [];
  weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  ngOnInit() {
    this.generateCalendarDays();
  }

  ngOnChanges() {
    this.generateCalendarDays();
  }

  private generateCalendarDays() {
    const firstDayOfMonth = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      1
    );
    const lastDayOfMonth = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      0
    );

    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const endDate = new Date(lastDayOfMonth);
    if (endDate.getDay() !== 6) {
      endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
    }

    const today = new Date();
    this.calendarDays = [];

    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      this.calendarDays.push({
        date: new Date(date),
        events: this.getEventsForDay(date),
        isCurrentMonth: date.getMonth() === this.currentDate.getMonth(),
        isToday: this.isSameDay(date, today)
      });
    }
  }

  private getEventsForDay(date: Date): CalendarEvent[] {
    return this.events.filter(event => this.isSameDay(event.start, date));
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  onDateClick(day: CalendarDay) {
    this.dateSelected.emit(day.date);
  }

  onEventClick(event: CalendarEvent, mouseEvent: MouseEvent) {
    mouseEvent.stopPropagation();
    this.eventClicked.emit(event);
  }

  onEventDrop(event: CdkDragDrop<CalendarDay>) {
    if (event.previousContainer !== event.container) {
      const calendarEvent = event.previousContainer.data.events[event.previousIndex];
      const newDate = event.container.data.date;
      
      this.eventMoved.emit({
        event: calendarEvent,
        newDate: newDate
      });
    }
  }
}
