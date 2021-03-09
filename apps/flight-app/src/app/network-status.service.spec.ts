import { interval } from 'rxjs';
import { marbles } from 'rxjs-marbles';
import { take } from 'rxjs/operators';
import { NetworkStatus } from './network-status.service';

describe('NetworkStatusService', () => {

  it('should initially emit offline with random 0.50', marbles((m) => {
    const networkStatus = new NetworkStatus(() => .50);
    const destination = networkStatus.online$.pipe(take(1));

    m.expect(destination).toBeObservable('(a|)', { a: false });
  }));

  it('should initially emit online with random 0.49', marbles((m) => {
    const networkStatus = new NetworkStatus(() => 0.49);
    const destination = networkStatus.online$.pipe(take(1));

    m.expect(destination).toBeObservable('(a|)', { a: true });
  }));

  it('should emit every 2 seconds', marbles((m) => {
    const randoms = [0, .99, 0.25, .75, .4].reverse();
    const randomFn = () => randoms.pop();

    const networkStatus = new NetworkStatus(randomFn);
    const destination = networkStatus.online$.pipe(take(5));
    m.expect(destination).toBeObservable('t 1999ms f 1999ms t 1999ms f 1999ms (t|)', {
      t: true, f: false
    });
  }));

  it('should verify distinct', marbles((m) => {
    const randoms = [.9, .8, .7, .6, .5, .4].reverse();
    const randomFn = () => randoms.pop();

    const networkStatus = new NetworkStatus(randomFn);
    const destination = networkStatus.online$.pipe(take(2));
    m.expect(destination).toBeObservable('f 9999ms (t|)', {
      t: true, f: false
    });
  }));


  it('should verify shareReplay', marbles((m) => {
    const randoms = [0, .9, .4].reverse();
    const randomFn = () => randoms.pop();

    const source = new NetworkStatus(randomFn).online$.pipe(take(2));

    const sub1 = '^';
    const sub2 = '1999ms ^';
    const sub3 = '2001ms ^';
    const dest1 = 't 1999ms (f|)';
    const dest2 = '1999ms t (f|)';
    const dest3 = '2001ms t 1999ms (f|)';

    m.expect(source, sub1).toBeObservable(dest1, { t: true, f: false });
    m.expect(source, sub2).toBeObservable(dest2, { t: true, f: false });
    m.expect(source, sub3).toBeObservable(dest3, { t: true, f: false });
  }));

  it('should do basic things', marbles((m) => {
    const dest = interval(1000).pipe(take(1));
    m.expect(dest).toBeObservable('1s (n|)', { n: 0 });
  }));

  it('should do old-school', (done) => {
    const dest = interval(1000).pipe(take(1));
    dest.subscribe(number => {
      expect(number).toBe(0);
      done();
    });
  });
});
