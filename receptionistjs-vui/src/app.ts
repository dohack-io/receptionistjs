// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

import { App } from 'jovo-framework';
import { Alexa } from 'jovo-platform-alexa';
import { GoogleAssistant } from 'jovo-platform-googleassistant';
import { JovoDebugger } from 'jovo-plugin-debugger';
import { FileDb } from 'jovo-db-filedb';
import { EventModel } from './EventModel';

const requestPromise = require('request-promise-native');

const app = new App();

app.use(new Alexa(), new GoogleAssistant(), new JovoDebugger(), new FileDb());

// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
    LAUNCH() {
        this.$user.$data.failures = 0;
        this.toIntent('WelcomeIntent');
    },

    MyNameIsIntent() {
        const name = this.$inputs.personName.value.split(' ');
        this.$user.$data.firstName = name[0];
        this.$user.$data.lastName = name[1];
        this.ask(
            'Hallo ' +
                name[0] +
                ' ' +
                name[1] +
                '. Bei welchem Event möchten Sie teilnehmen?',
            'Bitte nennen mir die Veranstaltung, an welche Sie teilnehmen möchten'
        );
    },

    WelcomeIntent() {
        let speech =
            "Willkommen, ich bin Ihr heutiger Rezeptionist. Wie heißen Sie?";
        let reprompt = 'Bitte sagen Sie mir Ihren Namen';
        this.ask(speech, reprompt);
    },

    EventState: {
        async YesIntent() {
            const events = await getEvents();
            const eventNames = [];
            for (const event of events) {
                eventNames.push(event.name);
            }
            // @ts-ignore
            let speech = this.speechBuilder();
            // @ts-ignore
            speech.addText('Die aktuell verfügbaren Veranstaltungen sind: ');
            for (let i = 0; i < eventNames.length; i++) {
                // @ts-ignore
                speech.addText(eventNames[i]);
                if (i == eventNames.length - 2) {
                    // @ts-ignore
                    speech.addText(' and ');
                } else if (i == eventNames.length - 1) {
                    // @ts-ignore
                    speech.addText('. ');
                } else {
                    // @ts-ignore
                    speech.addText(', ');
                }
            }

            // @ts-ignore
            speech
                .addBreak('1000ms')
                .addText('An welchen von diesen Elementen wollen Sie teilnehmen?');
            // @ts-ignore
            this.ask(speech, 'Bitte sagen Sie mir zu welcher Veranstaltung Sie gehen wollen');
            this.toIntent('EventIntent');
        },

        NoIntent() {
            this.tell("Bitte entschuldigen Sie. Ich kann Ihnen nicht helfen");
        }
    },

    async EventIntent() {
        const events = await getEvents();
        console.log('EVENTNAME:');
        console.log(this.$inputs.eventName);
        let foundEvent = events.filter(event =>
            event.name.toLowerCase().includes(this.$inputs.eventName.value.toLowerCase())
        )[0];
        console.log('FOUND EVENT: ' + foundEvent);
        if (foundEvent) {
            if (await validateAttendee.call(this, foundEvent.id)) {
                switch (foundEvent.type) {
                    case 'conference': {
                        this.tell(
                            'Super, ich habe Sie in meinen Unterlagen gefunden. Ihre Konferenz findet im Raum ' +
                                foundEvent.location + ' statt.'
                        );
                        break;
                    }
                    case 'appointment': {
                        this.tell(
                            'Super, ich habe Sie in meinen Unterlagen gefunden. ' +
                                foundEvent.contactPerson +
                                ' wurde soeben benachrichtigt und wird Sie in Kürze Willkommen heißen.'
                        );
                        break;
                    }
                    default: {
                        this.tell(
                            'Super, ich habe Sie in meinen Unterlagen gefunden. Ihre Veranstaltung findet im Raum ' +
                                foundEvent.location + ' statt'
                        );
                    }
                }
            } else {
                this.tell(
                    'Entschuldigen Sie, ich konnte Sie in meinen Unterlagen nicht finden. Ich habe soeben ' +
                        foundEvent.contactPerson +
                        ' benachrichtigt, welcher Sie in Kürze im Empfang nehmen wird.'
                );
            }
        } else {
            this.$user.$data.failures++;
            if (this.$user.$data.failures <= 2) {
                let speech =
                    'Entschuldigen Sie, ich konnte Ihre Veranstaltung nicht finden. Möchten Sie eine Auflistung aller kommenden Veranstaltung ausgegeben bekommen?';
                this.followUpState('EventState').ask(
                    speech,
                    'Bitte antworten Sie mit Ja oder Nein.'
                );
            } else {
                this.tell(
                    "Entschuldigen Sie, ich glaube ich kann Ihnen nicht helfen. Ein Mitarbeiter wurde soeben benachrichtigt und wird sich in Kürze um Ihr Anliegen kümmern."
                );
            }
        }
    }
});

async function getEvents(): Promise<EventModel[]> {
    const options = {
        uri: 'http://localhost:5000/events',
        json: true
    };
    return await requestPromise(options);
}

async function validateAttendee(eventID: string) {
    const options = {
        uri: `http://localhost:5000/events/${eventID}/validate`,
        json: true,
        method: 'POST',
        body: {
            // @ts-ignore
            firstName: this.$user.$data.firstName,
            // @ts-ignore
            lastName: this.$user.$data.lastName
        }
    };
    const response = await requestPromise(options).catch(() => {
        return { isRegistered: false };
    });
    return response.isRegistered === true;
}

module.exports.app = app;
