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

const response = (type, message, end, event, card, reprompt) => {
  const outputSpeech = output(type, message);
  const sessionAttributes = attributes(event);

  let response = {
    version: '1.0',
    response: {
      outputSpeech,
      shouldEndSession: end,
      card,
      reprompt
    },
    sessionAttributes
  };
  console.log('response', response);
  return response;
};

export class Ability {

  constructor(event, callback) {
    this.ev = intent(event);
    this.call = callback;

    console.log('request', event.request);
    console.log('event', event);
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
  }

  event() {
    return this.ev;
  }

  callback(...argument) {
    return this.call(...argument);
  }

  async send(...argument) {
    return await this.call(null, response(...argument, this.ev, this.c, this.re));
  }

  say(...argument) {
    return this.send('text', ...argument);
  }

  ssml(...argument) {
    return this.send('ssml', ...argument);
  }

  card(obj) {
    this.c = obj;
  }

  linkAccount() {
    this.card({
      type: 'LinkAccount'
    })
  }

  reprompt(type, message) {
    this.re = {
      outputSpeech: output(type, message)
    }
  }

  error(func) {
    func();
    return this;
  }
}
