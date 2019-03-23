import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-registrated-users',
  templateUrl: './registrated-users.page.html',
  styleUrls: ['./registrated-users.page.scss'],
})
export class RegistratedUsersPage implements OnInit {

  eventId: number;

  constructor(private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.eventId = params['id'];
  });
  }
}
