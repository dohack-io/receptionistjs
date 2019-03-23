import { Controller, Post, Body, Get, Header } from '@nestjs/common';
import { EventService } from '../../services/event/event.service';
import { EventModel } from '../../shared/event.model';

@Controller('events')
export class EventsController {
  constructor(private eventService: EventService) {}

  @Post()
  @Header('Access-Control-Allow-Origin', '*')
  public async onCreateEvent(@Body() event: EventModel) {
    await this.eventService.createEvent(event);
  }

  @Get()
  @Header('Access-Control-Allow-Origin', '*')
  public onReadEvents() {
    return this.eventService.readEvents();
  }
}
