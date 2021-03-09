import { FlightService } from '@flight-workspace/flight-lib';
import { marbles } from 'rxjs-marbles';
import { NetworkStatus } from '../network-status.service';
import { FlightLookaheadService } from './flight-lookahead.service';

describe('FlightLookahead', () => {
  it('should delay in offline mode', marbles((m) => {
    const flights = [{
      id: 1,
      from: 'Wien',
      to: 'Berlin',
      delayed: false,
      date: '2021-03-09'
    }];
    const online$ = m.cold('f 1s t', {
      f: false,
      t: true
    });
    const find$ = m.cold('f', { f: flights });

    const networkStatus = { online$ } as unknown as NetworkStatus;
    const flightService = { find: () => find$ } as unknown as FlightService;
    const service = new FlightLookaheadService(flightService, networkStatus);
    const flights$ = service.search(m.cold('w', { w: 'Wien' }));

    m.expect(flights$).toBeObservable('1001ms f', { f: flights });
  }));

  it('should load immediately in online mode', marbles((m) => {
    const flights = [{
      id: 1,
      from: 'Wien',
      to: 'Berlin',
      delayed: false,
      date: '2021-03-09'
    }];
    const online$ = m.cold('t', {
      f: false,
      t: true
    });
    const find$ = m.cold('f', { f: flights });

    const networkStatus = { online$ } as unknown as NetworkStatus;
    const flightService = { find: () => find$ } as unknown as FlightService;
    const service = new FlightLookaheadService(flightService, networkStatus);
    const flights$ = service.search(m.cold('w', { w: 'Wien' }));

    m.expect(flights$).toBeObservable('300ms f', { f: flights });
  }));
});
