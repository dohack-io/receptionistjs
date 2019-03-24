import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { AlertController, LoadingController } from "@ionic/angular";

@Component({
  selector: "app-event-detail",
  templateUrl: "./event-detail.page.html",
  styleUrls: ["./event-detail.page.scss"]
})
export class EventDetailPage implements OnInit {
  private selectedEventType = '';
  event: {
    id: string;
    name?: string;
    type?: string;
    location?: string;
    description?: string;
    contactPerson?: string;
    attendees?: Array<any>;
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.event = { id: params["id"] };
    });
    this.loadEvent();
  }

  loadEvent() {
    this.http
      .get(`http://localhost:5000/events/${this.event.id}`)
      .toPromise<any>()
      .then(value => {
        this.event = value;
      });
  }

  async saveDetails(form) {
    const loader = await this.loadingCtrl.create({
      message: "Bitte warten..."
    });
    await loader.present();

    const data = {
      id: this.event.id,
      name: form.form.controls.name.value,
      type: this.selectedEventType,
      location: form.form.controls.location.value,
      description: form.form.controls.description.value,
      contactPerson: form.form.controls.contactPerson.value,
      attendees: this.event.attendees
    };

    this.http
      .put("http://localhost:5000/events", data)
      .toPromise()
      .then(value => {
        this.event = data;
        this.onAlert("Änderungen erfolgreich gespeichert");
      })
      .catch(err => {
        console.log(err);
        this.onAlert("Es trat ein Fehler auf");
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

  public onChange($event) {
    this.selectedEventType = $event.detail.value;
  }
}
