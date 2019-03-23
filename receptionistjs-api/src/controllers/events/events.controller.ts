import { Controller, Post, Body, Get, Header, Param } from '@nestjs/common';
import { EventService } from '../../services/event/event.service';
import { EventModel } from '../../shared/event.model';
import { RegistrationModel } from 'src/shared/registration.model';

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

  @Post(':id/register')
  @Header('Access-Control-Allow-Origin', '*')
  public async  onCreateRegistration(@Param('id') id, @Body() registration: RegistrationModel) {
    const event = await this.eventService.readEvent(id);
    const attendees: RegistrationModel[] = event.attendees;
    await this.eventService.updateRegistration(id, registration, attendees);
    
    return true;
  }
}
