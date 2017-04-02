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

var Ability = exports.Ability = function () {
  function Ability(event, callback) {
    _classCallCheck(this, Ability);

    this.ev = intent(event);
    this.call = callback;

    this.output = {
      version: '1.0',
      response: {}
    };

    // console.log('request', event.request);
    // console.log('event', event);
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

      return this;
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
    key: 'create',
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(end) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                this.output.response.shouldEndSession = end;
                _context2.next = 3;
                return this.call(null, this.output);

              case 3:
                return _context2.abrupt('return', this);

              case 4:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function create(_x3) {
        return _ref2.apply(this, arguments);
      }

      return create;
    }()
  }, {
    key: 'end',
    value: function end() {
      this.create(true);

      return this;
    }
  }, {
    key: 'converse',
    value: function converse() {
      this.create(false);

      return this;
    }
  }, {
    key: 'send',
    value: function send(type, message) {
      this.output.response.outputSpeech = output(type, message);
      this.output.sessionAttributes = attributes(this.ev);

      return this;
    }
  }, {
    key: 'say',
    value: function say(message) {
      this.send('text', message);

      return this;
    }
  }, {
    key: 'ssml',
    value: function ssml(message) {
      this.send('ssml', message);

      return this;
    }
  }, {
    key: 'card',
    value: function card(obj) {
      this.output.response.card = obj;
      return this;
    }
  }, {
    key: 'linkAccount',
    value: function linkAccount() {
      this.card({
        type: 'LinkAccount'
      });

      return this;
    }
  }, {
    key: 'reprompt',
    value: function reprompt(type, message) {
      this.output.response.reprompt = {
        outputSpeech: output(type, message)
      };

      return this;
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