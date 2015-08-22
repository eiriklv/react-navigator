'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _libInvariant = require('./lib/invariant');

var _libInvariant2 = _interopRequireDefault(_libInvariant);

var NavigationEventPool = (function () {
  function NavigationEventPool() {
    _classCallCheck(this, NavigationEventPool);

    this._list = [];
  }

  _createClass(NavigationEventPool, [{
    key: 'get',
    value: function get(type, target, data) {
      var event = undefined;
      if (this._list.length > 0) {
        event = this._list.pop();
        event.constructor.call(event, type, target, data);
      } else {
        event = new NavigationEvent(type, target, data);
      }
      return event;
    }
  }, {
    key: 'put',
    value: function put(event) {
      this._list.push(event);
    }
  }]);

  return NavigationEventPool;
})();

var _navigationEventPool = new NavigationEventPool();

var NavigationEvent = (function () {
  _createClass(NavigationEvent, null, [{
    key: 'pool',
    value: function pool(type, target, data) {
      return _navigationEventPool.get(type, target, data);
    }
  }]);

  function NavigationEvent(type, target, data) {
    _classCallCheck(this, NavigationEvent);

    this._type = type;
    this._target = target;
    this._data = data;
    this._defaultPrevented = false;
    this._disposed = false;
  }

  /* $FlowFixMe - get/set properties not yet supported */

  _createClass(NavigationEvent, [{
    key: 'preventDefault',
    value: function preventDefault() {
      this._defaultPrevented = true;
    }

    /**
     * Dispose the event.
     * NavigationEvent shall be disposed after being emitted by
     * `NavigationEventEmitter`.
     */
  }, {
    key: 'dispose',
    value: function dispose() {
      (0, _libInvariant2['default'])(!this._disposed, 'NavigationEvent is already disposed');
      this._disposed = true;

      // Clean up.
      this._type = null;
      this._target = null;
      this._data = null;
      this._defaultPrevented = false;

      // Put this back to the pool to reuse the instance.
      _navigationEventPool.put(this);
    }
  }, {
    key: 'type',
    get: function get() {
      return this._type;
    }

    /* $FlowFixMe - get/set properties not yet supported */
  }, {
    key: 'target',
    get: function get() {
      return this._target;
    }

    /* $FlowFixMe - get/set properties not yet supported */
  }, {
    key: 'data',
    get: function get() {
      return this._data;
    }

    /* $FlowFixMe - get/set properties not yet supported */
  }, {
    key: 'defaultPrevented',
    get: function get() {
      return this._defaultPrevented;
    }
  }]);

  return NavigationEvent;
})();

exports['default'] = NavigationEvent;
module.exports = exports['default'];