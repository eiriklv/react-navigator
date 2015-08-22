'use strict';

var EventEmitter = require('./EventEmitter');
var EventEmitterWithHolding = require('./EventEmitterWithHolding');
var EventHolder = require('./EventHolder');
var EventValidator = require('./EventValidator');

var copyProperties = require('../copyProperties');
var invariant = require('../invariant');
var keyOf = require('../keyOf');

var TYPES_KEY = keyOf({ __types: true });

/**
 * API to setup an object or constructor to be able to emit data events.
 *
 * @example
 * function Dog() { ...dog stuff... }
 * mixInEventEmitter(Dog, {bark: true});
 *
 * let puppy = new Dog();
 * puppy.addListener('bark', function (volume) {
 *   console.log('Puppy', this, 'barked at volume:', volume);
 * });
 * puppy.emit('bark', 'quiet');
 * // Puppy <puppy> barked at volume: quiet
 *
 *
 * // A "singleton" object may also be commissioned:
 *
 * let Singleton = {};
 * mixInEventEmitter(Singleton, {lonely: true});
 * Singleton.emit('lonely', true);
 */
function mixInEventEmitter(klass, types) {
  invariant(types, 'Must supply set of valid event types');
  invariant(!this.__eventEmitter, 'An active emitter is already mixed in');

  // If this is a constructor, write to the prototype, otherwise write to the
  // singleton object.
  var target = klass.prototype || klass;

  var ctor = klass.constructor;
  if (ctor) {
    invariant(ctor === Object || ctor === Function, 'Mix EventEmitter into a class, not an instance');
  }

  // Keep track of the provided types, union the types if they already exist,
  // which allows for prototype subclasses to provide more types.
  if (target.hasOwnProperty(TYPES_KEY)) {
    copyProperties(target.__types, types);
  } else if (target.__types) {
    target.__types = copyProperties({}, target.__types, types);
  } else {
    target.__types = types;
  }
  copyProperties(target, EventEmitterMixin);
}

var EventEmitterMixin = {
  emit: function emit(eventType, a, b, c, d, e, _) {
    return this.__getEventEmitter().emit(eventType, a, b, c, d, e, _);
  },

  emitAndHold: function emitAndHold(eventType, a, b, c, d, e, _) {
    return this.__getEventEmitter().emitAndHold(eventType, a, b, c, d, e, _);
  },

  addListener: function addListener(eventType, listener, context) {
    return this.__getEventEmitter().addListener(eventType, listener, context);
  },

  once: function once(eventType, listener, context) {
    return this.__getEventEmitter().once(eventType, listener, context);
  },

  addRetroactiveListener: function addRetroactiveListener(eventType, listener, context) {
    return this.__getEventEmitter().addRetroactiveListener(eventType, listener, context);
  },

  addListenerMap: function addListenerMap(listenerMap, context) {
    return this.__getEventEmitter().addListenerMap(listenerMap, context);
  },

  addRetroactiveListenerMap: function addRetroactiveListenerMap(listenerMap, context) {
    return this.__getEventEmitter().addListenerMap(listenerMap, context);
  },

  removeAllListeners: function removeAllListeners() {
    this.__getEventEmitter().removeAllListeners();
  },

  removeCurrentListener: function removeCurrentListener() {
    this.__getEventEmitter().removeCurrentListener();
  },

  releaseHeldEventType: function releaseHeldEventType(eventType) {
    this.__getEventEmitter().releaseHeldEventType(eventType);
  },

  __getEventEmitter: function __getEventEmitter() {
    if (!this.__eventEmitter) {
      var emitter = new EventEmitter();
      emitter = EventValidator.addValidation(emitter, this.__types);

      var holder = new EventHolder();
      this.__eventEmitter = new EventEmitterWithHolding(emitter, holder);
    }
    return this.__eventEmitter;
  }
};

module.exports = mixInEventEmitter;