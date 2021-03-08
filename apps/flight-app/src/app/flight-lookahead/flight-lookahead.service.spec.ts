import { TestBed } from '@angular/core/testing';

import { FlightLookaheadService } from './flight-lookahead.service';

describe('FlightLookaheadService', () => {
  let service: FlightLookaheadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlightLookaheadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
