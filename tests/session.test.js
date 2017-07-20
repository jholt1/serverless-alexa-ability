import { Ability } from '../src/ability';
import { event, templateResponse } from './mock';

test('Create session test', () => {
  const cb = jest.fn();

  const app = new Ability(event, cb);

  var expected = templateResponse;

  expected.response.outputSpeech = {
    type: 'PlainText',
    text: "whats my balance"
  };
  expected.sessionAttributes.__intents__ = ["GetBalance"];
  expected.sessionAttributes.foo = 'bar';
  expected.sessionAttributes.lastMessage = {type: 'say', message: 'whats my balance'};

  app.session({foo: 'bar'});

  app.say('whats my balance').end();

  expect(app.output).toEqual(expected);
});
