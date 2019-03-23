import { Controller, Post, Body, Get } from '@nestjs/common';
import { EventService } from '../../services/event/event.service';
import { EventModel } from '../../shared/event.model';

@Controller('events')
export class EventsController {
  constructor(private eventService: EventService) {}

  @Post()
  public async onCreateEvent(@Body() event: EventModel) {
    await this.eventService.createEvent(event);
  }

  @Get()
  public onReadEvents() {
    return this.eventService.readEvents().then(data => {
        return data;
    });
  }
}
