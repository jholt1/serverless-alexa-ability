import { get, clone } from 'lodash';

const output = (type, message) => {
  let obj = {};

  obj.type = type === 'text' ? 'PlainText' : 'SSML';
  obj[type] = message;

  return obj;
};

const attributes = (event) => {
  let attr = event.session.attributes;
  let intents = clone(get(attr, '__intents__', []));

  intents.push(event.request.intent.name);
  attr.__intents__ = intents;

  return attr;
};

const intent = (event) => {
  let handler = typeof event.session.attributes.__intents__ === 'object' ?
    `${event.session.attributes.__intents__.join('/')}/` :
    '';

  handler += event.request.intent.name;
  event.handler = handler;

  return event;
};

export class Ability {

  constructor(event, callback) {
    this.ev = intent(event);
    this.call = callback;

    this.output = {
      version: '1.0',
      response: {}
    };

    // console.log('request', event.request);
    // console.log('event', event);
  }

  async on(intent, func) {
    if (intent === this.ev.handler) {
      await func(this);
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
    func();
    return this;
  }
}
