'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Ability = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _lodash = require('lodash');

var _universalAnalytics = require('universal-analytics');

var _universalAnalytics2 = _interopRequireDefault(_universalAnalytics);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var output = function output(type, message) {
  var obj = {};

  obj.type = type === 'text' ? 'PlainText' : 'SSML';
  obj[type] = message;

  return obj;
};

var attributes = function attributes(event) {
  var attr = event.session.attributes || {};
  var intents = (0, _lodash.clone)((0, _lodash.get)(attr, '__intents__', []));

  if (event.request.intent) {
    intents.push(event.request.intent.name);
  }

  attr.__intents__ = intents;

  return attr;
};

var intent = function intent(event) {
  var handler = '';

  if (_typeof(event.session) === 'object' && _typeof(event.session.attributes) === 'object' && _typeof(event.session.attributes.__intents__) === 'object') {
    handler += event.session.attributes.__intents__.join('/') + '/';
  } else {
    if (!event.session) {
      event.session = {};
      event.session.attributes = {};
    }

    if (!event.session.attributes) {
      event.session.attributes = {};
    }
  }

  if (event.request.intent) {
    handler += event.request.intent.name;
  }

  event.handler = handler;

  return event;
};

var Ability = exports.Ability = function () {
  function Ability(event, callback, options) {
    _classCallCheck(this, Ability);

    this.ev = intent(event);
    this.call = callback;

    if (options && options.ga) {
      this.visitor = (0, _universalAnalytics2.default)(options.ga);
      this.visitor.set('uid', this.ev.session.user.userId);
    }

    this.output = {
      version: '1.0',
      response: {}
    };

    // console.log('request', event.request);
    // console.log('event', event);
  }

  _createClass(Ability, [{
    key: 'insights',
    value: function insights(type, data) {
      if (this.visitor) {
        this.visitor[type](data).send();
      }

      return this;
    }
  }, {
    key: 'on',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(intent, func) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(intent === this.ev.handler)) {
                  _context.next = 4;
                  break;
                }

                this.insights('pageview', intent);

                _context.next = 4;
                return func(this);

              case 4:
                return _context.abrupt('return', this);

              case 5:
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
    value: function create(end) {
      this.output.response.shouldEndSession = end;
      this.output.sessionAttributes = attributes(this.ev);

      this.call(null, this.output);

      return this;
    }
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

      return this;
    }
  }, {
    key: 'say',
    value: function say(message) {
      this.send('text', message);
      this.insights('event', {
        ec: 'say',
        ea: message
      });

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
      this.card({ type: 'LinkAccount' });

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
    key: 'repromptSay',
    value: function repromptSay(message) {
      this.reprompt('text', message);

      return this;
    }
  }, {
    key: 'repromptSsml',
    value: function repromptSsml(message) {
      this.reprompt('ssml', message);

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