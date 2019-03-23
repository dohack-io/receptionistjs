// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

import {App} from 'jovo-framework';
import {Alexa} from 'jovo-platform-alexa';
import {GoogleAssistant} from 'jovo-platform-googleassistant';
import {JovoDebugger} from 'jovo-plugin-debugger';
import {FileDb} from 'jovo-db-filedb';
import mock = jest.mock;

const app = new App();

app.use(
    new Alexa(),
    new GoogleAssistant(),
    new JovoDebugger(),
    new FileDb(),
);


// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
    LAUNCH() {
        this.toIntent('WelcomeIntent');
    },

    MyNameIsIntent() {
        this.ask('Hello ' + this.$inputs.firstname.value + ' ' + this.$inputs.lastname.value + '. What Event do you wish to attend?', 'Please tell me the event you wish to attend');
    },

    WelcomeIntent() {
        this.ask('Welcome to DOHACKJS, What\'s your name?', 'Please tell me your name?')
    },

    EventState: {
        YesIntent() {
            this.tell('Yes')
        },

        NoIntent() {
            this.tell('No')
        }
    },
    EventIntent() {
        const events = getEvents();
        let found = events.filter(value => value.name.includes(this.$inputs.eventName.value)).length > 0;
        if (found) {
            this.tell('Okay, ' + this.$inputs.eventName.value + '. Give me a second, while I look for you in my files.');
        } else {
            this.followUpState('EventState').ask('Sorry, I could not find the your Event. Do you want me to tell you, which Events are availiable?', '')
        }
    }
});

function getEvents() {
    const mockEvents = [
        {
            id: '1',
            name: 'DOHACKJS',
            type: 'conference',
            description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et'
        }
    ];
    return mockEvents;
}

function validateAttendee(eventID: number) {
    const mockAttendees = [
        {
            id: "3242394235",
            firstName: "Nils",
            lastName: "Fenzl",
            eMail: "nils.fenzl@sparqs.io",
            street: "Brotkrümelallee 13",
            postCode: "99999",
            city: "Musterstadt",
            birthDate: "01.01.1985",
            phoneNumber: "0123456789",
            hasAttended: false
        },
        {
            id: "5",
            firstName: "Frederik",
            lastName: "Hoffmann",
            eMail: "frederik.hoffmann@sparqs.io",
            street: "Spanischer Weg 45",
            postCode: "66666",
            city: "Musterstadt",
            birthDate: "01.01.1985",
            phoneNumber: "01523773752468",
            hasAttended: false
        }
    ];

    // @ts-ignore
    return mockAttendees.filter(attendee => attendee.firstName === this.$user.$data.firstName && this.$user.$data.lastName).length > 0;
}

module.exports.app = app;
