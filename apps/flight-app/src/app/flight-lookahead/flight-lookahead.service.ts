import { Injectable } from '@angular/core';
import { Flight, FlightService } from '@flight-workspace/flight-lib';
import { combineLatest, Observable } from 'rxjs';
import { debounceTime, filter, map, switchMap } from 'rxjs/operators';
import { NetworkStatus } from '../network-status.service';


@Injectable({
  providedIn: 'root'
})
export class FlightLookaheadService {

  readonly online$ = this.networkStatus.online$;

  constructor(private flightService: FlightService, private networkStatus: NetworkStatus) {
  }

  search(rawInput$: Observable<string>): Observable<Flight[]> {
    const input$ = rawInput$.pipe(
      filter(input => input.length >= 3),
      debounceTime(300)
    );

    return combineLatest([input$, this.online$]).pipe(
      filter(([, online]) => online),
      map(([from]) => from),
      switchMap(from => this.flightService.find(from, ''))
    );
  }

}
