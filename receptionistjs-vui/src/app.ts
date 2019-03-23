// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

import { App } from 'jovo-framework';
import { Alexa } from 'jovo-platform-alexa';
import { GoogleAssistant } from 'jovo-platform-googleassistant';
import { JovoDebugger } from 'jovo-plugin-debugger';
import { FileDb } from 'jovo-db-filedb';

const requestPromise = require('request-promise-native');

const app = new App();

app.use(new Alexa(), new GoogleAssistant(), new JovoDebugger(), new FileDb());

// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
    LAUNCH() {
        this.toIntent('WelcomeIntent');
    },

    MyNameIsIntent() {
        this.$user.$data.firstName = this.$inputs.firstName.value;
        this.ask(
            'Hello ' +
            this.$inputs.firstname.value +
            ' ' +
            this.$inputs.lastname.value +
            '. What Event do you wish to attend?',
            'Please tell me the event you wish to attend'
        );
    },

    WelcomeIntent() {
        let speech =
            "Welcome, I am your receptionist for today. What's your name?";
        let reprompt = 'Please tell me your name?';
        this.ask(speech, reprompt);
    },

    EventState: {
        YesIntent() {
            const events = getEvents();
            const eventNames = [];
            for (const event of events) {
                eventNames.push(event.name);
            }
            // @ts-ignore
            let speech = this.speechBuilder();
            for (const eventName of eventNames) {
                // @ts-ignore
                speech.addText(eventName + ', ');
            }

            // @ts-ignore
            speech
                .addBreak('1000ms')
                .addText('To which of these events do you want to go?');
            // @ts-ignore
            this.ask(speech, 'Please tell me to which you want to go');
            this.toIntent('EventIntent');
        },

        NoIntent() {
            this.tell("Okay, I am sorry, that I could'nt help you");
        }
    },
    EventIntent() {
        const events = getEvents();
        let foundEvent = events.filter(event =>
            event.name.includes(this.$inputs.eventName.value)
        )[0];
        if (foundEvent) {

            this.tell('Great, I was able to find you in my notes. ');
            if (validateAttendee(foundEvent.id)) {

                switch (foundEvent.type) {
                    case 'conference': {
                        this.tell(
                            'Great, I was able to find you in my notes. Your conference is held at room ' +
                            foundEvent.location
                        );
                        break;
                    }
                    case 'appointment': {
                        this.tell(
                            'Great, I was able to find you in my notes. ' + foundEvent.contactperson + 
                            ' has been contacted and is on the way to welcome you'
                        );
                        break;
                    }
                    default: {
                        this.tell(
                            'Great, I was able to find you in my notes. Your Event is held at ' +
                            foundEvent.location
                        );
                    }
                }
            }
        } else {
            let speech =
                'Sorry, I could not find your Event. Do you want me to tell you, which Events are available?';
            this.followUpState('EventState').ask(
                speech,
                'Please answer with yes or no.'
            );
        }
    }
});

function getEvents() {
    /*const options = {
        uri: 'http://localhost/events',
        json: true
    };
    const data = await requestPromise(options);
    console.log(data);*/
    const mockEvents = [
        {
            id: '1',
            name: 'DOHACKJS',
            type: 'conference',
            contactperson: 'Schmidt',
            location: 'Untergeschoss',
            description:
                'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et'
        },
        {
            id: '5',
            name: 'Wrestlecon',
            type: 'conference',
            contactperson: 'Schmidt',
            location: 'Große Halle',
            description: 'A Super Convention for Wrestling'
        },
        {
            id: '5',
            name: 'Bewerbungsgespraech',
            type: 'appointment',
            contactperson: 'Schmidt',
            location: 'Große Halle',
            description: 'A Super Convention for Wrestling'
        }
    ];
    return mockEvents;
}

function validateAttendee(eventID: string) {
    const mockAttendees = [
        {
            id: '3242394235',
            firstName: 'Nils',
            lastName: 'Fenzl',
            eMail: 'nils.fenzl@sparqs.io',
            street: 'Brotkrümelallee 13',
            postCode: '99999',
            city: 'Musterstadt',
            birthDate: '01.01.1985',
            phoneNumber: '0123456789',
            hasAttended: false
        },
        {
            id: '5',
            firstName: 'Frederik',
            lastName: 'Hoffmann',
            eMail: 'frederik.hoffmann@sparqs.io',
            street: 'Spanischer Weg 45',
            postCode: '66666',
            city: 'Musterstadt',
            birthDate: '01.01.1985',
            phoneNumber: '01523773752468',
            hasAttended: false
        }
    ];

    // @ts-ignore
    return (
        mockAttendees.filter(attendee => {
            return (
                // @ts-ignore
                attendee.firstName === this.$user.$data.firstName &&
                // @ts-ignore
                this.$user.$data.lastName
            );
        }).length > 0
    );
}

module.exports.app = app;
