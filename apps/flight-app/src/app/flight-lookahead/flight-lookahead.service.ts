import { Injectable } from '@angular/core';
import {Flight, FlightService} from '@flight-workspace/flight-lib';
import { combineLatest, interval, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, shareReplay, startWith, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FlightLookaheadService {

  readonly flights$: Observable<Flight[]>;
  private fromSubject = new Subject<string>();

  // Würde ich zum Testen ggf. in einen eigenen Service
  // auslagern und mocken.
  readonly online$ = interval(2000).pipe(
    startWith(0),
    map(_ => Math.random() < 0.5),
    distinctUntilChanged(),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  constructor(private flightService: FlightService) {
    const input$ = this.fromSubject.pipe(
      filter(input => input.length >= 3),
      debounceTime(300)
    )
    
    this.flights$ = combineLatest([input$, this.online$]).pipe(
      filter(([_, online]) => online),
      map(([from, _]) => from),
      switchMap(from => this.flightService.find(from, ''))
    );
  }

  search(from: string): void {
    this.fromSubject.next(from);
  }

}
