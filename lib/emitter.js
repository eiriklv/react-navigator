'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _libEmitterEventEmitter = require('./lib/emitter/EventEmitter');

var _libEmitterEventEmitter2 = _interopRequireDefault(_libEmitterEventEmitter);

var _event = require('./event');

var _event2 = _interopRequireDefault(_event);

var NavigationEventEmitter = (function (_EventEmitter) {
  _inherits(NavigationEventEmitter, _EventEmitter);

  function NavigationEventEmitter(target) {
    _classCallCheck(this, NavigationEventEmitter);

    _get(Object.getPrototypeOf(NavigationEventEmitter.prototype), 'constructor', this).call(this);
    this._emitting = false;
    this._emitQueue = [];
    this._target = target;
  }

  _createClass(NavigationEventEmitter, [{
    key: 'emit',
    value: function emit(eventType, data, didEmitCallback) {
      if (this._emitting) {
        // An event cycle that was previously created hasn't finished yet.
        // Put this event cycle into the queue and will finish them later.
        this._emitQueue.push({ eventType: eventType, data: data, didEmitCallback: didEmitCallback });
        return;
      }

      this._emitting = true;

      var event = new _event2['default'](eventType, this._target, data);

      // EventEmitter#emit only takes `eventType` as `String`. Casting `eventType`
      // to `String` to make  happy.
      _get(Object.getPrototypeOf(NavigationEventEmitter.prototype), 'emit', this).call(this, String(eventType), event);

      if (typeof didEmitCallback === 'function') {
        didEmitCallback.call(this._target, event);
      }
      event.dispose();

      this._emitting = false;

      while (this._emitQueue.length) {
        var arg = this._emitQueue.shift();
        this.emit(arg.eventType, arg.data, arg.didEmitCallback);
      }
    }
  }]);

  return NavigationEventEmitter;
})(_libEmitterEventEmitter2['default']);

exports['default'] = NavigationEventEmitter;
module.exports = exports['default'];