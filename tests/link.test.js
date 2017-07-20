import { Ability } from '../src/ability';
import { event, templateResponse } from './mock';

test('LinkAccount test', () => {
  const cb = jest.fn();
  const app = new Ability(event, cb);
  const message = 'Please login';

  var expected = templateResponse;

  expected.response.outputSpeech = {
    type: 'PlainText',
    text: "Please login"
  };
  expected.response.card = {
    type: 'LinkAccount'
  };
  expected.sessionAttributes.__intents__ = ["GetBalance"];
  expected.sessionAttributes.lastMessage = {type: 'say', message};

  app.say(message).linkAccount().end();

  expect(app.output).toEqual(expected);
});
