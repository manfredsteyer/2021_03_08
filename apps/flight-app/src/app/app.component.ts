import {Component, OnInit} from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';

@Component({
  selector: 'flight-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
 
  ngOnInit(): void {
    const sub = new BehaviorSubject<string>('init');
   
    sub.next('A');
    sub.next('B');
    sub.next('C');

    sub.subscribe(v => console.log(v));
  }

}
