import { get, clone, transform } from 'lodash';
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

  if (handler.charAt(0) === '/') {
    handler = handler.substr(1);
  }

  event.handler = handler;

  return event;
};

export class Ability {

  constructor(event, callback, options) {
    this.ev = intent(event);
    this.call = callback;
    this.sent = false;

    this.sl = transform(
      get(this.ev, 'request.intent.slots'),
      (obj, slot) => { obj[slot.name] = this.slotValue(slot); },
      {}
    );

    if(options && options.ga) {
      this.visitor = ua(options.ga);
      this.visitor.set('uid', this.ev.session.user.userId);
    }

    this.output = {
      version: '1.0',
      response: {}
    };
  }

  insights(type, data) {
    if (this.visitor) {
      this.visitor[type](data).send();
    }

    return this;
  }

  slotValue(slot){
    let value = slot.value;
    console.log(JSON.stringify(slot));
    let resolution = (slot.resolutions && slot.resolutions.resolutionsPerAuthority && slot.resolutions.resolutionsPerAuthority.length > 0) ? slot.resolutions.resolutionsPerAuthority[0] : null;
    if(resolution && resolution.status.code == 'ER_SUCCESS_MATCH'){
        let resolutionValue = resolution.values[0].value;
        value = resolutionValue.id ? resolutionValue.id : resolutionValue.name;
    }
    return value;
  }

  async on(intent, func) {

    this.ev.handler = this.ev.handler.replace(/AMAZON.RepeatIntent\//g, '');

    if (this.ev.handler !== 'LaunchRequest' && this.ev.handler !== 'AMAZON.HelpIntent') {
      this.ev.handler = this.ev.handler.replace('LaunchRequest/', '');
      this.ev.handler = this.ev.handler.replace('AMAZON.HelpIntent/', '');
    }

    if (intent === this.ev.handler) {
      this.sent = true;
      this.insights('pageview', this.ev.handler);

      await func(this);
    } else if (this.ev.handler.includes('AMAZON.StopIntent') || this.ev.handler.includes('AMAZON.CancelIntent')) {
      this.sent = true;
      this.end();
    } else if (this.ev.handler.includes('AMAZON.RepeatIntent'))  {
      const event = this.event();
      const attributes = event.session.attributes;
      const last = attributes.lastMessage;

      this.sent = true;
      this.insights('pageview', this.ev.handler);
      this.ev.handler = this.ev.handler.replace('/AMAZON.RepeatIntent', '');

      if (last) {
        this[last.type](last.message);
        this.create(false);
      } else {
        this.end();
      }

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

  slots() {
    return this.sl;
  }

  callback(...argument) {
    return this.call(...argument);
  }

  create(end) {
    this.output.response.shouldEndSession = end;
    console.log('the end', JSON.stringify(this.ev));
    this.output.sessionAttributes = attributes(this.ev);

    this.call(null, this.output);

    return this;
  }

  end() {
    this.create(true);

    return this;
  }
  
  reverse() {
    let handler = this.ev.handler.split('/');
    handler.pop();
    console.log('REVERSE a', JSON.stringify(this.ev));
    this.ev.session.attributes.__intents__.pop();
    this.ev.handler = handler.toString().replace(',', '/');
    console.log('REVERSE b', JSON.stringify(this.ev));
    
    return this;
  }

  converse(type) {
    
    if (type === 'reverse') {
      this.reverse();
    }
    
    this.create(false);

    return this;
  }

  send(type, message) {
    this.output.response.outputSpeech = output(type, message);

    return this;
  }

  say(message) {
    this.session({
      lastMessage: {
        type: 'say',
        message
      }
    });
    this.send('text', message);
    this.insights('event', {
      ec: 'say',
      ea: message
    });

    return this;
  }

  ssml(message) {
    this.session({
      lastMessage: {
        type: 'ssml',
        message
      }
    });
    this.send('ssml', message);
    this.insights('event', {
      ec: 'ssml',
      ea: message
    });

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
      this.insights('pageview', this.ev.handler);
      func();
    }

    return this;
  }
}
