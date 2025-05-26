import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CalendarEvent } from '../models/calendar-event.interface';

interface DialogData {
  date: Date;
  event?: CalendarEvent;
}

@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.component.html',
  styleUrls: ['./event-modal.component.scss']
})
export class EventModalComponent {
  eventForm: FormGroup;
  isEditMode: boolean;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EventModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.isEditMode = !!data.event;
    this.eventForm = this.fb.group({
      title: [data.event?.title || '', Validators.required],
      description: [data.event?.description || ''],
      color: [data.event?.color || '#1976d2']
    });
  }

  onSubmit() {
    if (this.eventForm.valid) {
      this.dialogRef.close(this.eventForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  onDelete() {
    this.dialogRef.close({ delete: true });
  }
}
