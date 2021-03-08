import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { combineLatest, iif, interval, Observable, of, Subject, throwError, timer } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { buffer, bufferTime, bufferWhen, catchError, concatMap, debounceTime, delay, distinctUntilChanged, exhaust, exhaustMap, filter, map, mapTo, mergeMap, retryWhen, shareReplay, startWith, switchMap, take, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { Flight } from '@flight-workspace/flight-lib';

@Component({
    selector: 'flight-lookahead',
    templateUrl: './flight-lookahead.component.html'
})
export class FlightLookaheadComponent implements OnInit, OnDestroy {


    closeSubj = new Subject<void>();
    show = true;

    control: FormControl;
    flights$: Observable<Flight[]>;
    loading = false;

    // online = false;     // <-- Hinterfragen
    online$: Observable<boolean>;

    subject = new Subject();

    constructor(private http: HttpClient) {
    }

    ngOnDestroy() {
        this.closeSubj.next();
        this.closeSubj.complete();
    }

    toggle() {
        this.show = !this.show;
    }

    refresh() {
        this.subject.next(this.control.value)
    }

    ngOnInit() {

        this.subject.pipe(
            //switchMap(([input]) => this.online$.pipe(map(online => ([input, online]))))
            withLatestFrom(this.online$),
            tap(([input, online]) => console.log(input, online) )
        )

        this.control = new FormControl();

        const input$ = this.control.valueChanges.pipe(
            debounceTime(300),
            filter(x => x.length >= 3),
            distinctUntilChanged(),
        );

        this.online$ 
            = interval(2000).pipe( // ..1..2..3
                    startWith(0),  // 0..1..2..3
                    // tap(v => console.log('intervall', v)),
                    map(_ => Math.random() < 0.5), // t, t, f, f, t
                    map(_ => true),
                    distinctUntilChanged(), // t, f, t
                    shareReplay({ bufferSize: 1, refCount: true})
                    //shareReplay(1),
                    // tap(value => this.online = value)
            );

        this.flights$ = combineLatest([input$, this.online$]).pipe(
            filter( ([, online]) => online),
            map( ([input, ]) => input),
            tap(_ => this.loading = true),
            switchMap(name => this.load(name)),
            tap(_ => this.loading = false)
        );


       

        // subscr.unsubscribe();

        // this.flights$ = combineLatest([input$, this.online$]).pipe(
        //     switchMap(([input, online]) => this.search(input, online))
        // );

    }

    search(input: string, online: boolean): Observable<Flight[]> {
        if (input.length >= 3) {
            return of([input, online] as [string, boolean]).pipe(
                filter( ([_, online]) => online),
                map( ([input, ]) => input),
                tap(_ => this.loading = true),
                switchMap(name => this.load(name)),
                tap(_ => this.loading = false)
            );
        }
        else {
            return of([]);
        }
    }

    load(from: string)  {
        const url = 'http://www.angular.at/api/flight';

        const params = new HttpParams()
                            .set('from', from);

        const headers = new HttpHeaders()
                            .set('Accept', 'application/json');

        let counter = 0;
        return this.http.get<Flight[]>(url, {params, headers}).pipe(
           // delay(7000)
        
            retryWhen(err$ => err$.pipe(
                switchMap(err => {
                    if (++counter <= 3) {
                        return of(err);
                    }
                    else {
                        return throwError(err);
                    }
                })
            )
                                
            ),
            catchError(err => {
                // return throwError(err);
                console.log('log', err);
                return of([]);
            })
        )

    }

}
