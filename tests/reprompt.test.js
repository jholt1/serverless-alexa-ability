import { Ability } from '../src/ability';
import { event, templateResponse } from './mock';

test('Say end with reprompt test', () => {
  const cb = jest.fn();
  const app = new Ability(event, cb);
  const message = 'whats my balance';

  var expected = templateResponse;

  expected.response.outputSpeech = {
    type: 'PlainText',
    text: "whats my balance"
  };
  expected.response.reprompt = {
    outputSpeech: {
      type: "PlainText",
      text: "Do you want to know your balance?"
    }
  };
  expected.sessionAttributes.__intents__ = ["GetBalance"];
  expected.sessionAttributes.lastMessage = {type: 'say', message};

  app.say(message).repromptSay('Do you want to know your balance?').end();

  expect(app.output).toEqual(expected);
});
