import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoadingController, AlertController } from '@ionic/angular';


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
              private http: HttpClient,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.eventId = params['id'];
      this.eventName = params['name'];
    });
  }

  async register(form) {
    const loader = await this.loadingCtrl.create({
      message: 'Bitte warten...',
    });
    await loader.present();

    const data = {
      'firstName': form.form.controls.firstName.value,
      'lastName': form.form.controls.lastName.value,
      'eMail': form.form.controls.eMail.value,
      'street': form.form.controls.street.value,
      'postCode': form.form.controls.postCode.value,
      'city': form.form.controls.city.value,
      'birthDate': form.form.controls.birthDate.value,
      'phoneNumber': form.form.controls.phoneNumber.value,
    };

    console.log(data);

    this.http.post(`http://localhost:5000/events/${this.eventId}/register`, data)
    .toPromise()
    .then((value) => {
      console.log(value);
      form.reset();
      this.onAlert('Registrierung erfolgreich');
    })
    .catch((err) => {
      console.log(err);
      this.onAlert('Es trat ein Fehler auf');
    });
    await loader.dismiss();
  }
  async onAlert(message: string) {
    const alert =  await this.alertCtrl.create({
      message: message,
      buttons: ['OK']
    });

    alert.present();
   }
}
