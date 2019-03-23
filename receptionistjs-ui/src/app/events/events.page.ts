import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {

  private events: any = [];

  constructor(private http: HttpClient,
              private router: Router) {
  }

  ngOnInit() {
    this.http.get('http://localhost:5000/events').toPromise().then((value) => {
      console.log(value);
      this.events = value;
    }).catch((err) => {
      console.log(err);
    });
  }


  onOpenEvent(eventId: number, eventName: string) {
    this.router.navigate(['registration'], { queryParams: { id: eventId, name: eventName } });
  }

  onOpenRegistratedUsers(eventId: number, eventName: string) {
    this.router.navigate(['registrated-users'], { queryParams: { id: eventId, name: eventName } });
  }

}
