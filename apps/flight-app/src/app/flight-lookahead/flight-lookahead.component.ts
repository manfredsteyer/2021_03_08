import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FlightLookaheadService } from './flight-lookahead.service';

@Component({
    selector: 'flight-lookahead',
    templateUrl: './flight-lookahead.component.html'
})
export class FlightLookaheadComponent implements OnInit {

    flights$ = this.service.flights$;
    online$ = this.service.online$;
    control = new FormControl();

    constructor(private service: FlightLookaheadService) {
    }

    ngOnInit(): void {
        this.control.valueChanges.subscribe(from => {
            this.service.search(from);
        });
    }

}
