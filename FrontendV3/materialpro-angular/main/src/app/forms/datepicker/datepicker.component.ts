import { Component } from '@angular/core';
import { DateAdapter } from '@angular/material';
import {FormControl} from '@angular/forms';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';


@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss']
      
})
export class DatepickerComponent {
    //this is for the start date
    startDate = new Date(1990, 0, 1);
    
    //Datepicker selected value
    date = new FormControl(new Date());
    serializedDate = new FormControl((new Date()).toISOString());

    //Datepicker input and change event

    events: string[] = [];

    addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
        this.events.push(`${type}: ${event.value}`);
    }

    
}
