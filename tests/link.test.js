import { Ability } from '../src/ability';
import { event, templateResponse } from './mock';

test('LinkAccount test', () => {
  const cb = jest.fn();
  const app = new Ability(event, cb);

  var expected = templateResponse;

  expected.response.outputSpeech = {
    type: 'PlainText',
    text: "Please login"
  };
  expected.response.card = {
    type: 'LinkAccount'
  };
  expected.sessionAttributes.__intents__ = ["GetBalance"];

  app.say('Please login').linkAccount().end();

  expect(app.output).toEqual(expected);
});
