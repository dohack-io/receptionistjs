import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import AWS = require('aws-sdk');
import uniqid = require('uniqid');

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
    debugger;
    const credentials = new AWS.SharedIniFileCredentials({ profile: 'dohack' });
    AWS.config.credentials = credentials;
    AWS.config.update({
      region: 'eu-west-1',
    });

    const docClient = new AWS.DynamoDB.DocumentClient();

    const table = 'receptionistjs';

    const params = {
      TableName: table,
      Item: {
        id: uniqid('event-'),
        name: 'Test Event',
        description:
          'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et',
      },
    };

    var params1 = {
      TableName: table,
    };

    docClient.scan(params1, function(err, data) {
      if (err) {
        console.error('Unable to query. Error:', JSON.stringify(err, null, 2));
      } else {
        console.log('Query succeeded.');
        data.Items.forEach(function(item) {
          console.log(' -', item.year + ': ' + item.title);
        });
      }
    });
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
