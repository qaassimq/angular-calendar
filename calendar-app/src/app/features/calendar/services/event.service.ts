import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CalendarEvent } from '../models/calendar-event.interface';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private readonly STORAGE_KEY = 'calendar_events';
  private eventsSubject = new BehaviorSubject<CalendarEvent[]>([]);

  constructor() {
    this.loadEvents();
  }

  private loadEvents(): void {
    const storedEvents = localStorage.getItem(this.STORAGE_KEY);
    if (storedEvents) {
      const events = JSON.parse(storedEvents).map((event: any) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end)
      }));
      this.eventsSubject.next(events);
    }
  }

  private saveEvents(events: CalendarEvent[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(events));
    this.eventsSubject.next(events);
  }

  getEvents(): Observable<CalendarEvent[]> {
    return this.eventsSubject.asObservable();
  }

  addEvent(event: Omit<CalendarEvent, 'id'>): void {
    const events = this.eventsSubject.value;
    const newEvent = {
      ...event,
      id: crypto.randomUUID()
    };
    this.saveEvents([...events, newEvent]);
  }

  updateEvent(event: CalendarEvent): void {
    const events = this.eventsSubject.value;
    const index = events.findIndex(e => e.id === event.id);
    if (index !== -1) {
      events[index] = event;
      this.saveEvents([...events]);
    }
  }

  deleteEvent(eventId: string): void {
    const events = this.eventsSubject.value;
    this.saveEvents(events.filter(event => event.id !== eventId));
  }

  getEventsForMonth(date: Date): Observable<CalendarEvent[]> {
    return new Observable(subscriber => {
      this.getEvents().subscribe(events => {
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        const filteredEvents = events.filter(event => 
          event.start >= monthStart && event.start <= monthEnd
        );
        subscriber.next(filteredEvents);
      });
    });
  }
}
