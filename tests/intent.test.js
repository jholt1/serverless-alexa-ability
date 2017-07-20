import { Ability } from '../src/ability';
import { event, templateResponse } from './mock';

test('Intent test', () => {
  const cb = jest.fn();
  const app = new Ability(event, cb);

  var expected = templateResponse;

  expected.response.outputSpeech = {
    type: 'PlainText',
    text: "whats my balance"
  };
  expected.sessionAttributes.__intents__ = ["GetBalance"];
  expected.sessionAttributes.lastMessage = {type: 'say', message: 'whats my balance'};

  app.on('testa', () => {
    app.say('test a').end();
  });

  app.on('testb', () => {
    app.say('test b').end();
  });

  app.on('GetBalance', () => {
    app.say('whats my balance').end();
  });

  app.on('testc', () => {
    app.say('test c').end();
  });

  expect(app.output).toEqual(expected);
});
