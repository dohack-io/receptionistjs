import { Module } from '@nestjs/common';
import { EventService } from './services/event/event.service';
import { EventsController } from './controllers/events/events.controller';

@Module({
  imports: [],
  controllers: [EventsController],
  providers: [EventService],
})
export class AppModule {}
