// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

import { App } from 'jovo-framework';
import { Alexa } from 'jovo-platform-alexa';
import { GoogleAssistant } from 'jovo-platform-googleassistant';
import { JovoDebugger } from 'jovo-plugin-debugger';
import { FileDb } from 'jovo-db-filedb';

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

    HelloWorldIntent() {
        this.ask('Hello World! What\'s your name?', 'Please tell me your name.');
    },

    AskNameIntent() {
        this.ask('Hello ' + this.$inputs.firstname.value + ' ' + this.$inputs.lastname.value + '. What Event do you wish to attend?', 'Please tell me the event you wish to attend');
    },

    MyNameIsIntent() {
        this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
    },

    WelcomeIntent() {
        this.ask('Welcome to DOHACKJS, What\'s your name?', 'Please tell me your name?')
    },

    EventIntent() {
        this.tell('Okay, ' +this.$inputs.eventName.value + '. Give me a second, while I look for you in my files.');
    }
});

module.exports.app = app;
