import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss']
})
export class EventsPage implements OnInit {
  private events: any = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private loadingController: LoadingController,
  ) {}

  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();
    await this.http
      .get('http://localhost:5000/events')
      .toPromise()
      .then(value => {
        console.log(value);
        this.events = value;
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        loading.dismiss();
      });
  }

  onOpenEvent(eventId: number, eventName: string) {
    this.router.navigate(['registration'], {
      queryParams: { id: eventId, name: eventName }
    });
  }

  onOpenRegistratedUsers(eventId: number, eventName: string) {
    this.router.navigate(['registrated-users'], {
      queryParams: { id: eventId, name: eventName }
    });
  }

  onEditEvent(eventId: number) {
    this.router.navigate(['event-detail'], {
      queryParams: { id: eventId}
    })
  }
}
