'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _Map = require('babel-runtime/core-js/map')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _libInvariant = require('./lib/invariant');

var _libInvariant2 = _interopRequireDefault(_libInvariant);

var _context = require('./context');

var _context2 = _interopRequireDefault(_context);

var PropTypes = _react2['default'].PropTypes;

var SCENE_DISABLED_NATIVE_PROPS = '';
var styles = {
  baseScene: {},
  disabledSceneStyle: {},
  container: {}
};

var __uid = 0;
function getuid() {
  return __uid++;
}

function getRouteID(route) {
  if (route === null || typeof route !== 'object') {
    return String(route);
  }

  var key = '__navigatorRouteID';

  if (!route.hasOwnProperty(key)) {
    _Object$defineProperty(route, key, {
      enumerable: false,
      configurable: false,
      writable: false,
      value: getuid()
    });
  }
  return route[key];
}

/**
 * Use `Navigator` to transition between different scenes in your app. To
 * accomplish this, provide route objects to the navigator to identify each
 * scene, and also a `renderScene` function that the navigator can use to
 * render the scene for a given route.
 *
 * To change the animation or gesture properties of the scene, provide a
 * `configureScene` prop to get the config object for a given route. See
 * `Navigator.SceneConfigs` for default animations and more info on
 * scene config options.
 *
 * ### Basic Usage
 *
 * ```
 *   <Navigator
 *     initialRoute={{name: 'My First Scene', index: 0}}
 *     renderScene={(route, navigator) =>
 *       <MySceneComponent
 *         name={route.name}
 *         onForward={() => {
 *           var nextIndex = route.index + 1;
 *           navigator.push({
 *             name: 'Scene ' + nextIndex,
 *             index: nextIndex,
 *           });
 *         }}
 *         onBack={() => {
 *           if (route.index > 0) {
 *             navigator.pop();
 *           }
 *         }}
 *       />
 *     }
 *   />
 * ```
 *
 * ### Navigator Methods
 *
 * If you have a ref to the Navigator element, you can invoke several methods
 * on it to trigger navigation:
 *
 *  - `getCurrentRoutes()` - returns the current list of routes
 *  - `jumpBack()` - Jump backward without unmounting the current scene
 *  - `jumpForward()` - Jump forward to the next scene in the route stack
 *  - `jumpTo(route)` - Transition to an existing scene without unmounting
 *  - `push(route)` - Navigate forward to a new scene, squashing any scenes
 *     that you could `jumpForward` to
 *  - `pop()` - Transition back and unmount the current scene
 *  - `replace(route)` - Replace the current scene with a new route
 *  - `replaceAtIndex(route, index)` - Replace a scene as specified by an index
 *  - `replacePrevious(route)` - Replace the previous scene
 *  - `immediatelyResetRouteStack(routeStack)` - Reset every scene with an
 *     array of routes
 *  - `popToRoute(route)` - Pop to a particular scene, as specified by it's
 *     route. All scenes after it will be unmounted
 *  - `popToTop()` - Pop to the first scene in the stack, unmounting every
 *     other scene
 *
 */

var Navigator = (function (_React$Component) {
  _inherits(Navigator, _React$Component);

  _createClass(Navigator, null, [{
    key: 'propTypes',
    value: {
      /**
       * Optional function that allows configuration about scene animations and
       * gestures. Will be invoked with the route and should return a scene
       * configuration object
       *
       * ```
       * (route) => Navigator.SceneConfigs.FloatFromRight
       * ```
       */
      configureScene: PropTypes.func,

      /**
       * Required function which renders the scene for a given route. Will be
       * invoked with the route and the navigator object
       *
       * ```
       * (route, navigator) =>
       *   <MySceneComponent title={route.title} />
       * ```
       */
      renderScene: PropTypes.func.isRequired,

      /**
       * Specify a route to start on. A route is an object that the navigator
       * will use to identify each scene to render. `initialRoute` must be
       * a route in the `initialRouteStack` if both props are provided. The
       * `initialRoute` will default to the last item in the `initialRouteStack`.
       */
      initialRoute: PropTypes.object,

      /**
       * Provide a set of routes to initially mount. Required if no initialRoute
       * is provided. Otherwise, it will default to an array containing only the
       * `initialRoute`
       */
      initialRouteStack: PropTypes.arrayOf(PropTypes.object),

      /**
       * Optionally provide the navigator object from a parent Navigator
       */
      navigator: PropTypes.object

    },
    enumerable: true
  }]);

  /**
   * Styles to apply to the container of each scene
   */
  //sceneStyle: View.propTypes.style,

  function Navigator(props) {
    _classCallCheck(this, Navigator);

    _get(Object.getPrototypeOf(Navigator.prototype), 'constructor', this).call(this, props);
    this._renderedSceneMap = new _Map();

    var routeStack = this.props.initialRouteStack || [this.props.initialRoute];
    (0, _libInvariant2['default'])(routeStack.length >= 1, 'Navigator requires props.initialRoute or props.initialRouteStack.');
    var initialRouteIndex = routeStack.length - 1;
    if (this.props.initialRoute) {
      initialRouteIndex = routeStack.indexOf(this.props.initialRoute);
      (0, _libInvariant2['default'])(initialRouteIndex !== -1, 'initialRoute is not in initialRouteStack.');
    }

    this.state = {
      routeStack: routeStack,
      presentedIndex: initialRouteIndex,
      transitionFromIndex: null,
      transitionQueue: []
    };
  }

  _createClass(Navigator, [{
    key: 'immediatelyResetRouteStack',
    value: function immediatelyResetRouteStack(nextRouteStack) {
      var destIndex = nextRouteStack.length - 1;
      this.setState({
        routeStack: nextRouteStack,
        presentedIndex: destIndex,
        transitionFromIndex: null
      });
    }
  }, {
    key: '_emitDidFocus',
    value: function _emitDidFocus(route) {
      this.navigationContext.emit('didfocus', { route: route });
    }
  }, {
    key: '_emitWillFocus',
    value: function _emitWillFocus(route) {
      this.navigationContext.emit('willfocus', { route: route });
    }
  }, {
    key: '_getDestIndexWithinBounds',
    value: function _getDestIndexWithinBounds(n) {
      var currentIndex = this.state.presentedIndex;
      var destIndex = currentIndex + n;
      (0, _libInvariant2['default'])(destIndex >= 0, 'Cannot jump before the first route.');
      var maxIndex = this.state.routeStack.length - 1;
      (0, _libInvariant2['default'])(maxIndex >= destIndex, 'Cannot jump past the last route.');
      return destIndex;
    }
  }, {
    key: '_jumpN',
    value: function _jumpN(n) {
      var destIndex = this._getDestIndexWithinBounds(n);
      this._enableScene(destIndex);
      this._emitWillFocus(this.state.routeStack[destIndex]);
      this._transitionTo(destIndex);
    }

    /**
     * Hides all scenes that we are not currently on, gesturing to, or transitioning from
     */
  }, {
    key: '_hideScenes',
    value: function _hideScenes() {}
    //for (let i = 0; i < this.state.routeStack.length; i++) {
    //  if (i === this.state.presentedIndex ||
    //      i === this.state.transitionFromIndex) {
    //    continue;
    //  }
    //  this._disableScene(i);
    //}

    /**
     * Push a scene off the screen, so that opacity:0 scenes will not block touches sent to the presented scenes
     */

  }, {
    key: '_disableScene',
    value: function _disableScene(sceneIndex) {
      if (this.refs['scene_' + sceneIndex]) {
        this.refs['scene_' + sceneIndex].getDOMNode().style = SCENE_DISABLED_NATIVE_PROPS;
      }
    }

    /**
     * Put the scene back into the state as defined by props.sceneStyle, so transitions can happen normally
     */
  }, {
    key: '_enableScene',
    value: function _enableScene(sceneIndex) {
      // First, determine what the defined styles are for scenes in this navigator
      var sceneStyle = _Object$assign({}, styles.baseScene, this.props.sceneStyle);
      // Then restore the pointer events and top value for this scene
      var enabledSceneNativeProps = {
        style: {
          top: sceneStyle.top,
          bottom: sceneStyle.bottom
        }
      };
      if (sceneIndex !== this.state.transitionFromIndex && sceneIndex !== this.state.presentedIndex) {
        // If we are not in a transition from this index, make sure opacity is 0
        // to prevent the enabled scene from flashing over the presented scene
        enabledSceneNativeProps.style.opacity = 0;
      }
      if (this.refs['scene_' + sceneIndex]) {
        this.refs['scene_' + sceneIndex].style = enabledSceneNativeProps;
      }
    }
  }, {
    key: '_cleanScenesPastIndex',
    value: function _cleanScenesPastIndex(index) {
      var newStackLength = index + 1;
      // Remove any unneeded rendered routes.
      if (newStackLength < this.state.routeStack.length) {
        this.setState({
          routeStack: this.state.routeStack.slice(0, newStackLength)
        });
      }
    }
  }, {
    key: '_popN',
    value: function _popN(n) {
      var _this = this;

      if (n === 0) {
        return;
      }
      (0, _libInvariant2['default'])(this.state.presentedIndex - n >= 0, 'Cannot pop below zero');
      var popIndex = this.state.presentedIndex - n;
      this._enableScene(popIndex);
      this._emitWillFocus(this.state.routeStack[popIndex]);
      this._transitionTo(popIndex, null, // default velocity
      null, // no spring jumping
      function () {
        _this._cleanScenesPastIndex(popIndex);
      });
    }
  }, {
    key: '_transitionTo',
    value: function _transitionTo(index, velocity, spring, cb) {
      //TODO: Add support for scene transition animations
      this._hideScenes();
      this.setState({ presentedIndex: index }, function () {
        if (cb) {
          cb();
        }
      });
    }
  }, {
    key: 'jumpTo',
    value: function jumpTo(route) {
      var destIndex = this.state.routeStack.indexOf(route);
      (0, _libInvariant2['default'])(destIndex !== -1, 'Cannot jump to route that is not in the route stack');
      this._jumpN(destIndex - this.state.presentedIndex);
    }
  }, {
    key: 'jumpForward',
    value: function jumpForward() {
      this._jumpN(1);
    }
  }, {
    key: 'jumpBack',
    value: function jumpBack() {
      this._jumpN(-1);
    }
  }, {
    key: 'push',
    value: function push(route) {
      var _this2 = this;

      (0, _libInvariant2['default'])(!!route, 'Must supply route to push');
      var activeLength = this.state.presentedIndex + 1;
      var activeStack = this.state.routeStack.slice(0, activeLength);
      var nextStack = activeStack.concat([route]);
      var destIndex = nextStack.length - 1;
      this._emitWillFocus(nextStack[destIndex]);
      this.setState({
        routeStack: nextStack
      }, function () {
        _this2._enableScene(destIndex);
        _this2._transitionTo(destIndex);
      });
    }
  }, {
    key: 'pop',
    value: function pop() {
      if (this.state.transitionQueue.length) {
        // This is the workaround to prevent user from firing multiple `pop()`
        // calls that may pop the routes beyond the limit.
        // Because `this.state.presentedIndex` does not update until the
        // transition starts, we can't reliably use `this.state.presentedIndex`
        // to know whether we can safely keep popping the routes or not at this
        //  moment.
        return;
      }

      if (this.state.presentedIndex > 0) {
        this._popN(1);
      }
    }

    /**
     * Replace a route in the navigation stack.
     *
     * `index` specifies the route in the stack that should be replaced.
     * If it's negative, it counts from the back.
     */
  }, {
    key: 'replaceAtIndex',
    value: function replaceAtIndex(route, index, cb) {
      var _this3 = this;

      (0, _libInvariant2['default'])(!!route, 'Must supply route to replace');
      if (index < 0) {
        index += this.state.routeStack.length;
      }

      if (this.state.routeStack.length <= index) {
        return;
      }

      var nextRouteStack = this.state.routeStack.slice();
      nextRouteStack[index] = route;
      if (index === this.state.presentedIndex) {
        this._emitWillFocus(route);
      }
      this.setState({
        routeStack: nextRouteStack
      }, function () {
        if (index === _this3.state.presentedIndex) {
          _this3._emitDidFocus(route);
        }
        cb && cb();
      });
    }

    /**
     * Replaces the current scene in the stack.
     */
  }, {
    key: 'replace',
    value: function replace(route) {
      this.replaceAtIndex(route, this.state.presentedIndex);
    }

    /**
     * Replace the current route's parent.
     */
  }, {
    key: 'replacePrevious',
    value: function replacePrevious(route) {
      this.replaceAtIndex(route, this.state.presentedIndex - 1);
    }
  }, {
    key: 'popToRoute',
    value: function popToRoute(route) {
      var indexOfRoute = this.state.routeStack.indexOf(route);
      (0, _libInvariant2['default'])(indexOfRoute !== -1, 'Calling popToRoute for a route that doesn\'t exist!');
      var numToPop = this.state.presentedIndex - indexOfRoute;
      this._popN(numToPop);
    }
  }, {
    key: 'popToTop',
    value: function popToTop() {
      this.popToRoute(this.state.routeStack[0]);
    }
  }, {
    key: 'replacePreviousAndPop',
    value: function replacePreviousAndPop(route) {
      if (this.state.routeStack.length < 2) {
        return;
      }
      this.replacePrevious(route);
      this.pop();
    }
  }, {
    key: 'resetTo',
    value: function resetTo(route) {
      var _this4 = this;

      (0, _libInvariant2['default'])(!!route, 'Must supply route to push');
      this.replaceAtIndex(route, 0, function () {
        // Do not use popToRoute here, because race conditions could prevent the
        // route from existing at this time. Instead, just go to index 0
        if (_this4.state.presentedIndex > 0) {
          _this4._popN(_this4.state.presentedIndex);
        }
      });
    }
  }, {
    key: 'getCurrentRoutes',
    value: function getCurrentRoutes() {
      // Clone before returning to avoid caller mutating the stack
      return this.state.routeStack.slice();
    }
  }, {
    key: '_renderScene',
    value: function _renderScene(route, i) {
      var disabledSceneStyle = null;
      if (i !== this.state.presentedIndex) {
        disabledSceneStyle = styles.disabledScene;
      }
      return _react2['default'].createElement(
        'div',
        {
          key: 'scene_' + getRouteID(route),
          style: this.props.sceneStyle /*TODO fix merge Object.assign({}, styles.baseScene, this.props.sceneStyle, disabledSceneStyle)*/ },
        this.props.renderScene(route, this)
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _this5 = this;

      var newRenderedSceneMap = new _Map();
      var scenes = this.state.routeStack.map(function (route, index) {
        var renderedScene = _this5._renderedSceneMap.has(route) && index !== _this5.state.presentedIndex ? _this5._renderedSceneMap.get(route) : _this5._renderScene(route, index);

        newRenderedSceneMap.set(route, renderedScene);
        return renderedScene;
      });
      this._renderedSceneMap = newRenderedSceneMap;
      //TODO: Hide keep disable scenes mounted and hide only
      return _react2['default'].createElement(
        'div',
        { style: this.props.style /*TODO fix merge Object.assign({}, styles.container, this.props.style)*/ },
        scenes[this.state.presentedIndex]
      );
    }
  }, {
    key: 'navigationContext',
    get: function get() {
      if (!this._navigationContext) {
        this._navigationContext = new _context2['default']();
      }
      return this._navigationContext;
    }
  }]);

  return Navigator;
})(_react2['default'].Component);

exports['default'] = Navigator;
module.exports = exports['default'];