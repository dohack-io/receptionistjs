import { Controller, Post, Body, Get, Header, Param, Options } from '@nestjs/common';
import { EventService } from '../../services/event/event.service';
import { EventModel } from '../../shared/event.model';
import { RegistrationModel } from 'src/shared/registration.model';

@Controller('events')
export class EventsController {
  constructor(private eventService: EventService) {}

  @Post()
  public async onCreateEvent(@Body() event: EventModel) {
    await this.eventService.createEvent(event);
  }

  @Get()
  public onReadEvents() {
    return this.eventService.readEvents();
  }

  @Get(':id')
  public onReadRegistrations(@Param('id') id) {
    return this.eventService.readEvent(id);
  }

  @Post(':id/register')
  public async  onCreateRegistration(@Param('id') id, @Body() registration: RegistrationModel) {
    const event = await this.eventService.readEvent(id);
    const attendees: RegistrationModel[] = event.attendees;
    return await this.eventService.updateRegistration(id, registration, attendees);
  }
}
