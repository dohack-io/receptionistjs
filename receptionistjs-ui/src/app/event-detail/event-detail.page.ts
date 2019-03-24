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
  event: {
    id: string;
    name?: string;
    type?: string;
    location?: string;
    description?: string;
    contactPerson?: string;
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
      .then((value) => {
        this.event = value
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
      type: form.form.controls.type.value,
      location: form.form.controls.location.value,
      description: form.form.controls.description.value,
      contactPerson: form.form.controls.contactPerson.value
    };

    this.http.put('http://localhost:5000/events', data).toPromise().then(value => {
      this.event = data
    });
    await loader.dismiss();
  }
}
