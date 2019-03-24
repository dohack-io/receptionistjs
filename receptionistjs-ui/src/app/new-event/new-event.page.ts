import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { LoadingController, AlertController } from "@ionic/angular";
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: "app-new-event",
  templateUrl: "./new-event.page.html",
  styleUrls: ["./new-event.page.scss"]
})
export class NewEventPage implements OnInit {
  private selectedEventType = '';

  constructor(
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
  ) {
  }

  ngOnInit() {}

  public onChange($event) {
    this.selectedEventType = $event.detail.value;
  }

  async create(form) {
    const loader = await this.loadingCtrl.create({
      message: 'Please wait..'
    });
    await loader.present();

    const data = {
      name: form.form.controls.name.value,
      description: form.form.controls.description.value,
      location: form.form.controls.location.value,
      type: this.selectedEventType,
      contactPerson: form.form.controls.contactPerson.value
    };

    console.log(data);

    this.http
      .post(`http://localhost:5000/events`, data)
      .toPromise()
      .then(value => {
        console.log(value);
        form.reset();
        this.onAlert('New event was successfully created');
      })
      .catch(err => {
        console.log(err);
        this.onAlert('Oops! Something went wrong.');
      });
    await loader.dismiss();
  }
  async onAlert(message: string) {
    const alert = await this.alertCtrl.create({
      message: message,
      buttons: ["OK"]
    });

    alert.present();
  }
}
