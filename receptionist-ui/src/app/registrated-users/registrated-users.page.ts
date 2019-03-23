import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registrated-users',
  templateUrl: './registrated-users.page.html',
  styleUrls: ['./registrated-users.page.scss'],
})
export class RegistratedUsersPage implements OnInit {

  eventId: number;
  eventName: string;
  eventAttendees: any = [];


  constructor(private route: ActivatedRoute,
              private http: HttpClient) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.eventId = params['id'];
      this.eventName = params['name'];
  });
  console.log(this.eventId);

  this.http.get(`http://localhost:5000/events/${this.eventId}`).toPromise().then((value) => {
    console.log(value);
    this.eventAttendees = value;
  }).catch((err) => {
    console.log(err);
  });
  }
}
