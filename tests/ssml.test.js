import { Ability } from '../src/ability';
import { event, templateResponse } from './mock';

test('Ssml end test', () => {
  const cb = jest.fn();
  const app = new Ability(event, cb);

  var expected = templateResponse;

  expected.response.outputSpeech = {
    type: 'SSML',
    ssml: "<speak>whats my balance</speak>"
  };
  expected.sessionAttributes.__intents__ = ["GetBalance"];

  app.ssml('<speak>whats my balance</speak>').end();

  expect(app.output).toEqual(expected);
});

test('Ssml end with card test', () => {
  const cb = jest.fn();
  const app = new Ability(event, cb);

  var expected = templateResponse;

  expected.response.outputSpeech = {
    type: 'SSML',
    ssml: "<speak>whats my balance</speak>"
  };
  expected.response.card = {
    type: 'Simple',
    title: 'Hello',
    content: 'World'
  };
  expected.sessionAttributes.__intents__ = ["GetBalance", "GetBalance"];

  app.ssml('<speak>whats my balance</speak>').card({
    type: 'Simple',
    title: 'Hello',
    content: 'World'
  }).end();

  expect(app.output).toEqual(expected);
});
