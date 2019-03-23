import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {

  constructor(    private route: ActivatedRoute,
                  private router: Router) { }

  ngOnInit() {
    const sub = this.route
    .queryParams
    .subscribe(params => {
      // Defaults to 0 if no query param provided.
      const page = +params['page'] || 0;
    });
    console.log(sub);
  }


}
