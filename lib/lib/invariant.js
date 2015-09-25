'use strict';

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

Object.defineProperty(exports, '__esModule', {
  value: true
});
var invariant = function invariant(condition, format, a, b, c, d, e, f) {
  if (!condition) {
    var error = undefined;
    if (typeof format === 'undefined') {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      (function () {
        var args = [a, b, c, d, e, f];
        var argIndex = 0;
        error = new Error('Invariant Violation: ' + format.replace(/%s/g, function () {
          return args[argIndex++];
        }));
      })();
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

exports['default'] = invariant;
module.exports = exports['default'];