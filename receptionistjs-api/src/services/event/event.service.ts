import { Injectable, Logger } from '@nestjs/common';
import AWS = require('aws-sdk');
import uniqid = require('uniqid');
import { EventModel } from '../../shared/event.model';
import { RegistrationModel } from 'src/shared/registration.model';

@Injectable()
export class EventService {
  private table = 'receptionistjs';
  private docClient;

  constructor() {
    const credentials = new AWS.SharedIniFileCredentials({ profile: 'dohack' });
    AWS.config.credentials = credentials;
    AWS.config.update({
      region: 'eu-west-1',
    });
    this.docClient = new AWS.DynamoDB.DocumentClient();
  }

  public async readEvents() {
    const params = {
      TableName: this.table,
    };
    return await this.docClient
      .scan(params)
      .promise()
      .then(data => {
        Logger.log('Query succeeded.');
        data.Items.forEach(item => {
          delete item.attendees;
        });
        return data.Items as EventModel[];
      })
      .catch(err => {
        Logger.error('Unable to query. Error:', JSON.stringify(err, null, 2));
      });
  }

  public async readEvent(id: string) {
    const params = {
      TableName: this.table,
      Key: {
        id,
      },
    };

    return await this.docClient
      .get(params)
      .promise()
      .then(data => {
        Logger.log('GetItem succeeded:', JSON.stringify(data, null, 2));
        return data.Item;
      })
      .catch(err => {
        Logger.error(
          'Unable to read item. Error JSON:',
          JSON.stringify(err, null, 2),
        );
      });
  }

  public async createEvent(event: EventModel) {
    const item: EventModel = {
      id: uniqid('event-'),
      name: event.name,
      type: event.type,
      description: event.description,
      location: event.location,
      attendees: event.attendees || [],
    };
    const params = {
      TableName: this.table,
      Item: item,
    };

    await this.docClient
      .put(params)
      .promise()
      .then(data => {
        Logger.log('Added item:', JSON.stringify(data, null, 2));
      })
      .catch(err => {
        Logger.error(
          'Unable to add item. Error JSON:',
          JSON.stringify(err, null, 2),
        );
      });
  }

  public async updateRegistration(
    eventId: string,
    attendee: RegistrationModel,
    attendees: RegistrationModel[],
  ) {
    attendee.id = uniqid('attendee-');
    attendee.hasAttended = false;
    attendees.push(attendee);
    const params = {
      TableName: this.table,
      Key: {
        id: eventId,
      },
      UpdateExpression: 'set attendees = :a',
      ExpressionAttributeValues: {
        ':a': attendees,
      },
      ReturnValues: 'UPDATED_NEW',
    };

    return await this.docClient
      .update(params)
      .promise()
      .then((data) => {
        Logger.log('UpdateItem succeeded:', JSON.stringify(data, null, 2));
        return data;
      })
      .catch(err => {
        Logger.error(
          'Unable to update item. Error JSON:',
          JSON.stringify(err, null, 2),
        );
      });
  }
}
