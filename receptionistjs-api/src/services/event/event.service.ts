import { Injectable, Logger } from '@nestjs/common';
import AWS = require('aws-sdk');
import uniqid = require('uniqid');
import { EventModel } from '../../shared/event.model';

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

  public async readEvents(): Promise<any> {
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

    await this.docClient.put(params).promise().then((data) => {
        Logger.log('Added item:', JSON.stringify(data, null, 2));
    }).catch((err) => {
        Logger.error('Unable to add item. Error JSON:', JSON.stringify(err, null, 2));
    });
  }
}
