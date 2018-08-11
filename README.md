# serverless-alexa-ability [![Build Status](https://travis-ci.org/jholt1/serverless-alexa-ability.svg?branch=master)](https://travis-ci.org/jholt1/serverless-alexa-ability) [![Greenkeeper badge](https://badges.greenkeeper.io/jholt1/serverless-alexa-ability.svg)](https://greenkeeper.io/)

## Installation

```
npm install serverless-alexa-ability --save
```

## Quick Example
#### handler.js

```javascript
import { Ability } from 'serverless-alexa-ability';

exports.index = (event, context, callback) => {

  const app = new Ability(event, callback);
  
  app.on('askWeather', () => {
    app.say('The weather is 18 degrees and sunny').end();
  });

};
```

## Documentation

### Say

```javascript
app.say('hello world').end();
```

### SSML

```javascript
app.ssml('<speak><say-as interpret-as="spell-out">hello</say-as></speak>').end();
```

### Link account
If you have some logged in functionality, but they have yet to login

```javascript
app.say('Please login').linkAccount().end();
```

### Card

```javascript
app.say(
  'Hello!'
).card({
  type: 'Simple',
  title: 'Hello',
  content: 'World'
}).end();
```

### Conversation

```javascript
import { Ability } from 'serverless-alexa-ability';

exports.index = (event, context, callback) => {

  const app = new Ability(event, callback);
  
  // User says "Do you like cats?"
  app.on('likeCats', () => {
    app.say('I like cats, do you like cats?').converse();
  });
  // User says "Yes"
  app.on('likeCats/AMAZON.YesIntent', () => {
    app.say('Phew thats good, now we can be friends').end();
  });
  // User says "No"
  app.on('likeCats/AMAZON.NoIntent', () => {
    app.say('Well this is awkward'.end();
  });

};
```

### Reprompt

```javascript
app.say(
  'The weather is 18 degrees and sunny, is there anything else I can help with?'
).repromptSay(
  'Is there anything else I can help with?'
).converse();

app.say(
  'The weather is 18 degrees and sunny, is there anything else I can help with?'
).repromptSsml(
  '<speak>Is there anything else I can help with?</speak>'
).converse();
```

### Create Sessions

```javascript
app.session({
  foo: 'bar',
  hello: 'world'
});
```

### Get Event

```javascript
const event = app.event();
```
