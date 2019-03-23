import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {

  eventId: number;
  eventName: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private http: HttpClient) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.eventId = params['id'];
      this.eventName = params['name'];
    });
  }

  register(form) {

    const data = {
      'id': this.eventId,
      'firstName': form.form.controls.firstName.value,
      'lastName': form.form.controls.lastName.value,
      'eMail': form.form.controls.eMail.value,
      'street': form.form.controls.street.value,
      'postCode': form.form.controls.postCode.value,
      'city': form.form.controls.city.value,
      'birthDate': form.form.controls.birthDate.value,
      'phoneNumber': form.form.controls.phoneNumber.value,
    };

    this.http.post('http://localhost:3000/events', JSON.stringify(data))
    .toPromise()
    .then((value) => {
      console.log(value);
    })
    .catch((err) => {
      console.log(err);
    }
    );
  }
}
