import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {

  constructor(private http: HttpClient) {
    this.http.get('https://xkcd.com/info.0.json').toPromise().then((value) => {
      console.log(value);
    }).catch((err) => {
      console.log(err);
    })
  }

  ngOnInit() {
  }

}
