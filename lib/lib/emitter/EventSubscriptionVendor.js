'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _invariant = require('../invariant');

var _invariant2 = _interopRequireDefault(_invariant);

/**
 * EventSubscriptionVendor stores a set of EventSubscriptions that are
 * subscribed to a particular event type.
 */

var EventSubscriptionVendor = (function () {
  function EventSubscriptionVendor() {
    _classCallCheck(this, EventSubscriptionVendor);

    this._subscriptionsForType = {};
    this._currentSubscription = null;
  }

  /**
   * Adds a subscription keyed by an event type.
   *
   * @param {string} eventType
   * @param {EventSubscription} subscription
   */

  _createClass(EventSubscriptionVendor, [{
    key: 'addSubscription',
    value: function addSubscription(eventType, subscription) {
      (0, _invariant2['default'])(subscription.subscriber === this, 'The subscriber of the subscription is incorrectly set.');

      if (!this._subscriptionsForType[eventType]) {
        this._subscriptionsForType[eventType] = [];
      }
      var key = this._subscriptionsForType[eventType].length;
      this._subscriptionsForType[eventType].push(subscription);
      subscription.eventType = eventType;
      subscription.key = key;
      return subscription;
    }

    /**
     * Removes a bulk set of the subscriptions.
     *
     * @param {?string} eventType - Optional name of the event type whose
     *   registered supscriptions to remove, if null remove all subscriptions.
     */
  }, {
    key: 'removeAllSubscriptions',
    value: function removeAllSubscriptions(eventType) {
      if (typeof eventType === 'undefined') {
        this._subscriptionsForType = {};
      } else {
        delete this._subscriptionsForType[eventType];
      }
    }

    /**
     * Removes a specific subscription. Instead of calling this function, call
     * `subscription.remove()` directly.
     *
     * @param {object} subscription
     */
  }, {
    key: 'removeSubscription',
    value: function removeSubscription(subscription) {
      var eventType = subscription.eventType;
      var key = subscription.key;

      var subscriptionsForType = this._subscriptionsForType[eventType];
      if (subscriptionsForType) {
        delete subscriptionsForType[key];
      }
    }

    /**
     * Returns the array of subscriptions that are currently registered for the
     * given event type.
     *
     * Note: This array can be potentially sparse as subscriptions are deleted
     * from it when they are removed.
     *
     * TODO: This returns a nullable array. wat?
     *
     * @param {string} eventType
     * @returns {?array}
     */
  }, {
    key: 'getSubscriptionsForType',
    value: function getSubscriptionsForType(eventType) {
      return this._subscriptionsForType[eventType];
    }
  }]);

  return EventSubscriptionVendor;
})();

exports['default'] = EventSubscriptionVendor;
module.exports = exports['default'];