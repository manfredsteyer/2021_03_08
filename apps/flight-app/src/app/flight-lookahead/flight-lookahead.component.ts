import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Flight } from '@flight-workspace/flight-lib';
import { Observable } from 'rxjs';
import { FlightLookaheadService } from './flight-lookahead.service';

@Component({
  selector: 'flight-lookahead',
  templateUrl: './flight-lookahead.component.html'
})
export class FlightLookaheadComponent implements OnInit {
  show = true;

  control: FormControl;
  loading = false;
  flights$: Observable<Flight[]>;

  online$: Observable<boolean> = this.flightLookaheadService.online$;


  constructor(private flightLookaheadService: FlightLookaheadService) {
  }

  toggle() {
    this.show = !this.show;
  }

  refresh() {
  }

  ngOnInit() {
    this.control = new FormControl();
    this.flights$ = this.flightLookaheadService.search(this.control.valueChanges);
  }


}
