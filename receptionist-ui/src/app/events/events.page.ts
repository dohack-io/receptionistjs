import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {

  private events = [
    {
      'id': '123456789',
      'name': 'Test Event',
      'description': 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et'
    },
    {
      'id': '123456790',
      'name': 'Test Event',
      'description': 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et'
    },
    {
      'id': '123456791',
      'name': 'Test Event',
      'description': 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et'
    }
  ];

  constructor(private http: HttpClient,
              private router: Router) {


    this.http.get('https://xkcd.com/info.0.json').toPromise().then((value) => {
      console.log(value);
    }).catch((err) => {
      console.log(err);
    });
  }

  ngOnInit() {
  }

  onOpenEvent(eventId: number, eventName: string) {
    this.router.navigate(['registration'], { queryParams: { id: eventId, name: eventName } });
  }

}
