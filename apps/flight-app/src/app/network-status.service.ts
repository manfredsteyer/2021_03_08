import { Inject, Injectable, InjectionToken } from '@angular/core';
import { interval, Observable } from 'rxjs';
import {
  distinctUntilChanged,
  map,
  shareReplay,
  startWith
} from 'rxjs/operators';

export type Randomizer = () => number;

export const RANDOMIZER = new InjectionToken<Randomizer>('Randomizer', {
  providedIn: 'root',
  factory: () => Math.random
});


@Injectable({ providedIn: 'root' })
export class NetworkStatus {
  constructor(@Inject(RANDOMIZER) private randomFn: Randomizer) {
  }

  get online$(): Observable<boolean> {
    return interval(2000).pipe(
      startWith(0),
      map(_ => this.randomFn() < 0.5),
      distinctUntilChanged(),
      shareReplay({ bufferSize: 1, refCount: true }));
  }
}
