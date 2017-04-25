import { get, clone } from 'lodash';
import ua from 'universal-analytics';

const output = (type, message) => {
  let obj = {};

  obj.type = type === 'text' ? 'PlainText' : 'SSML';
  obj[type] = message;

  return obj;
};

const attributes = (event) => {
  let attr = event.session.attributes || {};
  let intents = clone(get(attr, '__intents__', []));

  if (event.request.intent) {
    intents.push(event.request.intent.name);
  }

  attr.__intents__ = intents;

  return attr;
};

const intent = (event) => {
  let handler = '';

  if (
    typeof event.session === 'object' &&
    typeof event.session.attributes === 'object' &&
    typeof event.session.attributes.__intents__ === 'object'
  ) {
    handler += `${event.session.attributes.__intents__.join('/')}/`;
  } else {
    if (!event.session) {
      event.session = {};
      event.session.attributes = {};
    }

    if (!event.session.attributes) {
      event.session.attributes = {};
    }
  }

  if (event.request.intent) {
    handler += event.request.intent.name;
  } else {
    handler += event.request.type;
  }


  event.handler = handler;

  return event;
};

export class Ability {

  constructor(event, callback, options) {
    this.ev = intent(event);
    this.call = callback;
    this.sent = false;

    if(options && options.ga) {
      this.visitor = ua(options.ga);
      this.visitor.set('uid', this.ev.session.user.userId);
    }

    this.output = {
      version: '1.0',
      response: {}
    };

    console.log(this.ev);
    // console.log('request', event.request);
    // console.log('event', event);
  }

  insights(type, data) {
    if (this.visitor) {
      this.visitor[type](data).send();
    }

    return this;
  }

  async on(intent, func) {
    if (intent === this.ev.handler) {
      this.sent = true;
      this.insights('pageview', intent);

      await func(this);
    }

    if (intent === `${this.ev.handler}/AMAZON.StopIntent`) {
      this.end();
    }

    return this;
  }

  session(obj) {
    const keys = Object.keys(obj);

    keys.forEach((key) => {
      this.ev.session.attributes[key] = obj[key];
    });

    return this;
  }

  event() {
    return this.ev;
  }

  callback(...argument) {
    return this.call(...argument);
  }

  create(end) {
    this.output.response.shouldEndSession = end;
    this.output.sessionAttributes = attributes(this.ev);

    this.call(null, this.output);

    return this;
  }

  end() {
    this.create(true);

    return this;
  }

  converse() {
    this.create(false);

    return this;
  }

  send(type, message) {
    this.output.response.outputSpeech = output(type, message);

    return this;
  }

  say(message) {
    this.send('text', message);
    this.insights('event', {
      ec: 'say',
      ea: message
    });

    return this;
  }

  ssml(message) {
    this.send('ssml', message);

    return this;
  }

  card(obj) {
    this.output.response.card = obj;

    return this;
  }

  linkAccount() {
    this.card({type: 'LinkAccount'});

    return this;
  }

  reprompt(type, message) {
    this.output.response.reprompt = {
      outputSpeech: output(type, message)
    }

    return this;
  }

  repromptSay(message) {
    this.reprompt('text', message);

    return this;
  }

  repromptSsml(message) {
    this.reprompt('ssml', message);

    return this;
  }

  error(func) {
    if (!this.sent) {
      func();
    }

    return this;
  }
}
