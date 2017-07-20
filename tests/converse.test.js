import { Ability } from '../src/ability';
import { event, templateResponse } from './mock';

test('Say converse test', () => {
  const cb = jest.fn();
  const app = new Ability(event, cb);
  const message = 'whats my balance';

  var expected = templateResponse;

  expected.response.outputSpeech = {
    type: 'PlainText',
    text: "whats my balance"
  };
  expected.response.shouldEndSession = false;
  expected.sessionAttributes.__intents__ = ["GetBalance"];
  expected.sessionAttributes.lastMessage = {type: 'say', message};

  app.say(message).converse();

  expect(app.output).toEqual(expected);
});
