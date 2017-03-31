'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Ability = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _lodash = require('lodash');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var output = function output(type, message) {
  var obj = {};

  obj.type = type === 'text' ? 'PlainText' : 'SSML';
  obj[type] = message;

  return obj;
};

var attributes = function attributes(event) {
  var attr = event.session.attributes;
  var intents = (0, _lodash.clone)((0, _lodash.get)(attr, '__intents__', []));

  intents.push(event.request.intent.name);
  attr.__intents__ = intents;

  return attr;
};

var intent = function intent(event) {
  var handler = _typeof(event.session.attributes.__intents__) === 'object' ? event.session.attributes.__intents__.join('/') + '/' : '';

  handler += event.request.intent.name;
  event.handler = handler;

  return event;
};

var response = function response(type, message, end, event, card, reprompt) {
  var outputSpeech = output(type, message);
  var sessionAttributes = attributes(event);

  var response = {
    version: '1.0',
    response: {
      outputSpeech: outputSpeech,
      shouldEndSession: end,
      card: card,
      reprompt: reprompt
    },
    sessionAttributes: sessionAttributes
  };
  console.log('response', response);
  return response;
};

var Ability = exports.Ability = function () {
  function Ability(event, callback) {
    _classCallCheck(this, Ability);

    this.ev = intent(event);
    this.call = callback;

    console.log('request', event.request);
    console.log('event', event);
  }

  _createClass(Ability, [{
    key: 'on',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(intent, func) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(intent === this.ev.handler)) {
                  _context.next = 3;
                  break;
                }

                _context.next = 3;
                return func(this);

              case 3:
                return _context.abrupt('return', this);

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function on(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return on;
    }()
  }, {
    key: 'session',
    value: function session(obj) {
      var _this = this;

      var keys = Object.keys(obj);

      keys.forEach(function (key) {
        _this.ev.session.attributes[key] = obj[key];
      });
    }
  }, {
    key: 'event',
    value: function event() {
      return this.ev;
    }
  }, {
    key: 'callback',
    value: function callback() {
      return this.call.apply(this, arguments);
    }
  }, {
    key: 'send',
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        for (var _len = arguments.length, argument = Array(_len), _key = 0; _key < _len; _key++) {
          argument[_key] = arguments[_key];
        }

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.call(null, response.apply(undefined, argument.concat([this.ev, this.c, this.re])));

              case 2:
                return _context2.abrupt('return', _context2.sent);

              case 3:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function send() {
        return _ref2.apply(this, arguments);
      }

      return send;
    }()
  }, {
    key: 'say',
    value: function say() {
      for (var _len2 = arguments.length, argument = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        argument[_key2] = arguments[_key2];
      }

      return this.send.apply(this, ['text'].concat(argument));
    }
  }, {
    key: 'ssml',
    value: function ssml() {
      for (var _len3 = arguments.length, argument = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        argument[_key3] = arguments[_key3];
      }

      return this.send.apply(this, ['ssml'].concat(argument));
    }
  }, {
    key: 'card',
    value: function card(obj) {
      this.c = obj;
    }
  }, {
    key: 'linkAccount',
    value: function linkAccount() {
      this.card({
        type: 'LinkAccount'
      });
    }
  }, {
    key: 'reprompt',
    value: function reprompt(type, message) {
      this.re = {
        outputSpeech: output(type, message)
      };
    }
  }, {
    key: 'error',
    value: function error(func) {
      func();
      return this;
    }
  }]);

  return Ability;
}();