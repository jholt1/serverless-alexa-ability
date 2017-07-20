import { Ability } from '../src/ability';
import { event, templateResponse } from './mock';

test('Say end test', () => {
  const cb = jest.fn();
  const app = new Ability(event, cb);

  var expected = templateResponse;

  expected.response.outputSpeech = {
    type: 'PlainText',
    text: "whats my balance"
  };
  // expected.response.shouldEndSession = false;
  expected.sessionAttributes.__intents__ = ["GetBalance"];
  expected.sessionAttributes.lastMessage = {type: 'say', message: 'whats my balance'};


  app.say('whats my balance').end();

  expect(app.output).toEqual(expected);
});

test('Say end with card test', () => {
  const cb = jest.fn();
  const app = new Ability(event, cb);

  var expected = templateResponse;

  expected.response.outputSpeech = {
    type: 'PlainText',
    text: "whats my balance"
  };
  expected.response.card = {
    type: 'Simple',
    title: 'Hello',
    content: 'World'
  };
  expected.sessionAttributes.__intents__ = ["GetBalance", "GetBalance"];
  expected.sessionAttributes.lastMessage = {type: 'say', message: 'whats my balance'};

  app.say('whats my balance').card({
    type: 'Simple',
    title: 'Hello',
    content: 'World'
  }).end();

  expect(app.output).toEqual(expected);
});
