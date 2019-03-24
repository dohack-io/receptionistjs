import { Controller, Post, Body, Get, Header, Param, Options, HttpException, HttpStatus, Put } from '@nestjs/common';
import { EventService } from '../../services/event/event.service';
import { EventModel } from '../../shared/event.model';
import { RegistrationModel } from 'src/shared/registration.model';
import uniqid = require('uniqid');

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

  @Put()
  public async onUpdateEvent(@Body() event: EventModel) {
    const readEvent = await this.eventService.readEvent(event.id);
    return await this.eventService.updateEvent(event, readEvent.attendees);
  }

  @Post(':id/register')
  public async  onCreateRegistration(@Param('id') id, @Body() attendee: RegistrationModel) {
    const event = await this.eventService.readEvent(id);
    const attendees: RegistrationModel[] = event.attendees;
    const firstName: string = attendee.firstName.toLowerCase();
    const lastName: string = attendee.lastName.toLowerCase();
    const foundAttendee = attendees.find((existingAttendee) => {
      return  existingAttendee.firstName.toLowerCase() === firstName && existingAttendee.lastName.toLowerCase() === lastName;
    });
    if (foundAttendee) {
      throw new HttpException(`User ${firstName} ${lastName} is already registered`, HttpStatus.BAD_REQUEST);
    }
    attendee.id = uniqid('attendee-');
    attendee.hasAttended = false;
    attendees.push(attendee);
    return await this.eventService.updateRegistration(id, attendee, attendees);
  }

  @Post(':eventId/validate')
  public async  onConfirmRegistration(@Param('eventId') eventId, @Body() attendee: RegistrationModel) {
    const event = await this.eventService.readEvent(eventId);
    const attendees: RegistrationModel[] = event.attendees;
    const firstName: string = attendee.firstName.toLowerCase();
    const lastName: string = attendee.lastName.toLowerCase();
    const foundAttendee = attendees.find((existingAttendee) => {
      return  existingAttendee.firstName.toLowerCase() === firstName && existingAttendee.lastName.toLowerCase() === lastName;
    });
    if (!foundAttendee) {
      throw new HttpException(`User ${firstName} ${lastName} is not registered`, HttpStatus.PRECONDITION_FAILED);
    }
    foundAttendee.hasAttended = true;

    return await this.eventService.updateRegistration(eventId, attendee, attendees);
  }

}
