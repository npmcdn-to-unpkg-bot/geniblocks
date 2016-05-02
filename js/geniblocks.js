(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.GeniBlocks = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var babelHelpers = require('./util/babelHelpers.js');

exports.__esModule = true;

/**
 * document.activeElement
 */
exports['default'] = activeElement;

var _ownerDocument = require('./ownerDocument');

var _ownerDocument2 = babelHelpers.interopRequireDefault(_ownerDocument);

function activeElement() {
  var doc = arguments[0] === undefined ? document : arguments[0];

  try {
    return doc.activeElement;
  } catch (e) {}
}

module.exports = exports['default'];
},{"./ownerDocument":8,"./util/babelHelpers.js":14}],2:[function(require,module,exports){
'use strict';
var hasClass = require('./hasClass');

module.exports = function addClass(element, className) {
  if (element.classList) element.classList.add(className);else if (!hasClass(element)) element.className = element.className + ' ' + className;
};
},{"./hasClass":3}],3:[function(require,module,exports){
'use strict';
module.exports = function hasClass(element, className) {
  if (element.classList) return !!className && element.classList.contains(className);else return (' ' + element.className + ' ').indexOf(' ' + className + ' ') !== -1;
};
},{}],4:[function(require,module,exports){
'use strict';

module.exports = {
  addClass: require('./addClass'),
  removeClass: require('./removeClass'),
  hasClass: require('./hasClass')
};
},{"./addClass":2,"./hasClass":3,"./removeClass":5}],5:[function(require,module,exports){
'use strict';

module.exports = function removeClass(element, className) {
  if (element.classList) element.classList.remove(className);else element.className = element.className.replace(new RegExp('(^|\\s)' + className + '(?:\\s|$)', 'g'), '$1').replace(/\s+/g, ' ').replace(/^\s*|\s*$/g, '');
};
},{}],6:[function(require,module,exports){
'use strict';
var canUseDOM = require('../util/inDOM');
var off = function off() {};

if (canUseDOM) {

  off = (function () {

    if (document.addEventListener) return function (node, eventName, handler, capture) {
      return node.removeEventListener(eventName, handler, capture || false);
    };else if (document.attachEvent) return function (node, eventName, handler) {
      return node.detachEvent('on' + eventName, handler);
    };
  })();
}

module.exports = off;
},{"../util/inDOM":19}],7:[function(require,module,exports){
'use strict';
var canUseDOM = require('../util/inDOM');
var on = function on() {};

if (canUseDOM) {
  on = (function () {

    if (document.addEventListener) return function (node, eventName, handler, capture) {
      return node.addEventListener(eventName, handler, capture || false);
    };else if (document.attachEvent) return function (node, eventName, handler) {
      return node.attachEvent('on' + eventName, handler);
    };
  })();
}

module.exports = on;
},{"../util/inDOM":19}],8:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports["default"] = ownerDocument;

function ownerDocument(node) {
  return node && node.ownerDocument || document;
}

module.exports = exports["default"];
},{}],9:[function(require,module,exports){
'use strict';
var canUseDOM = require('../util/inDOM');

var contains = (function () {
  var root = canUseDOM && document.documentElement;

  return root && root.contains ? function (context, node) {
    return context.contains(node);
  } : root && root.compareDocumentPosition ? function (context, node) {
    return context === node || !!(context.compareDocumentPosition(node) & 16);
  } : function (context, node) {
    if (node) do {
      if (node === context) return true;
    } while (node = node.parentNode);

    return false;
  };
})();

module.exports = contains;
},{"../util/inDOM":19}],10:[function(require,module,exports){
'use strict';

module.exports = function getWindow(node) {
  return node === node.window ? node : node.nodeType === 9 ? node.defaultView || node.parentWindow : false;
};
},{}],11:[function(require,module,exports){
'use strict';

var babelHelpers = require('../util/babelHelpers.js');

var _utilCamelizeStyle = require('../util/camelizeStyle');

var _utilCamelizeStyle2 = babelHelpers.interopRequireDefault(_utilCamelizeStyle);

var rposition = /^(top|right|bottom|left)$/;
var rnumnonpx = /^([+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|))(?!px)[a-z%]+$/i;

module.exports = function _getComputedStyle(node) {
  if (!node) throw new TypeError('No Element passed to `getComputedStyle()`');
  var doc = node.ownerDocument;

  return 'defaultView' in doc ? doc.defaultView.opener ? node.ownerDocument.defaultView.getComputedStyle(node, null) : window.getComputedStyle(node, null) : { //ie 8 "magic" from: https://github.com/jquery/jquery/blob/1.11-stable/src/css/curCSS.js#L72
    getPropertyValue: function getPropertyValue(prop) {
      var style = node.style;

      prop = (0, _utilCamelizeStyle2['default'])(prop);

      if (prop == 'float') prop = 'styleFloat';

      var current = node.currentStyle[prop] || null;

      if (current == null && style && style[prop]) current = style[prop];

      if (rnumnonpx.test(current) && !rposition.test(prop)) {
        // Remember the original values
        var left = style.left;
        var runStyle = node.runtimeStyle;
        var rsLeft = runStyle && runStyle.left;

        // Put in the new values to get a computed value out
        if (rsLeft) runStyle.left = node.currentStyle.left;

        style.left = prop === 'fontSize' ? '1em' : current;
        current = style.pixelLeft + 'px';

        // Revert the changed values
        style.left = left;
        if (rsLeft) runStyle.left = rsLeft;
      }

      return current;
    }
  };
};
},{"../util/babelHelpers.js":14,"../util/camelizeStyle":16}],12:[function(require,module,exports){
'use strict';

var camelize = require('../util/camelizeStyle'),
    hyphenate = require('../util/hyphenateStyle'),
    _getComputedStyle = require('./getComputedStyle'),
    removeStyle = require('./removeStyle');

var has = Object.prototype.hasOwnProperty;

module.exports = function style(node, property, value) {
  var css = '',
      props = property;

  if (typeof property === 'string') {

    if (value === undefined) return node.style[camelize(property)] || _getComputedStyle(node).getPropertyValue(hyphenate(property));else (props = {})[property] = value;
  }

  for (var key in props) if (has.call(props, key)) {
    !props[key] && props[key] !== 0 ? removeStyle(node, hyphenate(key)) : css += hyphenate(key) + ':' + props[key] + ';';
  }

  node.style.cssText += ';' + css;
};
},{"../util/camelizeStyle":16,"../util/hyphenateStyle":18,"./getComputedStyle":11,"./removeStyle":13}],13:[function(require,module,exports){
'use strict';

module.exports = function removeStyle(node, key) {
  return 'removeProperty' in node.style ? node.style.removeProperty(key) : node.style.removeAttribute(key);
};
},{}],14:[function(require,module,exports){
(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports === "object") {
    factory(exports);
  } else {
    factory(root.babelHelpers = {});
  }
})(this, function (global) {
  var babelHelpers = global;

  babelHelpers.interopRequireDefault = function (obj) {
    return obj && obj.__esModule ? obj : {
      "default": obj
    };
  };

  babelHelpers._extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };
})
},{}],15:[function(require,module,exports){
"use strict";

var rHyphen = /-(.)/g;

module.exports = function camelize(string) {
  return string.replace(rHyphen, function (_, chr) {
    return chr.toUpperCase();
  });
};
},{}],16:[function(require,module,exports){
/**
 * Copyright 2014-2015, Facebook, Inc.
 * All rights reserved.
 * https://github.com/facebook/react/blob/2aeb8a2a6beb00617a4217f7f8284924fa2ad819/src/vendor/core/camelizeStyleName.js
 */

'use strict';
var camelize = require('./camelize');
var msPattern = /^-ms-/;

module.exports = function camelizeStyleName(string) {
  return camelize(string.replace(msPattern, 'ms-'));
};
},{"./camelize":15}],17:[function(require,module,exports){
'use strict';

var rUpper = /([A-Z])/g;

module.exports = function hyphenate(string) {
  return string.replace(rUpper, '-$1').toLowerCase();
};
},{}],18:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 * https://github.com/facebook/react/blob/2aeb8a2a6beb00617a4217f7f8284924fa2ad819/src/vendor/core/hyphenateStyleName.js
 */

"use strict";

var hyphenate = require("./hyphenate");
var msPattern = /^ms-/;

module.exports = function hyphenateStyleName(string) {
  return hyphenate(string).replace(msPattern, "-ms-");
};
},{"./hyphenate":17}],19:[function(require,module,exports){
'use strict';
module.exports = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
},{}],20:[function(require,module,exports){
'use strict';

var canUseDOM = require('./inDOM');

var size;

module.exports = function (recalc) {
  if (!size || recalc) {
    if (canUseDOM) {
      var scrollDiv = document.createElement('div');

      scrollDiv.style.position = 'absolute';
      scrollDiv.style.top = '-9999px';
      scrollDiv.style.width = '50px';
      scrollDiv.style.height = '50px';
      scrollDiv.style.overflow = 'scroll';

      document.body.appendChild(scrollDiv);
      size = scrollDiv.offsetWidth - scrollDiv.clientWidth;
      document.body.removeChild(scrollDiv);
    }
  }

  return size;
};
},{"./inDOM":19}],21:[function(require,module,exports){
(function (process){
// Generated by CoffeeScript 1.7.1
(function() {
  var getNanoSeconds, hrtime, loadTime;

  if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
    module.exports = function() {
      return performance.now();
    };
  } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
    module.exports = function() {
      return (getNanoSeconds() - loadTime) / 1e6;
    };
    hrtime = process.hrtime;
    getNanoSeconds = function() {
      var hr;
      hr = hrtime();
      return hr[0] * 1e9 + hr[1];
    };
    loadTime = getNanoSeconds();
  } else if (Date.now) {
    module.exports = function() {
      return Date.now() - loadTime;
    };
    loadTime = Date.now();
  } else {
    module.exports = function() {
      return new Date().getTime() - loadTime;
    };
    loadTime = new Date().getTime();
  }

}).call(this);

}).call(this,require('_process'))

},{"_process":22}],22:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],23:[function(require,module,exports){
(function (global){
var now = require('performance-now')
  , root = typeof window === 'undefined' ? global : window
  , vendors = ['moz', 'webkit']
  , suffix = 'AnimationFrame'
  , raf = root['request' + suffix]
  , caf = root['cancel' + suffix] || root['cancelRequest' + suffix]

for(var i = 0; !raf && i < vendors.length; i++) {
  raf = root[vendors[i] + 'Request' + suffix]
  caf = root[vendors[i] + 'Cancel' + suffix]
      || root[vendors[i] + 'CancelRequest' + suffix]
}

// Some versions of FF have rAF but not cAF
if(!raf || !caf) {
  var last = 0
    , id = 0
    , queue = []
    , frameDuration = 1000 / 60

  raf = function(callback) {
    if(queue.length === 0) {
      var _now = now()
        , next = Math.max(0, frameDuration - (_now - last))
      last = next + _now
      setTimeout(function() {
        var cp = queue.slice(0)
        // Clear queue here to prevent
        // callbacks from appending listeners
        // to the current frame's queue
        queue.length = 0
        for(var i = 0; i < cp.length; i++) {
          if(!cp[i].cancelled) {
            try{
              cp[i].callback(last)
            } catch(e) {
              setTimeout(function() { throw e }, 0)
            }
          }
        }
      }, Math.round(next))
    }
    queue.push({
      handle: ++id,
      callback: callback,
      cancelled: false
    })
    return id
  }

  caf = function(handle) {
    for(var i = 0; i < queue.length; i++) {
      if(queue[i].handle === handle) {
        queue[i].cancelled = true
      }
    }
  }
}

module.exports = function(fn) {
  // Wrap in a new function to prevent
  // `cancel` potentially being assigned
  // to the native rAF function
  return raf.call(root, fn)
}
module.exports.cancel = function() {
  caf.apply(root, arguments)
}
module.exports.polyfill = function() {
  root.requestAnimationFrame = raf
  root.cancelAnimationFrame = caf
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"performance-now":21}],24:[function(require,module,exports){
(function (global){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mapToZero = require('./mapToZero');

var _mapToZero2 = _interopRequireDefault(_mapToZero);

var _stripStyle = require('./stripStyle');

var _stripStyle2 = _interopRequireDefault(_stripStyle);

var _stepper3 = require('./stepper');

var _stepper4 = _interopRequireDefault(_stepper3);

var _performanceNow = require('performance-now');

var _performanceNow2 = _interopRequireDefault(_performanceNow);

var _raf = require('raf');

var _raf2 = _interopRequireDefault(_raf);

var _shouldStopAnimation = require('./shouldStopAnimation');

var _shouldStopAnimation2 = _interopRequireDefault(_shouldStopAnimation);

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var msPerFrame = 1000 / 60;

var Motion = _react2['default'].createClass({
  displayName: 'Motion',

  propTypes: {
    // TOOD: warn against putting a config in here
    defaultStyle: _react.PropTypes.objectOf(_react.PropTypes.number),
    style: _react.PropTypes.objectOf(_react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.object])).isRequired,
    children: _react.PropTypes.func.isRequired,
    onRest: _react.PropTypes.func
  },

  getInitialState: function getInitialState() {
    var _props = this.props;
    var defaultStyle = _props.defaultStyle;
    var style = _props.style;

    var currentStyle = defaultStyle || _stripStyle2['default'](style);
    var currentVelocity = _mapToZero2['default'](currentStyle);
    return {
      currentStyle: currentStyle,
      currentVelocity: currentVelocity,
      lastIdealStyle: currentStyle,
      lastIdealVelocity: currentVelocity
    };
  },

  wasAnimating: false,
  animationID: null,
  prevTime: 0,
  accumulatedTime: 0,
  // it's possible that currentStyle's value is stale: if props is immediately
  // changed from 0 to 400 to spring(0) again, the async currentStyle is still
  // at 0 (didn't have time to tick and interpolate even once). If we naively
  // compare currentStyle with destVal it'll be 0 === 0 (no animation, stop).
  // In reality currentStyle should be 400
  unreadPropStyle: null,
  // after checking for unreadPropStyle != null, we manually go set the
  // non-interpolating values (those that are a number, without a spring
  // config)
  clearUnreadPropStyle: function clearUnreadPropStyle(destStyle) {
    var dirty = false;
    var _state = this.state;
    var currentStyle = _state.currentStyle;
    var currentVelocity = _state.currentVelocity;
    var lastIdealStyle = _state.lastIdealStyle;
    var lastIdealVelocity = _state.lastIdealVelocity;

    for (var key in destStyle) {
      if (!destStyle.hasOwnProperty(key)) {
        continue;
      }

      var styleValue = destStyle[key];
      if (typeof styleValue === 'number') {
        if (!dirty) {
          dirty = true;
          currentStyle = _extends({}, currentStyle);
          currentVelocity = _extends({}, currentVelocity);
          lastIdealStyle = _extends({}, lastIdealStyle);
          lastIdealVelocity = _extends({}, lastIdealVelocity);
        }

        currentStyle[key] = styleValue;
        currentVelocity[key] = 0;
        lastIdealStyle[key] = styleValue;
        lastIdealVelocity[key] = 0;
      }
    }

    if (dirty) {
      this.setState({ currentStyle: currentStyle, currentVelocity: currentVelocity, lastIdealStyle: lastIdealStyle, lastIdealVelocity: lastIdealVelocity });
    }
  },

  startAnimationIfNecessary: function startAnimationIfNecessary() {
    var _this = this;

    // TODO: when config is {a: 10} and dest is {a: 10} do we raf once and
    // call cb? No, otherwise accidental parent rerender causes cb trigger
    this.animationID = _raf2['default'](function () {
      // check if we need to animate in the first place
      var propsStyle = _this.props.style;
      if (_shouldStopAnimation2['default'](_this.state.currentStyle, propsStyle, _this.state.currentVelocity)) {
        if (_this.wasAnimating && _this.props.onRest) {
          _this.props.onRest();
        }

        // no need to cancel animationID here; shouldn't have any in flight
        _this.animationID = null;
        _this.wasAnimating = false;
        _this.accumulatedTime = 0;
        return;
      }

      _this.wasAnimating = true;

      var currentTime = _performanceNow2['default']();
      var timeDelta = currentTime - _this.prevTime;
      _this.prevTime = currentTime;
      _this.accumulatedTime = _this.accumulatedTime + timeDelta;
      // more than 10 frames? prolly switched browser tab. Restart
      if (_this.accumulatedTime > msPerFrame * 10) {
        _this.accumulatedTime = 0;
      }

      if (_this.accumulatedTime === 0) {
        // no need to cancel animationID here; shouldn't have any in flight
        _this.animationID = null;
        _this.startAnimationIfNecessary();
        return;
      }

      var currentFrameCompletion = (_this.accumulatedTime - Math.floor(_this.accumulatedTime / msPerFrame) * msPerFrame) / msPerFrame;
      var framesToCatchUp = Math.floor(_this.accumulatedTime / msPerFrame);

      var newLastIdealStyle = {};
      var newLastIdealVelocity = {};
      var newCurrentStyle = {};
      var newCurrentVelocity = {};

      for (var key in propsStyle) {
        if (!propsStyle.hasOwnProperty(key)) {
          continue;
        }

        var styleValue = propsStyle[key];
        if (typeof styleValue === 'number') {
          newCurrentStyle[key] = styleValue;
          newCurrentVelocity[key] = 0;
          newLastIdealStyle[key] = styleValue;
          newLastIdealVelocity[key] = 0;
        } else {
          var newLastIdealStyleValue = _this.state.lastIdealStyle[key];
          var newLastIdealVelocityValue = _this.state.lastIdealVelocity[key];
          for (var i = 0; i < framesToCatchUp; i++) {
            var _stepper = _stepper4['default'](msPerFrame / 1000, newLastIdealStyleValue, newLastIdealVelocityValue, styleValue.val, styleValue.stiffness, styleValue.damping, styleValue.precision);

            newLastIdealStyleValue = _stepper[0];
            newLastIdealVelocityValue = _stepper[1];
          }

          var _stepper2 = _stepper4['default'](msPerFrame / 1000, newLastIdealStyleValue, newLastIdealVelocityValue, styleValue.val, styleValue.stiffness, styleValue.damping, styleValue.precision);

          var nextIdealX = _stepper2[0];
          var nextIdealV = _stepper2[1];

          newCurrentStyle[key] = newLastIdealStyleValue + (nextIdealX - newLastIdealStyleValue) * currentFrameCompletion;
          newCurrentVelocity[key] = newLastIdealVelocityValue + (nextIdealV - newLastIdealVelocityValue) * currentFrameCompletion;
          newLastIdealStyle[key] = newLastIdealStyleValue;
          newLastIdealVelocity[key] = newLastIdealVelocityValue;
        }
      }

      _this.animationID = null;
      // the amount we're looped over above
      _this.accumulatedTime -= framesToCatchUp * msPerFrame;

      _this.setState({
        currentStyle: newCurrentStyle,
        currentVelocity: newCurrentVelocity,
        lastIdealStyle: newLastIdealStyle,
        lastIdealVelocity: newLastIdealVelocity
      });

      _this.unreadPropStyle = null;

      _this.startAnimationIfNecessary();
    });
  },

  componentDidMount: function componentDidMount() {
    this.prevTime = _performanceNow2['default']();
    this.startAnimationIfNecessary();
  },

  componentWillReceiveProps: function componentWillReceiveProps(props) {
    if (this.unreadPropStyle != null) {
      // previous props haven't had the chance to be set yet; set them here
      this.clearUnreadPropStyle(this.unreadPropStyle);
    }

    this.unreadPropStyle = props.style;
    if (this.animationID == null) {
      this.prevTime = _performanceNow2['default']();
      this.startAnimationIfNecessary();
    }
  },

  componentWillUnmount: function componentWillUnmount() {
    if (this.animationID != null) {
      _raf2['default'].cancel(this.animationID);
      this.animationID = null;
    }
  },

  render: function render() {
    var renderedChildren = this.props.children(this.state.currentStyle);
    return renderedChildren && _react2['default'].Children.only(renderedChildren);
  }
});

exports['default'] = Motion;
module.exports = exports['default'];
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./mapToZero":27,"./shouldStopAnimation":32,"./stepper":34,"./stripStyle":35,"performance-now":21,"raf":23}],25:[function(require,module,exports){
(function (global){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mapToZero = require('./mapToZero');

var _mapToZero2 = _interopRequireDefault(_mapToZero);

var _stripStyle = require('./stripStyle');

var _stripStyle2 = _interopRequireDefault(_stripStyle);

var _stepper3 = require('./stepper');

var _stepper4 = _interopRequireDefault(_stepper3);

var _performanceNow = require('performance-now');

var _performanceNow2 = _interopRequireDefault(_performanceNow);

var _raf = require('raf');

var _raf2 = _interopRequireDefault(_raf);

var _shouldStopAnimation = require('./shouldStopAnimation');

var _shouldStopAnimation2 = _interopRequireDefault(_shouldStopAnimation);

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var msPerFrame = 1000 / 60;

function shouldStopAnimationAll(currentStyles, styles, currentVelocities) {
  for (var i = 0; i < currentStyles.length; i++) {
    if (!_shouldStopAnimation2['default'](currentStyles[i], styles[i], currentVelocities[i])) {
      return false;
    }
  }
  return true;
}

var StaggeredMotion = _react2['default'].createClass({
  displayName: 'StaggeredMotion',

  propTypes: {
    // TOOD: warn against putting a config in here
    defaultStyles: _react.PropTypes.arrayOf(_react.PropTypes.objectOf(_react.PropTypes.number)),
    styles: _react.PropTypes.func.isRequired,
    children: _react.PropTypes.func.isRequired
  },

  getInitialState: function getInitialState() {
    var _props = this.props;
    var defaultStyles = _props.defaultStyles;
    var styles = _props.styles;

    var currentStyles = defaultStyles || styles().map(_stripStyle2['default']);
    var currentVelocities = currentStyles.map(function (currentStyle) {
      return _mapToZero2['default'](currentStyle);
    });
    return {
      currentStyles: currentStyles,
      currentVelocities: currentVelocities,
      lastIdealStyles: currentStyles,
      lastIdealVelocities: currentVelocities
    };
  },

  animationID: null,
  prevTime: 0,
  accumulatedTime: 0,
  // it's possible that currentStyle's value is stale: if props is immediately
  // changed from 0 to 400 to spring(0) again, the async currentStyle is still
  // at 0 (didn't have time to tick and interpolate even once). If we naively
  // compare currentStyle with destVal it'll be 0 === 0 (no animation, stop).
  // In reality currentStyle should be 400
  unreadPropStyles: null,
  // after checking for unreadPropStyles != null, we manually go set the
  // non-interpolating values (those that are a number, without a spring
  // config)
  clearUnreadPropStyle: function clearUnreadPropStyle(unreadPropStyles) {
    var _state = this.state;
    var currentStyles = _state.currentStyles;
    var currentVelocities = _state.currentVelocities;
    var lastIdealStyles = _state.lastIdealStyles;
    var lastIdealVelocities = _state.lastIdealVelocities;

    var someDirty = false;
    for (var i = 0; i < unreadPropStyles.length; i++) {
      var unreadPropStyle = unreadPropStyles[i];
      var dirty = false;

      for (var key in unreadPropStyle) {
        if (!unreadPropStyle.hasOwnProperty(key)) {
          continue;
        }

        var styleValue = unreadPropStyle[key];
        if (typeof styleValue === 'number') {
          if (!dirty) {
            dirty = true;
            someDirty = true;
            currentStyles[i] = _extends({}, currentStyles[i]);
            currentVelocities[i] = _extends({}, currentVelocities[i]);
            lastIdealStyles[i] = _extends({}, lastIdealStyles[i]);
            lastIdealVelocities[i] = _extends({}, lastIdealVelocities[i]);
          }
          currentStyles[i][key] = styleValue;
          currentVelocities[i][key] = 0;
          lastIdealStyles[i][key] = styleValue;
          lastIdealVelocities[i][key] = 0;
        }
      }
    }

    if (someDirty) {
      this.setState({ currentStyles: currentStyles, currentVelocities: currentVelocities, lastIdealStyles: lastIdealStyles, lastIdealVelocities: lastIdealVelocities });
    }
  },

  startAnimationIfNecessary: function startAnimationIfNecessary() {
    var _this = this;

    // TODO: when config is {a: 10} and dest is {a: 10} do we raf once and
    // call cb? No, otherwise accidental parent rerender causes cb trigger
    this.animationID = _raf2['default'](function () {
      var destStyles = _this.props.styles(_this.state.lastIdealStyles);

      // check if we need to animate in the first place
      if (shouldStopAnimationAll(_this.state.currentStyles, destStyles, _this.state.currentVelocities)) {
        // no need to cancel animationID here; shouldn't have any in flight
        _this.animationID = null;
        _this.accumulatedTime = 0;
        return;
      }

      var currentTime = _performanceNow2['default']();
      var timeDelta = currentTime - _this.prevTime;
      _this.prevTime = currentTime;
      _this.accumulatedTime = _this.accumulatedTime + timeDelta;
      // more than 10 frames? prolly switched browser tab. Restart
      if (_this.accumulatedTime > msPerFrame * 10) {
        _this.accumulatedTime = 0;
      }

      if (_this.accumulatedTime === 0) {
        // no need to cancel animationID here; shouldn't have any in flight
        _this.animationID = null;
        _this.startAnimationIfNecessary();
        return;
      }

      var currentFrameCompletion = (_this.accumulatedTime - Math.floor(_this.accumulatedTime / msPerFrame) * msPerFrame) / msPerFrame;
      var framesToCatchUp = Math.floor(_this.accumulatedTime / msPerFrame);

      var newLastIdealStyles = [];
      var newLastIdealVelocities = [];
      var newCurrentStyles = [];
      var newCurrentVelocities = [];

      for (var i = 0; i < destStyles.length; i++) {
        var destStyle = destStyles[i];
        var newCurrentStyle = {};
        var newCurrentVelocity = {};
        var newLastIdealStyle = {};
        var newLastIdealVelocity = {};

        for (var key in destStyle) {
          if (!destStyle.hasOwnProperty(key)) {
            continue;
          }

          var styleValue = destStyle[key];
          if (typeof styleValue === 'number') {
            newCurrentStyle[key] = styleValue;
            newCurrentVelocity[key] = 0;
            newLastIdealStyle[key] = styleValue;
            newLastIdealVelocity[key] = 0;
          } else {
            var newLastIdealStyleValue = _this.state.lastIdealStyles[i][key];
            var newLastIdealVelocityValue = _this.state.lastIdealVelocities[i][key];
            for (var j = 0; j < framesToCatchUp; j++) {
              var _stepper = _stepper4['default'](msPerFrame / 1000, newLastIdealStyleValue, newLastIdealVelocityValue, styleValue.val, styleValue.stiffness, styleValue.damping, styleValue.precision);

              newLastIdealStyleValue = _stepper[0];
              newLastIdealVelocityValue = _stepper[1];
            }

            var _stepper2 = _stepper4['default'](msPerFrame / 1000, newLastIdealStyleValue, newLastIdealVelocityValue, styleValue.val, styleValue.stiffness, styleValue.damping, styleValue.precision);

            var nextIdealX = _stepper2[0];
            var nextIdealV = _stepper2[1];

            newCurrentStyle[key] = newLastIdealStyleValue + (nextIdealX - newLastIdealStyleValue) * currentFrameCompletion;
            newCurrentVelocity[key] = newLastIdealVelocityValue + (nextIdealV - newLastIdealVelocityValue) * currentFrameCompletion;
            newLastIdealStyle[key] = newLastIdealStyleValue;
            newLastIdealVelocity[key] = newLastIdealVelocityValue;
          }
        }

        newCurrentStyles[i] = newCurrentStyle;
        newCurrentVelocities[i] = newCurrentVelocity;
        newLastIdealStyles[i] = newLastIdealStyle;
        newLastIdealVelocities[i] = newLastIdealVelocity;
      }

      _this.animationID = null;
      // the amount we're looped over above
      _this.accumulatedTime -= framesToCatchUp * msPerFrame;

      _this.setState({
        currentStyles: newCurrentStyles,
        currentVelocities: newCurrentVelocities,
        lastIdealStyles: newLastIdealStyles,
        lastIdealVelocities: newLastIdealVelocities
      });

      _this.unreadPropStyles = null;

      _this.startAnimationIfNecessary();
    });
  },

  componentDidMount: function componentDidMount() {
    this.prevTime = _performanceNow2['default']();
    this.startAnimationIfNecessary();
  },

  componentWillReceiveProps: function componentWillReceiveProps(props) {
    if (this.unreadPropStyles != null) {
      // previous props haven't had the chance to be set yet; set them here
      this.clearUnreadPropStyle(this.unreadPropStyles);
    }

    this.unreadPropStyles = props.styles(this.state.lastIdealStyles);
    if (this.animationID == null) {
      this.prevTime = _performanceNow2['default']();
      this.startAnimationIfNecessary();
    }
  },

  componentWillUnmount: function componentWillUnmount() {
    if (this.animationID != null) {
      _raf2['default'].cancel(this.animationID);
      this.animationID = null;
    }
  },

  render: function render() {
    var renderedChildren = this.props.children(this.state.currentStyles);
    return renderedChildren && _react2['default'].Children.only(renderedChildren);
  }
});

exports['default'] = StaggeredMotion;
module.exports = exports['default'];
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./mapToZero":27,"./shouldStopAnimation":32,"./stepper":34,"./stripStyle":35,"performance-now":21,"raf":23}],26:[function(require,module,exports){
(function (global){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mapToZero = require('./mapToZero');

var _mapToZero2 = _interopRequireDefault(_mapToZero);

var _stripStyle = require('./stripStyle');

var _stripStyle2 = _interopRequireDefault(_stripStyle);

var _stepper3 = require('./stepper');

var _stepper4 = _interopRequireDefault(_stepper3);

var _mergeDiff = require('./mergeDiff');

var _mergeDiff2 = _interopRequireDefault(_mergeDiff);

var _performanceNow = require('performance-now');

var _performanceNow2 = _interopRequireDefault(_performanceNow);

var _raf = require('raf');

var _raf2 = _interopRequireDefault(_raf);

var _shouldStopAnimation = require('./shouldStopAnimation');

var _shouldStopAnimation2 = _interopRequireDefault(_shouldStopAnimation);

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var msPerFrame = 1000 / 60;

// the children function & (potential) styles function asks as param an
// Array<TransitionPlainStyle>, where each TransitionPlainStyle is of the format
// {key: string, data?: any, style: PlainStyle}. However, the way we keep
// internal states doesn't contain such a data structure (check the state and
// TransitionMotionState). So when children function and others ask for such
// data we need to generate them on the fly by combining mergedPropsStyles and
// currentStyles/lastIdealStyles
function rehydrateStyles(mergedPropsStyles, unreadPropStyles, plainStyles) {
  if (unreadPropStyles == null) {
    // $FlowFixMe
    return mergedPropsStyles.map(function (mergedPropsStyle, i) {
      return {
        key: mergedPropsStyle.key,
        data: mergedPropsStyle.data,
        style: plainStyles[i]
      };
    });
  }
  return mergedPropsStyles.map(function (mergedPropsStyle, i) {
    // $FlowFixMe
    for (var j = 0; j < unreadPropStyles.length; j++) {
      // $FlowFixMe
      if (unreadPropStyles[j].key === mergedPropsStyle.key) {
        return {
          // $FlowFixMe
          key: unreadPropStyles[j].key,
          data: unreadPropStyles[j].data,
          style: plainStyles[i]
        };
      }
    }
    // $FlowFixMe
    return { key: mergedPropsStyle.key, data: mergedPropsStyle.data, style: plainStyles[i] };
  });
}

function shouldStopAnimationAll(currentStyles, destStyles, currentVelocities, mergedPropsStyles) {
  if (mergedPropsStyles.length !== destStyles.length) {
    return false;
  }

  for (var i = 0; i < mergedPropsStyles.length; i++) {
    if (mergedPropsStyles[i].key !== destStyles[i].key) {
      return false;
    }
  }

  // we have the invariant that mergedPropsStyles and
  // currentStyles/currentVelocities/last* are synced in terms of cells, see
  // mergeAndSync comment for more info
  for (var i = 0; i < mergedPropsStyles.length; i++) {
    if (!_shouldStopAnimation2['default'](currentStyles[i], destStyles[i].style, currentVelocities[i])) {
      return false;
    }
  }

  return true;
}

// core key merging logic

// things to do: say previously merged style is {a, b}, dest style (prop) is {b,
// c}, previous current (interpolating) style is {a, b}
// **invariant**: current[i] corresponds to merged[i] in terms of key

// steps:
// turn merged style into {a?, b, c}
//    add c, value of c is destStyles.c
//    maybe remove a, aka call willLeave(a), then merged is either {b, c} or {a, b, c}
// turn current (interpolating) style from {a, b} into {a?, b, c}
//    maybe remove a
//    certainly add c, value of c is willEnter(c)
// loop over merged and construct new current
// dest doesn't change, that's owner's
function mergeAndSync(willEnter, willLeave, oldMergedPropsStyles, destStyles, oldCurrentStyles, oldCurrentVelocities, oldLastIdealStyles, oldLastIdealVelocities) {
  var newMergedPropsStyles = _mergeDiff2['default'](oldMergedPropsStyles, destStyles, function (oldIndex, oldMergedPropsStyle) {
    var leavingStyle = willLeave(oldMergedPropsStyle);
    if (leavingStyle == null) {
      return null;
    }
    if (_shouldStopAnimation2['default'](oldCurrentStyles[oldIndex], leavingStyle, oldCurrentVelocities[oldIndex])) {
      return null;
    }
    return { key: oldMergedPropsStyle.key, data: oldMergedPropsStyle.data, style: leavingStyle };
  });

  var newCurrentStyles = [];
  var newCurrentVelocities = [];
  var newLastIdealStyles = [];
  var newLastIdealVelocities = [];
  for (var i = 0; i < newMergedPropsStyles.length; i++) {
    var newMergedPropsStyleCell = newMergedPropsStyles[i];
    var foundOldIndex = null;
    for (var j = 0; j < oldMergedPropsStyles.length; j++) {
      if (oldMergedPropsStyles[j].key === newMergedPropsStyleCell.key) {
        foundOldIndex = j;
        break;
      }
    }
    // TODO: key search code
    if (foundOldIndex == null) {
      var plainStyle = willEnter(newMergedPropsStyleCell);
      newCurrentStyles[i] = plainStyle;
      newLastIdealStyles[i] = plainStyle;

      // $FlowFixMe
      var velocity = _mapToZero2['default'](newMergedPropsStyleCell.style);
      newCurrentVelocities[i] = velocity;
      newLastIdealVelocities[i] = velocity;
    } else {
      newCurrentStyles[i] = oldCurrentStyles[foundOldIndex];
      newLastIdealStyles[i] = oldLastIdealStyles[foundOldIndex];
      newCurrentVelocities[i] = oldCurrentVelocities[foundOldIndex];
      newLastIdealVelocities[i] = oldLastIdealVelocities[foundOldIndex];
    }
  }

  return [newMergedPropsStyles, newCurrentStyles, newCurrentVelocities, newLastIdealStyles, newLastIdealVelocities];
}

var TransitionMotion = _react2['default'].createClass({
  displayName: 'TransitionMotion',

  propTypes: {
    defaultStyles: _react.PropTypes.arrayOf(_react.PropTypes.shape({
      key: _react.PropTypes.string.isRequired,
      data: _react.PropTypes.any,
      style: _react.PropTypes.objectOf(_react.PropTypes.number).isRequired
    })),
    styles: _react.PropTypes.oneOfType([_react.PropTypes.func, _react.PropTypes.arrayOf(_react.PropTypes.shape({
      key: _react.PropTypes.string.isRequired,
      data: _react.PropTypes.any,
      style: _react.PropTypes.objectOf(_react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.object])).isRequired
    }))]).isRequired,
    children: _react.PropTypes.func.isRequired,
    willLeave: _react.PropTypes.func,
    willEnter: _react.PropTypes.func
  },

  getDefaultProps: function getDefaultProps() {
    return {
      willEnter: function willEnter(styleThatEntered) {
        return _stripStyle2['default'](styleThatEntered.style);
      },
      // recall: returning null makes the current unmounting TransitionStyle
      // disappear immediately
      willLeave: function willLeave() {
        return null;
      }
    };
  },

  getInitialState: function getInitialState() {
    var _props = this.props;
    var defaultStyles = _props.defaultStyles;
    var styles = _props.styles;
    var willEnter = _props.willEnter;
    var willLeave = _props.willLeave;

    var destStyles = typeof styles === 'function' ? styles(defaultStyles) : styles;

    // this is special. for the first time around, we don't have a comparison
    // between last (no last) and current merged props. we'll compute last so:
    // say default is {a, b} and styles (dest style) is {b, c}, we'll
    // fabricate last as {a, b}
    var oldMergedPropsStyles = undefined;
    if (defaultStyles == null) {
      oldMergedPropsStyles = destStyles;
    } else {
      // $FlowFixMe
      oldMergedPropsStyles = defaultStyles.map(function (defaultStyleCell) {
        // TODO: key search code
        for (var i = 0; i < destStyles.length; i++) {
          if (destStyles[i].key === defaultStyleCell.key) {
            return destStyles[i];
          }
        }
        return defaultStyleCell;
      });
    }
    var oldCurrentStyles = defaultStyles == null ? destStyles.map(function (s) {
      return _stripStyle2['default'](s.style);
    }) : defaultStyles.map(function (s) {
      return _stripStyle2['default'](s.style);
    });
    var oldCurrentVelocities = defaultStyles == null ? destStyles.map(function (s) {
      return _mapToZero2['default'](s.style);
    }) : defaultStyles.map(function (s) {
      return _mapToZero2['default'](s.style);
    });

    var _mergeAndSync = mergeAndSync(
    // $FlowFixMe
    willEnter,
    // $FlowFixMe
    willLeave, oldMergedPropsStyles, destStyles, oldCurrentStyles, oldCurrentVelocities, oldCurrentStyles, // oldLastIdealStyles really
    oldCurrentVelocities);

    var mergedPropsStyles = _mergeAndSync[0];
    var currentStyles = _mergeAndSync[1];
    var currentVelocities = _mergeAndSync[2];
    var lastIdealStyles = _mergeAndSync[3];
    var lastIdealVelocities = _mergeAndSync[4];
    // oldLastIdealVelocities really

    return {
      currentStyles: currentStyles,
      currentVelocities: currentVelocities,
      lastIdealStyles: lastIdealStyles,
      lastIdealVelocities: lastIdealVelocities,
      mergedPropsStyles: mergedPropsStyles
    };
  },

  animationID: null,
  prevTime: 0,
  accumulatedTime: 0,
  // it's possible that currentStyle's value is stale: if props is immediately
  // changed from 0 to 400 to spring(0) again, the async currentStyle is still
  // at 0 (didn't have time to tick and interpolate even once). If we naively
  // compare currentStyle with destVal it'll be 0 === 0 (no animation, stop).
  // In reality currentStyle should be 400
  unreadPropStyles: null,
  // after checking for unreadPropStyles != null, we manually go set the
  // non-interpolating values (those that are a number, without a spring
  // config)
  clearUnreadPropStyle: function clearUnreadPropStyle(unreadPropStyles) {
    var _mergeAndSync2 = mergeAndSync(
    // $FlowFixMe
    this.props.willEnter,
    // $FlowFixMe
    this.props.willLeave, this.state.mergedPropsStyles, unreadPropStyles, this.state.currentStyles, this.state.currentVelocities, this.state.lastIdealStyles, this.state.lastIdealVelocities);

    var mergedPropsStyles = _mergeAndSync2[0];
    var currentStyles = _mergeAndSync2[1];
    var currentVelocities = _mergeAndSync2[2];
    var lastIdealStyles = _mergeAndSync2[3];
    var lastIdealVelocities = _mergeAndSync2[4];

    for (var i = 0; i < unreadPropStyles.length; i++) {
      var unreadPropStyle = unreadPropStyles[i].style;
      var dirty = false;

      for (var key in unreadPropStyle) {
        if (!unreadPropStyle.hasOwnProperty(key)) {
          continue;
        }

        var styleValue = unreadPropStyle[key];
        if (typeof styleValue === 'number') {
          if (!dirty) {
            dirty = true;
            currentStyles[i] = _extends({}, currentStyles[i]);
            currentVelocities[i] = _extends({}, currentVelocities[i]);
            lastIdealStyles[i] = _extends({}, lastIdealStyles[i]);
            lastIdealVelocities[i] = _extends({}, lastIdealVelocities[i]);
            mergedPropsStyles[i] = {
              key: mergedPropsStyles[i].key,
              data: mergedPropsStyles[i].data,
              style: _extends({}, mergedPropsStyles[i].style)
            };
          }
          currentStyles[i][key] = styleValue;
          currentVelocities[i][key] = 0;
          lastIdealStyles[i][key] = styleValue;
          lastIdealVelocities[i][key] = 0;
          mergedPropsStyles[i].style[key] = styleValue;
        }
      }
    }

    // unlike the other 2 components, we can't detect staleness and optionally
    // opt out of setState here. each style object's data might contain new
    // stuff we're not/cannot compare
    this.setState({
      currentStyles: currentStyles,
      currentVelocities: currentVelocities,
      mergedPropsStyles: mergedPropsStyles,
      lastIdealStyles: lastIdealStyles,
      lastIdealVelocities: lastIdealVelocities
    });
  },

  startAnimationIfNecessary: function startAnimationIfNecessary() {
    var _this = this;

    // TODO: when config is {a: 10} and dest is {a: 10} do we raf once and
    // call cb? No, otherwise accidental parent rerender causes cb trigger
    this.animationID = _raf2['default'](function () {
      var propStyles = _this.props.styles;
      var destStyles = typeof propStyles === 'function' ? propStyles(rehydrateStyles(_this.state.mergedPropsStyles, _this.unreadPropStyles, _this.state.lastIdealStyles)) : propStyles;

      // check if we need to animate in the first place
      if (shouldStopAnimationAll(_this.state.currentStyles, destStyles, _this.state.currentVelocities, _this.state.mergedPropsStyles)) {
        // no need to cancel animationID here; shouldn't have any in flight
        _this.animationID = null;
        _this.accumulatedTime = 0;
        return;
      }

      var currentTime = _performanceNow2['default']();
      var timeDelta = currentTime - _this.prevTime;
      _this.prevTime = currentTime;
      _this.accumulatedTime = _this.accumulatedTime + timeDelta;
      // more than 10 frames? prolly switched browser tab. Restart
      if (_this.accumulatedTime > msPerFrame * 10) {
        _this.accumulatedTime = 0;
      }

      if (_this.accumulatedTime === 0) {
        // no need to cancel animationID here; shouldn't have any in flight
        _this.animationID = null;
        _this.startAnimationIfNecessary();
        return;
      }

      var currentFrameCompletion = (_this.accumulatedTime - Math.floor(_this.accumulatedTime / msPerFrame) * msPerFrame) / msPerFrame;
      var framesToCatchUp = Math.floor(_this.accumulatedTime / msPerFrame);

      var _mergeAndSync3 = mergeAndSync(
      // $FlowFixMe
      _this.props.willEnter,
      // $FlowFixMe
      _this.props.willLeave, _this.state.mergedPropsStyles, destStyles, _this.state.currentStyles, _this.state.currentVelocities, _this.state.lastIdealStyles, _this.state.lastIdealVelocities);

      var newMergedPropsStyles = _mergeAndSync3[0];
      var newCurrentStyles = _mergeAndSync3[1];
      var newCurrentVelocities = _mergeAndSync3[2];
      var newLastIdealStyles = _mergeAndSync3[3];
      var newLastIdealVelocities = _mergeAndSync3[4];

      for (var i = 0; i < newMergedPropsStyles.length; i++) {
        var newMergedPropsStyle = newMergedPropsStyles[i].style;
        var newCurrentStyle = {};
        var newCurrentVelocity = {};
        var newLastIdealStyle = {};
        var newLastIdealVelocity = {};

        for (var key in newMergedPropsStyle) {
          if (!newMergedPropsStyle.hasOwnProperty(key)) {
            continue;
          }

          var styleValue = newMergedPropsStyle[key];
          if (typeof styleValue === 'number') {
            newCurrentStyle[key] = styleValue;
            newCurrentVelocity[key] = 0;
            newLastIdealStyle[key] = styleValue;
            newLastIdealVelocity[key] = 0;
          } else {
            var newLastIdealStyleValue = newLastIdealStyles[i][key];
            var newLastIdealVelocityValue = newLastIdealVelocities[i][key];
            for (var j = 0; j < framesToCatchUp; j++) {
              var _stepper = _stepper4['default'](msPerFrame / 1000, newLastIdealStyleValue, newLastIdealVelocityValue, styleValue.val, styleValue.stiffness, styleValue.damping, styleValue.precision);

              newLastIdealStyleValue = _stepper[0];
              newLastIdealVelocityValue = _stepper[1];
            }

            var _stepper2 = _stepper4['default'](msPerFrame / 1000, newLastIdealStyleValue, newLastIdealVelocityValue, styleValue.val, styleValue.stiffness, styleValue.damping, styleValue.precision);

            var nextIdealX = _stepper2[0];
            var nextIdealV = _stepper2[1];

            newCurrentStyle[key] = newLastIdealStyleValue + (nextIdealX - newLastIdealStyleValue) * currentFrameCompletion;
            newCurrentVelocity[key] = newLastIdealVelocityValue + (nextIdealV - newLastIdealVelocityValue) * currentFrameCompletion;
            newLastIdealStyle[key] = newLastIdealStyleValue;
            newLastIdealVelocity[key] = newLastIdealVelocityValue;
          }
        }

        newLastIdealStyles[i] = newLastIdealStyle;
        newLastIdealVelocities[i] = newLastIdealVelocity;
        newCurrentStyles[i] = newCurrentStyle;
        newCurrentVelocities[i] = newCurrentVelocity;
      }

      _this.animationID = null;
      // the amount we're looped over above
      _this.accumulatedTime -= framesToCatchUp * msPerFrame;

      _this.setState({
        currentStyles: newCurrentStyles,
        currentVelocities: newCurrentVelocities,
        lastIdealStyles: newLastIdealStyles,
        lastIdealVelocities: newLastIdealVelocities,
        mergedPropsStyles: newMergedPropsStyles
      });

      _this.unreadPropStyles = null;

      _this.startAnimationIfNecessary();
    });
  },

  componentDidMount: function componentDidMount() {
    this.prevTime = _performanceNow2['default']();
    this.startAnimationIfNecessary();
  },

  componentWillReceiveProps: function componentWillReceiveProps(props) {
    if (this.unreadPropStyles) {
      // previous props haven't had the chance to be set yet; set them here
      this.clearUnreadPropStyle(this.unreadPropStyles);
    }

    if (typeof props.styles === 'function') {
      // $FlowFixMe
      this.unreadPropStyles = props.styles(rehydrateStyles(this.state.mergedPropsStyles, this.unreadPropStyles, this.state.lastIdealStyles));
    } else {
      this.unreadPropStyles = props.styles;
    }

    if (this.animationID == null) {
      this.prevTime = _performanceNow2['default']();
      this.startAnimationIfNecessary();
    }
  },

  componentWillUnmount: function componentWillUnmount() {
    if (this.animationID != null) {
      _raf2['default'].cancel(this.animationID);
      this.animationID = null;
    }
  },

  render: function render() {
    var hydratedStyles = rehydrateStyles(this.state.mergedPropsStyles, this.unreadPropStyles, this.state.currentStyles);
    var renderedChildren = this.props.children(hydratedStyles);
    return renderedChildren && _react2['default'].Children.only(renderedChildren);
  }
});

exports['default'] = TransitionMotion;
module.exports = exports['default'];

// list of styles, each containing interpolating values. Part of what's passed
// to children function. Notice that this is
// Array<ActualInterpolatingStyleObject>, without the wrapper that is {key: ...,
// data: ... style: ActualInterpolatingStyleObject}. Only mergedPropsStyles
// contains the key & data info (so that we only have a single source of truth
// for these, and to save space). Check the comment for `rehydrateStyles` to
// see how we regenerate the entirety of what's passed to children function

// the array that keeps track of currently rendered stuff! Including stuff
// that you've unmounted but that's still animating. This is where it lives
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./mapToZero":27,"./mergeDiff":28,"./shouldStopAnimation":32,"./stepper":34,"./stripStyle":35,"performance-now":21,"raf":23}],27:[function(require,module,exports){


// currently used to initiate the velocity style object to 0
'use strict';

exports.__esModule = true;
exports['default'] = mapToZero;

function mapToZero(obj) {
  var ret = {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      ret[key] = 0;
    }
  }
  return ret;
}

module.exports = exports['default'];
},{}],28:[function(require,module,exports){


// core keys merging algorithm. If previous render's keys are [a, b], and the
// next render's [c, b, d], what's the final merged keys and ordering?

// - c and a must both be before b
// - b before d
// - ordering between a and c ambiguous

// this reduces to merging two partially ordered lists (e.g. lists where not
// every item has a definite ordering, like comparing a and c above). For the
// ambiguous ordering we deterministically choose to place the next render's
// item after the previous'; so c after a

// this is called a topological sorting. Except the existing algorithms don't
// work well with js bc of the amount of allocation, and isn't optimized for our
// current use-case bc the runtime is linear in terms of edges (see wiki for
// meaning), which is huge when two lists have many common elements
'use strict';

exports.__esModule = true;
exports['default'] = mergeDiff;

function mergeDiff(prev, next, onRemove) {
  // bookkeeping for easier access of a key's index below. This is 2 allocations +
  // potentially triggering chrome hash map mode for objs (so it might be faster

  var prevKeyIndex = {};
  for (var i = 0; i < prev.length; i++) {
    prevKeyIndex[prev[i].key] = i;
  }
  var nextKeyIndex = {};
  for (var i = 0; i < next.length; i++) {
    nextKeyIndex[next[i].key] = i;
  }

  // first, an overly elaborate way of merging prev and next, eliminating
  // duplicates (in terms of keys). If there's dupe, keep the item in next).
  // This way of writing it saves allocations
  var ret = [];
  for (var i = 0; i < next.length; i++) {
    ret[i] = next[i];
  }
  for (var i = 0; i < prev.length; i++) {
    if (!nextKeyIndex.hasOwnProperty(prev[i].key)) {
      // this is called my TM's `mergeAndSync`, which calls willLeave. We don't
      // merge in keys that the user desires to kill
      var fill = onRemove(i, prev[i]);
      if (fill != null) {
        ret.push(fill);
      }
    }
  }

  // now all the items all present. Core sorting logic to have the right order
  return ret.sort(function (a, b) {
    var nextOrderA = nextKeyIndex[a.key];
    var nextOrderB = nextKeyIndex[b.key];
    var prevOrderA = prevKeyIndex[a.key];
    var prevOrderB = prevKeyIndex[b.key];

    if (nextOrderA != null && nextOrderB != null) {
      // both keys in next
      return nextKeyIndex[a.key] - nextKeyIndex[b.key];
    } else if (prevOrderA != null && prevOrderB != null) {
      // both keys in prev
      return prevKeyIndex[a.key] - prevKeyIndex[b.key];
    } else if (nextOrderA != null) {
      // key a in next, key b in prev

      // how to determine the order between a and b? We find a "pivot" (term
      // abuse), a key present in both prev and next, that is sandwiched between
      // a and b. In the context of our above example, if we're comparing a and
      // d, b's (the only) pivot
      for (var i = 0; i < next.length; i++) {
        var pivot = next[i].key;
        if (!prevKeyIndex.hasOwnProperty(pivot)) {
          continue;
        }

        if (nextOrderA < nextKeyIndex[pivot] && prevOrderB > prevKeyIndex[pivot]) {
          return -1;
        } else if (nextOrderA > nextKeyIndex[pivot] && prevOrderB < prevKeyIndex[pivot]) {
          return 1;
        }
      }
      // pluggable. default to: next bigger than prev
      return 1;
    }
    // prevOrderA, nextOrderB
    for (var i = 0; i < next.length; i++) {
      var pivot = next[i].key;
      if (!prevKeyIndex.hasOwnProperty(pivot)) {
        continue;
      }
      if (nextOrderB < nextKeyIndex[pivot] && prevOrderA > prevKeyIndex[pivot]) {
        return 1;
      } else if (nextOrderB > nextKeyIndex[pivot] && prevOrderA < prevKeyIndex[pivot]) {
        return -1;
      }
    }
    // pluggable. default to: next bigger than prev
    return -1;
  });
}

module.exports = exports['default'];
// to loop through and find a key's index each time), but I no longer care
},{}],29:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports["default"] = {
  noWobble: { stiffness: 170, damping: 26 }, // the default, if nothing provided
  gentle: { stiffness: 120, damping: 14 },
  wobbly: { stiffness: 180, damping: 12 },
  stiff: { stiffness: 210, damping: 20 }
};
module.exports = exports["default"];
},{}],30:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

var _Motion = require('./Motion');

exports.Motion = _interopRequire(_Motion);

var _StaggeredMotion = require('./StaggeredMotion');

exports.StaggeredMotion = _interopRequire(_StaggeredMotion);

var _TransitionMotion = require('./TransitionMotion');

exports.TransitionMotion = _interopRequire(_TransitionMotion);

var _spring = require('./spring');

exports.spring = _interopRequire(_spring);

var _presets = require('./presets');

exports.presets = _interopRequire(_presets);

// deprecated, dummy warning function

var _reorderKeys = require('./reorderKeys');

exports.reorderKeys = _interopRequire(_reorderKeys);
},{"./Motion":24,"./StaggeredMotion":25,"./TransitionMotion":26,"./presets":29,"./reorderKeys":31,"./spring":33}],31:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;
exports['default'] = reorderKeys;

var hasWarned = false;

function reorderKeys() {
  if (process.env.NODE_ENV === 'development') {
    if (!hasWarned) {
      hasWarned = true;
      console.error('`reorderKeys` has been removed, since it is no longer needed for TransitionMotion\'s new styles array API.');
    }
  }
}

module.exports = exports['default'];
}).call(this,require('_process'))

},{"_process":22}],32:[function(require,module,exports){


// usage assumption: currentStyle values have already been rendered but it says
// nothing of whether currentStyle is stale (see unreadPropStyle)
'use strict';

exports.__esModule = true;
exports['default'] = shouldStopAnimation;

function shouldStopAnimation(currentStyle, style, currentVelocity) {
  for (var key in style) {
    if (!style.hasOwnProperty(key)) {
      continue;
    }

    if (currentVelocity[key] !== 0) {
      return false;
    }

    var styleValue = typeof style[key] === 'number' ? style[key] : style[key].val;
    // stepper will have already taken care of rounding precision errors, so
    // won't have such thing as 0.9999 !=== 1
    if (currentStyle[key] !== styleValue) {
      return false;
    }
  }

  return true;
}

module.exports = exports['default'];
},{}],33:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = spring;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _presets = require('./presets');

var _presets2 = _interopRequireDefault(_presets);

var defaultConfig = _extends({}, _presets2['default'].noWobble, {
  precision: 0.01
});

function spring(val, config) {
  return _extends({}, defaultConfig, config, { val: val });
}

module.exports = exports['default'];
},{"./presets":29}],34:[function(require,module,exports){


// stepper is used a lot. Saves allocation to return the same array wrapper.
// This is fine and danger-free against mutations because the callsite
// immediately destructures it and gets the numbers inside without passing the
"use strict";

exports.__esModule = true;
exports["default"] = stepper;

var reusedTuple = [];

function stepper(secondPerFrame, x, v, destX, k, b, precision) {
  // Spring stiffness, in kg / s^2

  // for animations, destX is really spring length (spring at rest). initial
  // position is considered as the stretched/compressed position of a spring
  var Fspring = -k * (x - destX);

  // Damping, in kg / s
  var Fdamper = -b * v;

  // usually we put mass here, but for animation purposes, specifying mass is a
  // bit redundant. you could simply adjust k and b accordingly
  // let a = (Fspring + Fdamper) / mass;
  var a = Fspring + Fdamper;

  var newV = v + a * secondPerFrame;
  var newX = x + newV * secondPerFrame;

  if (Math.abs(newV) < precision && Math.abs(newX - destX) < precision) {
    reusedTuple[0] = destX;
    reusedTuple[1] = 0;
    return reusedTuple;
  }

  reusedTuple[0] = newX;
  reusedTuple[1] = newV;
  return reusedTuple;
}

module.exports = exports["default"];
// array reference around.
},{}],35:[function(require,module,exports){

// turn {x: {val: 1, stiffness: 1, damping: 2}, y: 2} generated by
// `{x: spring(1, {stiffness: 1, damping: 2}), y: 2}` into {x: 1, y: 2}

'use strict';

exports.__esModule = true;
exports['default'] = stripStyle;

function stripStyle(style) {
  var ret = {};
  for (var key in style) {
    if (!style.hasOwnProperty(key)) {
      continue;
    }
    ret[key] = typeof style[key] === 'number' ? style[key] : style[key].val;
  }
  return ret;
}

module.exports = exports['default'];
},{}],36:[function(require,module,exports){
(function (global){
/*eslint-disable react/prop-types */
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _reactPropTypesLibMountable = require('react-prop-types/lib/mountable');

var _reactPropTypesLibMountable2 = _interopRequireDefault(_reactPropTypesLibMountable);

var _reactPropTypesLibElementType = require('react-prop-types/lib/elementType');

var _reactPropTypesLibElementType2 = _interopRequireDefault(_reactPropTypesLibElementType);

var _Portal = require('./Portal');

var _Portal2 = _interopRequireDefault(_Portal);

var _ModalManager = require('./ModalManager');

var _ModalManager2 = _interopRequireDefault(_ModalManager);

var _utilsOwnerDocument = require('./utils/ownerDocument');

var _utilsOwnerDocument2 = _interopRequireDefault(_utilsOwnerDocument);

var _utilsAddEventListener = require('./utils/addEventListener');

var _utilsAddEventListener2 = _interopRequireDefault(_utilsAddEventListener);

var _utilsAddFocusListener = require('./utils/addFocusListener');

var _utilsAddFocusListener2 = _interopRequireDefault(_utilsAddFocusListener);

var _domHelpersUtilInDOM = require('dom-helpers/util/inDOM');

var _domHelpersUtilInDOM2 = _interopRequireDefault(_domHelpersUtilInDOM);

var _domHelpersActiveElement = require('dom-helpers/activeElement');

var _domHelpersActiveElement2 = _interopRequireDefault(_domHelpersActiveElement);

var _domHelpersQueryContains = require('dom-helpers/query/contains');

var _domHelpersQueryContains2 = _interopRequireDefault(_domHelpersQueryContains);

var _utilsGetContainer = require('./utils/getContainer');

var _utilsGetContainer2 = _interopRequireDefault(_utilsGetContainer);

var modalManager = new _ModalManager2['default']();

/**
 * Love them or hate them, `<Modal/>` provides a solid foundation for creating dialogs, lightboxes, or whatever else.
 * The Modal component renders its `children` node in front of a backdrop component.
 *
 * The Modal offers a few helpful features over using just a `<Portal/>` component and some styles:
 *
 * - Manages dialog stacking when one-at-a-time just isn't enough.
 * - Creates a backdrop, for disabling interaction below the modal.
 * - It properly manages focus; moving to the modal content, and keeping it there until the modal is closed.
 * - It disables scrolling of the page content while open.
 * - Adds the appropriate ARIA roles are automatically.
 * - Easily pluggable animations via a `<Transition/>` component.
 *
 * Note that, in the same way the backdrop element prevents users from clicking or interacting
 * with the page content underneath the Modal, Screen readers also need to be signaled to not to
 * interact with page content while the Modal is open. To do this, we use a common technique of applying
 * the `aria-hidden='true'` attribute to the non-Modal elements in the Modal `container`. This means that for
 * a Modal to be truly modal, it should have a `container` that is _outside_ your app's
 * React hierarchy (such as the default: document.body).
 */
var Modal = _react2['default'].createClass({
  displayName: 'Modal',

  propTypes: _extends({}, _Portal2['default'].propTypes, {

    /**
     * Set the visibility of the Modal
     */
    show: _react2['default'].PropTypes.bool,

    /**
     * A Node, Component instance, or function that returns either. The Modal is appended to it's container element.
     *
     * For the sake of assistive technologies, the container should usually be the document body, so that the rest of the
     * page content can be placed behind a virtual backdrop as well as a visual one.
     */
    container: _react2['default'].PropTypes.oneOfType([_reactPropTypesLibMountable2['default'], _react2['default'].PropTypes.func]),

    /**
     * A callback fired when the Modal is opening.
     */
    onShow: _react2['default'].PropTypes.func,

    /**
     * A callback fired when either the backdrop is clicked, or the escape key is pressed.
     *
     * The `onHide` callback only signals intent from the Modal,
     * you must actually set the `show` prop to `false` for the Modal to close.
     */
    onHide: _react2['default'].PropTypes.func,

    /**
     * Include a backdrop component.
     */
    backdrop: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.bool, _react2['default'].PropTypes.oneOf(['static'])]),

    /**
     * A callback fired when the escape key, if specified in `keyboard`, is pressed.
     */
    onEscapeKeyUp: _react2['default'].PropTypes.func,

    /**
     * A callback fired when the backdrop, if specified, is clicked.
     */
    onBackdropClick: _react2['default'].PropTypes.func,

    /**
     * A style object for the backdrop component.
     */
    backdropStyle: _react2['default'].PropTypes.object,

    /**
     * A css class or classes for the backdrop component.
     */
    backdropClassName: _react2['default'].PropTypes.string,

    /**
     * A css class or set of classes applied to the modal container when the modal is open,
     * and removed when it is closed.
     */
    containerClassName: _react2['default'].PropTypes.string,

    /**
     * Close the modal when escape key is pressed
     */
    keyboard: _react2['default'].PropTypes.bool,

    /**
     * A `<Transition/>` component to use for the dialog and backdrop components.
     */
    transition: _reactPropTypesLibElementType2['default'],

    /**
     * The `timeout` of the dialog transition if specified. This number is used to ensure that
     * transition callbacks are always fired, even if browser transition events are canceled.
     *
     * See the Transition `timeout` prop for more infomation.
     */
    dialogTransitionTimeout: _react2['default'].PropTypes.number,

    /**
     * The `timeout` of the backdrop transition if specified. This number is used to
     * ensure that transition callbacks are always fired, even if browser transition events are canceled.
     *
     * See the Transition `timeout` prop for more infomation.
     */
    backdropTransitionTimeout: _react2['default'].PropTypes.number,

    /**
     * When `true` The modal will automatically shift focus to itself when it opens, and
     * replace it to the last focused element when it closes. This also
     * works correctly with any Modal children that have the `autoFocus` prop.
     *
     * Generally this should never be set to `false` as it makes the Modal less
     * accessible to assistive technologies, like screen readers.
     */
    autoFocus: _react2['default'].PropTypes.bool,

    /**
     * When `true` The modal will prevent focus from leaving the Modal while open.
     *
     * Generally this should never be set to `false` as it makes the Modal less
     * accessible to assistive technologies, like screen readers.
     */
    enforceFocus: _react2['default'].PropTypes.bool,

    /**
     * Callback fired before the Modal transitions in
     */
    onEnter: _react2['default'].PropTypes.func,

    /**
     * Callback fired as the Modal begins to transition in
     */
    onEntering: _react2['default'].PropTypes.func,

    /**
     * Callback fired after the Modal finishes transitioning in
     */
    onEntered: _react2['default'].PropTypes.func,

    /**
     * Callback fired right before the Modal transitions out
     */
    onExit: _react2['default'].PropTypes.func,

    /**
     * Callback fired as the Modal begins to transition out
     */
    onExiting: _react2['default'].PropTypes.func,

    /**
     * Callback fired after the Modal finishes transitioning out
     */
    onExited: _react2['default'].PropTypes.func

  }),

  getDefaultProps: function getDefaultProps() {
    var noop = function noop() {};

    return {
      show: false,
      backdrop: true,
      keyboard: true,
      autoFocus: true,
      enforceFocus: true,
      onHide: noop
    };
  },

  getInitialState: function getInitialState() {
    return { exited: !this.props.show };
  },

  render: function render() {
    var _props = this.props;
    var children = _props.children;
    var Transition = _props.transition;
    var backdrop = _props.backdrop;
    var dialogTransitionTimeout = _props.dialogTransitionTimeout;

    var props = _objectWithoutProperties(_props, ['children', 'transition', 'backdrop', 'dialogTransitionTimeout']);

    var onExit = props.onExit;
    var onExiting = props.onExiting;
    var onEnter = props.onEnter;
    var onEntering = props.onEntering;
    var onEntered = props.onEntered;

    var show = !!props.show;
    var dialog = _react2['default'].Children.only(this.props.children);

    var mountModal = show || Transition && !this.state.exited;

    if (!mountModal) {
      return null;
    }

    var _dialog$props = dialog.props;
    var role = _dialog$props.role;
    var tabIndex = _dialog$props.tabIndex;

    if (role === undefined || tabIndex === undefined) {
      dialog = _react.cloneElement(dialog, {
        role: role === undefined ? 'document' : role,
        tabIndex: tabIndex == null ? '-1' : tabIndex
      });
    }

    if (Transition) {
      dialog = _react2['default'].createElement(
        Transition,
        {
          transitionAppear: true,
          unmountOnExit: true,
          'in': show,
          timeout: dialogTransitionTimeout,
          onExit: onExit,
          onExiting: onExiting,
          onExited: this.handleHidden,
          onEnter: onEnter,
          onEntering: onEntering,
          onEntered: onEntered
        },
        dialog
      );
    }

    return _react2['default'].createElement(
      _Portal2['default'],
      {
        ref: this.setMountNode,
        container: props.container
      },
      _react2['default'].createElement(
        'div',
        {
          ref: 'modal',
          role: props.role || 'dialog',
          style: props.style,
          className: props.className
        },
        backdrop && this.renderBackdrop(),
        dialog
      )
    );
  },

  renderBackdrop: function renderBackdrop() {
    var _props2 = this.props;
    var Transition = _props2.transition;
    var backdropTransitionTimeout = _props2.backdropTransitionTimeout;

    var backdrop = _react2['default'].createElement('div', { ref: 'backdrop',
      style: this.props.backdropStyle,
      className: this.props.backdropClassName,
      onClick: this.handleBackdropClick
    });

    if (Transition) {
      backdrop = _react2['default'].createElement(
        Transition,
        { transitionAppear: true,
          'in': this.props.show,
          timeout: backdropTransitionTimeout
        },
        backdrop
      );
    }

    return backdrop;
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (nextProps.show) {
      this.setState({ exited: false });
    } else if (!nextProps.transition) {
      // Otherwise let handleHidden take care of marking exited.
      this.setState({ exited: true });
    }
  },

  componentWillUpdate: function componentWillUpdate(nextProps) {
    if (nextProps.show) {
      this.checkForFocus();
    }
  },

  componentDidMount: function componentDidMount() {
    if (this.props.show) {
      this.onShow();
    }
  },

  componentDidUpdate: function componentDidUpdate(prevProps) {
    var transition = this.props.transition;

    if (prevProps.show && !this.props.show && !transition) {
      // Otherwise handleHidden will call this.
      this.onHide();
    } else if (!prevProps.show && this.props.show) {
      this.onShow();
    }
  },

  componentWillUnmount: function componentWillUnmount() {
    var _props3 = this.props;
    var show = _props3.show;
    var transition = _props3.transition;

    if (show || transition && !this.state.exited) {
      this.onHide();
    }
  },

  onShow: function onShow() {
    var doc = _utilsOwnerDocument2['default'](this);
    var container = _utilsGetContainer2['default'](this.props.container, doc.body);

    modalManager.add(this, container, this.props.containerClassName);

    this._onDocumentKeyupListener = _utilsAddEventListener2['default'](doc, 'keyup', this.handleDocumentKeyUp);

    this._onFocusinListener = _utilsAddFocusListener2['default'](this.enforceFocus);

    this.focus();

    if (this.props.onShow) {
      this.props.onShow();
    }
  },

  onHide: function onHide() {
    modalManager.remove(this);

    this._onDocumentKeyupListener.remove();

    this._onFocusinListener.remove();

    this.restoreLastFocus();
  },

  setMountNode: function setMountNode(ref) {
    this.mountNode = ref ? ref.getMountNode() : ref;
  },

  handleHidden: function handleHidden() {
    this.setState({ exited: true });
    this.onHide();

    if (this.props.onExited) {
      var _props4;

      (_props4 = this.props).onExited.apply(_props4, arguments);
    }
  },

  handleBackdropClick: function handleBackdropClick(e) {
    if (e.target !== e.currentTarget) {
      return;
    }

    if (this.props.onBackdropClick) {
      this.props.onBackdropClick(e);
    }

    if (this.props.backdrop === true) {
      this.props.onHide();
    }
  },

  handleDocumentKeyUp: function handleDocumentKeyUp(e) {
    if (this.props.keyboard && e.keyCode === 27 && this.isTopModal()) {
      if (this.props.onEscapeKeyUp) {
        this.props.onEscapeKeyUp(e);
      }
      this.props.onHide();
    }
  },

  checkForFocus: function checkForFocus() {
    if (_domHelpersUtilInDOM2['default']) {
      this.lastFocus = _domHelpersActiveElement2['default']();
    }
  },

  focus: function focus() {
    var autoFocus = this.props.autoFocus;
    var modalContent = this.getDialogElement();
    var current = _domHelpersActiveElement2['default'](_utilsOwnerDocument2['default'](this));
    var focusInModal = current && _domHelpersQueryContains2['default'](modalContent, current);

    if (modalContent && autoFocus && !focusInModal) {
      this.lastFocus = current;

      if (!modalContent.hasAttribute('tabIndex')) {
        modalContent.setAttribute('tabIndex', -1);
        _warning2['default'](false, 'The modal content node does not accept focus. ' + 'For the benefit of assistive technologies, the tabIndex of the node is being set to "-1".');
      }

      modalContent.focus();
    }
  },

  restoreLastFocus: function restoreLastFocus() {
    // Support: <=IE11 doesn't support `focus()` on svg elements (RB: #917)
    if (this.lastFocus && this.lastFocus.focus) {
      this.lastFocus.focus();
      this.lastFocus = null;
    }
  },

  enforceFocus: function enforceFocus() {
    var enforceFocus = this.props.enforceFocus;

    if (!enforceFocus || !this.isMounted() || !this.isTopModal()) {
      return;
    }

    var active = _domHelpersActiveElement2['default'](_utilsOwnerDocument2['default'](this));
    var modal = this.getDialogElement();

    if (modal && modal !== active && !_domHelpersQueryContains2['default'](modal, active)) {
      modal.focus();
    }
  },

  //instead of a ref, which might conflict with one the parent applied.
  getDialogElement: function getDialogElement() {
    var node = this.refs.modal;
    return node && node.lastChild;
  },

  isTopModal: function isTopModal() {
    return modalManager.isTopModal(this);
  }

});

Modal.manager = modalManager;

exports['default'] = Modal;
module.exports = exports['default'];
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./ModalManager":37,"./Portal":38,"./utils/addEventListener":39,"./utils/addFocusListener":40,"./utils/getContainer":41,"./utils/ownerDocument":44,"dom-helpers/activeElement":1,"dom-helpers/query/contains":9,"dom-helpers/util/inDOM":19,"react-prop-types/lib/elementType":46,"react-prop-types/lib/mountable":47,"warning":49}],37:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _domHelpersStyle = require('dom-helpers/style');

var _domHelpersStyle2 = _interopRequireDefault(_domHelpersStyle);

var _domHelpersClass = require('dom-helpers/class');

var _domHelpersClass2 = _interopRequireDefault(_domHelpersClass);

var _domHelpersUtilScrollbarSize = require('dom-helpers/util/scrollbarSize');

var _domHelpersUtilScrollbarSize2 = _interopRequireDefault(_domHelpersUtilScrollbarSize);

var _utilsIsOverflowing = require('./utils/isOverflowing');

var _utilsIsOverflowing2 = _interopRequireDefault(_utilsIsOverflowing);

var _utilsManageAriaHidden = require('./utils/manageAriaHidden');

function findIndexOf(arr, cb) {
  var idx = -1;
  arr.some(function (d, i) {
    if (cb(d, i)) {
      idx = i;
      return true;
    }
  });
  return idx;
}

function findContainer(data, modal) {
  return findIndexOf(data, function (d) {
    return d.modals.indexOf(modal) !== -1;
  });
}

/**
 * Proper state managment for containers and the modals in those containers.
 *
 * @internal Used by the Modal to ensure proper styling of containers.
 */

var ModalManager = (function () {
  function ModalManager() {
    var hideSiblingNodes = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

    _classCallCheck(this, ModalManager);

    this.hideSiblingNodes = hideSiblingNodes;
    this.modals = [];
    this.containers = [];
    this.data = [];
  }

  ModalManager.prototype.add = function add(modal, container, className) {
    var modalIdx = this.modals.indexOf(modal);
    var containerIdx = this.containers.indexOf(container);

    if (modalIdx !== -1) {
      return modalIdx;
    }

    modalIdx = this.modals.length;
    this.modals.push(modal);

    if (this.hideSiblingNodes) {
      _utilsManageAriaHidden.hideSiblings(container, modal.mountNode);
    }

    if (containerIdx !== -1) {
      this.data[containerIdx].modals.push(modal);
      return modalIdx;
    }

    var data = {
      modals: [modal],
      //right now only the first modal of a container will have its classes applied
      classes: className ? className.split(/\s+/) : [],
      //we are only interested in the actual `style` here becasue we will override it
      style: {
        overflow: container.style.overflow,
        paddingRight: container.style.paddingRight
      }
    };

    var style = { overflow: 'hidden' };

    data.overflowing = _utilsIsOverflowing2['default'](container);

    if (data.overflowing) {
      // use computed style, here to get the real padding
      // to add our scrollbar width
      style.paddingRight = parseInt(_domHelpersStyle2['default'](container, 'paddingRight') || 0, 10) + _domHelpersUtilScrollbarSize2['default']() + 'px';
    }

    _domHelpersStyle2['default'](container, style);

    data.classes.forEach(_domHelpersClass2['default'].addClass.bind(null, container));

    this.containers.push(container);
    this.data.push(data);

    return modalIdx;
  };

  ModalManager.prototype.remove = function remove(modal) {
    var modalIdx = this.modals.indexOf(modal);

    if (modalIdx === -1) {
      return;
    }

    var containerIdx = findContainer(this.data, modal);
    var data = this.data[containerIdx];
    var container = this.containers[containerIdx];

    data.modals.splice(data.modals.indexOf(modal), 1);

    this.modals.splice(modalIdx, 1);

    // if that was the last modal in a container,
    // clean up the container stylinhg.
    if (data.modals.length === 0) {
      Object.keys(data.style).forEach(function (key) {
        return container.style[key] = data.style[key];
      });

      data.classes.forEach(_domHelpersClass2['default'].removeClass.bind(null, container));

      if (this.hideSiblingNodes) {
        _utilsManageAriaHidden.showSiblings(container, modal.mountNode);
      }
      this.containers.splice(containerIdx, 1);
      this.data.splice(containerIdx, 1);
    } else if (this.hideSiblingNodes) {
      //otherwise make sure the next top modal is visible to a SR
      _utilsManageAriaHidden.ariaHidden(false, data.modals[data.modals.length - 1].mountNode);
    }
  };

  ModalManager.prototype.isTopModal = function isTopModal(modal) {
    return !!this.modals.length && this.modals[this.modals.length - 1] === modal;
  };

  return ModalManager;
})();

exports['default'] = ModalManager;
module.exports = exports['default'];
},{"./utils/isOverflowing":42,"./utils/manageAriaHidden":43,"dom-helpers/class":4,"dom-helpers/style":12,"dom-helpers/util/scrollbarSize":20}],38:[function(require,module,exports){
(function (global){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _reactDom = (typeof window !== "undefined" ? window['ReactDOM'] : typeof global !== "undefined" ? global['ReactDOM'] : null);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactPropTypesLibMountable = require('react-prop-types/lib/mountable');

var _reactPropTypesLibMountable2 = _interopRequireDefault(_reactPropTypesLibMountable);

var _utilsOwnerDocument = require('./utils/ownerDocument');

var _utilsOwnerDocument2 = _interopRequireDefault(_utilsOwnerDocument);

var _utilsGetContainer = require('./utils/getContainer');

var _utilsGetContainer2 = _interopRequireDefault(_utilsGetContainer);

/**
 * The `<Portal/>` component renders its children into a new "subtree" outside of current component hierarchy.
 * You can think of it as a declarative `appendChild()`, or jQuery's `$.fn.appendTo()`.
 * The children of `<Portal/>` component will be appended to the `container` specified.
 */
var Portal = _react2['default'].createClass({

  displayName: 'Portal',

  propTypes: {
    /**
     * A Node, Component instance, or function that returns either. The `container` will have the Portal children
     * appended to it.
     */
    container: _react2['default'].PropTypes.oneOfType([_reactPropTypesLibMountable2['default'], _react2['default'].PropTypes.func])
  },

  componentDidMount: function componentDidMount() {
    this._renderOverlay();
  },

  componentDidUpdate: function componentDidUpdate() {
    this._renderOverlay();
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (this._overlayTarget && nextProps.container !== this.props.container) {
      this._portalContainerNode.removeChild(this._overlayTarget);
      this._portalContainerNode = _utilsGetContainer2['default'](nextProps.container, _utilsOwnerDocument2['default'](this).body);
      this._portalContainerNode.appendChild(this._overlayTarget);
    }
  },

  componentWillUnmount: function componentWillUnmount() {
    this._unrenderOverlay();
    this._unmountOverlayTarget();
  },

  _mountOverlayTarget: function _mountOverlayTarget() {
    if (!this._overlayTarget) {
      this._overlayTarget = document.createElement('div');
      this._portalContainerNode = _utilsGetContainer2['default'](this.props.container, _utilsOwnerDocument2['default'](this).body);
      this._portalContainerNode.appendChild(this._overlayTarget);
    }
  },

  _unmountOverlayTarget: function _unmountOverlayTarget() {
    if (this._overlayTarget) {
      this._portalContainerNode.removeChild(this._overlayTarget);
      this._overlayTarget = null;
    }
    this._portalContainerNode = null;
  },

  _renderOverlay: function _renderOverlay() {

    var overlay = !this.props.children ? null : _react2['default'].Children.only(this.props.children);

    // Save reference for future access.
    if (overlay !== null) {
      this._mountOverlayTarget();
      this._overlayInstance = _reactDom2['default'].unstable_renderSubtreeIntoContainer(this, overlay, this._overlayTarget);
    } else {
      // Unrender if the component is null for transitions to null
      this._unrenderOverlay();
      this._unmountOverlayTarget();
    }
  },

  _unrenderOverlay: function _unrenderOverlay() {
    if (this._overlayTarget) {
      _reactDom2['default'].unmountComponentAtNode(this._overlayTarget);
      this._overlayInstance = null;
    }
  },

  render: function render() {
    return null;
  },

  getMountNode: function getMountNode() {
    return this._overlayTarget;
  },

  getOverlayDOMNode: function getOverlayDOMNode() {
    if (!this.isMounted()) {
      throw new Error('getOverlayDOMNode(): A component must be mounted to have a DOM node.');
    }

    if (this._overlayInstance) {
      if (this._overlayInstance.getWrappedDOMNode) {
        return this._overlayInstance.getWrappedDOMNode();
      } else {
        return _reactDom2['default'].findDOMNode(this._overlayInstance);
      }
    }

    return null;
  }

});

exports['default'] = Portal;
module.exports = exports['default'];
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./utils/getContainer":41,"./utils/ownerDocument":44,"react-prop-types/lib/mountable":47}],39:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _domHelpersEventsOn = require('dom-helpers/events/on');

var _domHelpersEventsOn2 = _interopRequireDefault(_domHelpersEventsOn);

var _domHelpersEventsOff = require('dom-helpers/events/off');

var _domHelpersEventsOff2 = _interopRequireDefault(_domHelpersEventsOff);

exports['default'] = function (node, event, handler) {
  _domHelpersEventsOn2['default'](node, event, handler);
  return {
    remove: function remove() {
      _domHelpersEventsOff2['default'](node, event, handler);
    }
  };
};

module.exports = exports['default'];
},{"dom-helpers/events/off":6,"dom-helpers/events/on":7}],40:[function(require,module,exports){
/**
 * Firefox doesn't have a focusin event so using capture is easiest way to get bubbling
 * IE8 can't do addEventListener, but does have onfocusin, so we use that in ie8
 *
 * We only allow one Listener at a time to avoid stack overflows
 */
'use strict';

exports.__esModule = true;
exports['default'] = addFocusListener;

function addFocusListener(handler) {
  var useFocusin = !document.addEventListener;
  var remove = undefined;

  if (useFocusin) {
    document.attachEvent('onfocusin', handler);
    remove = function () {
      return document.detachEvent('onfocusin', handler);
    };
  } else {
    document.addEventListener('focus', handler, true);
    remove = function () {
      return document.removeEventListener('focus', handler, true);
    };
  }

  return { remove: remove };
}

module.exports = exports['default'];
},{}],41:[function(require,module,exports){
(function (global){
'use strict';

exports.__esModule = true;
exports['default'] = getContainer;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _reactDom = (typeof window !== "undefined" ? window['ReactDOM'] : typeof global !== "undefined" ? global['ReactDOM'] : null);

var _reactDom2 = _interopRequireDefault(_reactDom);

function getContainer(container, defaultContainer) {
  container = typeof container === 'function' ? container() : container;
  return _reactDom2['default'].findDOMNode(container) || defaultContainer;
}

module.exports = exports['default'];
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],42:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports['default'] = isOverflowing;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _domHelpersQueryIsWindow = require('dom-helpers/query/isWindow');

var _domHelpersQueryIsWindow2 = _interopRequireDefault(_domHelpersQueryIsWindow);

var _domHelpersOwnerDocument = require('dom-helpers/ownerDocument');

var _domHelpersOwnerDocument2 = _interopRequireDefault(_domHelpersOwnerDocument);

function isBody(node) {
  return node && node.tagName.toLowerCase() === 'body';
}

function bodyIsOverflowing(node) {
  var doc = _domHelpersOwnerDocument2['default'](node);
  var win = _domHelpersQueryIsWindow2['default'](doc);
  var fullWidth = win.innerWidth;

  // Support: ie8, no innerWidth
  if (!fullWidth) {
    var documentElementRect = doc.documentElement.getBoundingClientRect();
    fullWidth = documentElementRect.right - Math.abs(documentElementRect.left);
  }

  return doc.body.clientWidth < fullWidth;
}

function isOverflowing(container) {
  var win = _domHelpersQueryIsWindow2['default'](container);

  return win || isBody(container) ? bodyIsOverflowing(container) : container.scrollHeight > container.clientHeight;
}

module.exports = exports['default'];
},{"dom-helpers/ownerDocument":8,"dom-helpers/query/isWindow":10}],43:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.ariaHidden = ariaHidden;
exports.hideSiblings = hideSiblings;
exports.showSiblings = showSiblings;

var BLACKLIST = ['template', 'script', 'style'];

var isHidable = function isHidable(_ref) {
  var nodeType = _ref.nodeType;
  var tagName = _ref.tagName;
  return nodeType === 1 && BLACKLIST.indexOf(tagName.toLowerCase()) === -1;
};

var siblings = function siblings(container, mount, cb) {
  mount = [].concat(mount);

  [].forEach.call(container.children, function (node) {
    if (mount.indexOf(node) === -1 && isHidable(node)) {
      cb(node);
    }
  });
};

function ariaHidden(show, node) {
  if (!node) {
    return;
  }
  if (show) {
    node.setAttribute('aria-hidden', 'true');
  } else {
    node.removeAttribute('aria-hidden');
  }
}

function hideSiblings(container, mountNode) {
  siblings(container, mountNode, function (node) {
    return ariaHidden(true, node);
  });
}

function showSiblings(container, mountNode) {
  siblings(container, mountNode, function (node) {
    return ariaHidden(false, node);
  });
}
},{}],44:[function(require,module,exports){
(function (global){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _reactDom = (typeof window !== "undefined" ? window['ReactDOM'] : typeof global !== "undefined" ? global['ReactDOM'] : null);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _domHelpersOwnerDocument = require('dom-helpers/ownerDocument');

var _domHelpersOwnerDocument2 = _interopRequireDefault(_domHelpersOwnerDocument);

exports['default'] = function (componentOrElement) {
  return _domHelpersOwnerDocument2['default'](_reactDom2['default'].findDOMNode(componentOrElement));
};

module.exports = exports['default'];
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"dom-helpers/ownerDocument":8}],45:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.errMsg = errMsg;
exports.createChainableTypeChecker = createChainableTypeChecker;

function errMsg(props, propName, componentName, msgContinuation) {
  return 'Invalid prop \'' + propName + '\' of value \'' + props[propName] + '\'' + (' supplied to \'' + componentName + '\'' + msgContinuation);
}

/**
 * Create chain-able isRequired validator
 *
 * Largely copied directly from:
 *  https://github.com/facebook/react/blob/0.11-stable/src/core/ReactPropTypes.js#L94
 */

function createChainableTypeChecker(validate) {
  function checkType(isRequired, props, propName, componentName) {
    componentName = componentName || '<<anonymous>>';
    if (props[propName] == null) {
      if (isRequired) {
        return new Error('Required prop \'' + propName + '\' was not specified in \'' + componentName + '\'.');
      }
    } else {
      return validate(props, propName, componentName);
    }
  }

  var chainedCheckType = checkType.bind(null, false);
  chainedCheckType.isRequired = checkType.bind(null, true);

  return chainedCheckType;
}
},{}],46:[function(require,module,exports){
(function (global){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _common = require('./common');

/**
 * Checks whether a prop provides a type of element.
 *
 * The type of element can be provided in two forms:
 * - tag name (string)
 * - a return value of React.createClass(...)
 *
 * @param props
 * @param propName
 * @param componentName
 * @returns {Error|undefined}
 */

function validate(props, propName, componentName) {
  var errBeginning = _common.errMsg(props, propName, componentName, '. Expected an Element `type`');

  if (typeof props[propName] !== 'function') {
    if (_react2['default'].isValidElement(props[propName])) {
      return new Error(errBeginning + ', not an actual Element');
    }

    if (typeof props[propName] !== 'string') {
      return new Error(errBeginning + ' such as a tag name or return value of React.createClass(...)');
    }
  }
}

exports['default'] = _common.createChainableTypeChecker(validate);
module.exports = exports['default'];
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./common":45}],47:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _common = require('./common');

/**
 * Checks whether a prop provides a DOM element
 *
 * The element can be provided in two forms:
 * - Directly passed
 * - Or passed an object that has a `render` method
 *
 * @param props
 * @param propName
 * @param componentName
 * @returns {Error|undefined}
 */

function validate(props, propName, componentName) {
  if (typeof props[propName] !== 'object' || typeof props[propName].render !== 'function' && props[propName].nodeType !== 1) {
    return new Error(_common.errMsg(props, propName, componentName, ', expected a DOM element or an object that has a `render` method'));
  }
}

exports['default'] = _common.createChainableTypeChecker(validate);
module.exports = exports['default'];
},{"./common":45}],48:[function(require,module,exports){
(function (global){
/*!
 * 
 *  React Simpletabs - Just a simple tabs component built with React
 *  @version v0.7.0
 *  @link https://github.com/pedronauck/react-simpletabs
 *  @license MIT
 *  @author Pedro Nauck (https://github.com/pedronauck)
 * 
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory((typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else if(typeof exports === 'object')
		exports["ReactSimpleTabs"] = factory((typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null));
	else
		root["ReactSimpleTabs"] = factory(root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */'use strict';

	var React = __webpack_require__(1);
	var classNames = __webpack_require__(2);

	if (true) {
	  __webpack_require__(3);
	}

	var Tabs = React.createClass({
	  displayName: 'Tabs',
	  propTypes: {
	    className: React.PropTypes.oneOfType([
	      React.PropTypes.array,
	      React.PropTypes.string,
	      React.PropTypes.object
	    ]),
	    tabActive: React.PropTypes.number,
	    onMount: React.PropTypes.func,
	    onBeforeChange: React.PropTypes.func,
	    onAfterChange: React.PropTypes.func,
	    children: React.PropTypes.oneOfType([
	      React.PropTypes.array,
	      React.PropTypes.element
	    ]).isRequired
	  },
	  getDefaultProps:function () {
	    return { tabActive: 1 };
	  },
	  getInitialState:function () {
	    return {
	      tabActive: this.props.tabActive
	    };
	  },
	  componentDidMount:function() {
	    var index = this.state.tabActive;
	    var $selectedPanel = this.refs['tab-panel'];
	    var $selectedMenu = this.refs[("tab-menu-" + index)];

	    if (this.props.onMount) {
	      this.props.onMount(index, $selectedPanel, $selectedMenu);
	    }
	  },
	  componentWillReceiveProps: function(newProps){
	    if(newProps.tabActive && newProps.tabActive !== this.props.tabActive){
	      this.setState({tabActive: newProps.tabActive});
	    }
	  },
	  render:function () {
	    var className = classNames('tabs', this.props.className);
	    return (
	      React.createElement("div", {className: className}, 
	        this._getMenuItems(), 
	        this._getSelectedPanel()
	      )
	    );
	  },
	  setActive:function(index, e) {
	    e.preventDefault();

	    var onAfterChange = this.props.onAfterChange;
	    var onBeforeChange = this.props.onBeforeChange;
	    var $selectedPanel = this.refs['tab-panel'];
	    var $selectedTabMenu = this.refs[("tab-menu-" + index)];

	    if (onBeforeChange) {
	      var cancel = onBeforeChange(index, $selectedPanel, $selectedTabMenu);
	      if(cancel === false){ return }
	    }

	    this.setState({ tabActive: index }, function()  {
	      if (onAfterChange) {
	        onAfterChange(index, $selectedPanel, $selectedTabMenu);
	      }
	    });
	  },
	  _getMenuItems:function () {
	    if (!this.props.children) {
	      throw new Error('Tabs must contain at least one Tabs.Panel');
	    }

	    if (!Array.isArray(this.props.children)) {
	      this.props.children = [this.props.children];
	    }

	    var $menuItems = this.props.children
	      .map(function($panel)  {return typeof $panel === 'function' ? $panel() : $panel;})
	      .filter(function($panel)  {return $panel;})
	      .map(function($panel, index)  {
	        var ref = ("tab-menu-" + (index + 1));
	        var title = $panel.props.title;
	        var classes = classNames(
	          'tabs-menu-item',
	          this.state.tabActive === (index + 1) && 'is-active'
	        );

	        return (
	          React.createElement("li", {ref: ref, key: index, className: classes}, 
	            React.createElement("a", {onClick: this.setActive.bind(this, index + 1)}, 
	              title
	            )
	          )
	        );
	      }.bind(this));

	    return (
	      React.createElement("nav", {className: "tabs-navigation"}, 
	        React.createElement("ul", {className: "tabs-menu"}, $menuItems)
	      )
	    );
	  },
	  _getSelectedPanel:function () {
	    var index = this.state.tabActive - 1;
	    var $panel = this.props.children[index];

	    return (
	      React.createElement("article", {ref: "tab-panel", className: "tab-panel"}, 
	        $panel
	      )
	    );
	  }
	});

	Tabs.Panel = React.createClass({
	  displayName: 'Panel',
	  propTypes: {
	    title: React.PropTypes.string.isRequired,
	    children: React.PropTypes.oneOfType([
	      React.PropTypes.array,
	      React.PropTypes.element
	    ]).isRequired
	  },
	  render:function () {
	    return React.createElement("div", null, this.props.children);
	  }
	});

	module.exports = Tabs;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */function classNames() {
		var classes = '';
		var arg;

		for (var i = 0; i < arguments.length; i++) {
			arg = arguments[i];
			if (!arg) {
				continue;
			}

			if ('string' === typeof arg || 'number' === typeof arg) {
				classes += ' ' + arg;
			} else if (Object.prototype.toString.call(arg) === '[object Array]') {
				classes += ' ' + classNames.apply(null, arg);
			} else if ('object' === typeof arg) {
				for (var key in arg) {
					if (!arg.hasOwnProperty(key) || !arg[key]) {
						continue;
					}
					classes += ' ' + key;
				}
			}
		}
		return classes.substr(1);
	}

	// safely export classNames in case the script is included directly on a page
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = classNames;
	}


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	// removed by extract-text-webpack-plugin

/***/ }
/******/ ])
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],49:[function(require,module,exports){
(function (process){
/**
 * Copyright 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = function() {};

if (process.env.NODE_ENV !== 'production') {
  warning = function(condition, format, args) {
    var len = arguments.length;
    args = new Array(len > 2 ? len - 2 : 0);
    for (var key = 2; key < len; key++) {
      args[key - 2] = arguments[key];
    }
    if (format === undefined) {
      throw new Error(
        '`warning(condition, format, ...args)` requires a warning ' +
        'message argument'
      );
    }

    if (format.length < 10 || (/^[s\W]*$/).test(format)) {
      throw new Error(
        'The warning format should be able to uniquely identify this ' +
        'warning. Please, use a more descriptive format than: ' + format
      );
    }

    if (!condition) {
      var argIndex = 0;
      var message = 'Warning: ' +
        format.replace(/%s/g, function() {
          return args[argIndex++];
        });
      if (typeof console !== 'undefined') {
        console.error(message);
      }
      try {
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(message);
      } catch(x) {}
    }
  };
}

module.exports = warning;

}).call(this,require('_process'))

},{"_process":22}],50:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var AlleleFiltersView = function AlleleFiltersView(_ref) {
  var species = _ref.species;
  var _ref$hiddenAlleles = _ref.hiddenAlleles;
  var hiddenAlleles = _ref$hiddenAlleles === undefined ? [] : _ref$hiddenAlleles;
  var _ref$disabledAlleles = _ref.disabledAlleles;
  var disabledAlleles = _ref$disabledAlleles === undefined ? [] : _ref$disabledAlleles;
  var onFilterChange = _ref.onFilterChange;

  var hiddenGenes = new Set(),
      geneInputs = [];

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = hiddenAlleles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var allele = _step.value;

      var _gene = BioLogica.Genetics.getGeneOfAllele(species, allele);
      if (_gene) hiddenGenes.add(_gene.name);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  for (var gene in species.geneList) {
    if (!hiddenGenes.has(gene)) {
      var alleles = species.geneList[gene].alleles,
          alleleItems = alleles.map(function (allele) {
        var name = species.alleleLabelMap[allele],
            checked = !(disabledAlleles.indexOf(allele) >= 0);
        return React.createElement(
          "label",
          { key: name },
          React.createElement("input", { type: "checkbox", key: name, value: allele,
            style: { "marginLeft": "8px" },
            defaultChecked: checked, onChange: handleChange }),
          name
        );
      });
      geneInputs.push(React.createElement(
        "div",
        { className: "gene-allele-list", key: gene },
        alleleItems
      ));
    }
  }

  function handleChange(evt) {
    var elt = evt.target,
        allele = elt && elt.value,
        isChecked = elt && elt.checked;
    if (onFilterChange && allele) onFilterChange(evt, allele, isChecked);
  }

  return React.createElement(
    "div",
    { className: "geniblocks allele-filters",
      style: { "marginTop": "5px", "marginBottom": "5px" } },
    geneInputs
  );
};

AlleleFiltersView.propTypes = {
  species: _react.PropTypes.object.isRequired,
  hiddenAlleles: _react.PropTypes.arrayOf(_react.PropTypes.string),
  disabledAlleles: _react.PropTypes.arrayOf(_react.PropTypes.string),
  onFilterChange: _react.PropTypes.func.isRequired
};

exports.default = AlleleFiltersView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],51:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var AlleleView = function AlleleView(_ref) {
  var allele = _ref.allele;
  var _ref$width = _ref.width;
  var width = _ref$width === undefined ? 21 : _ref$width;
  var target = _ref.target;
  var color = _ref.color;
  var shape = _ref.shape;
  var hovering = _ref.hovering;

  var radius = width / 2,
      stroke = target ? "#000000" : "none",
      fill = allele ? color : "white",
      strokeWidth = hovering ? 3 : 1,
      strokeDasharray = allele ? "0" : "1",
      svgShape = null;

  if (shape === "circle") {
    svgShape = React.createElement("circle", { r: radius, cy: radius + 1, cx: radius + 1, strokeWidth: strokeWidth, stroke: stroke, strokeDasharray: strokeDasharray, fill: fill });
  } else {
    svgShape = React.createElement("rect", { width: radius * 2, height: radius * 2, x: "1", y: "1", strokeWidth: strokeWidth, stroke: stroke, strokeDasharray: strokeDasharray, fill: fill });
  }

  return React.createElement(
    "svg",
    { width: width + 2, height: width + 2, xmlns: "http://www.w3.org/2000/svg" },
    React.createElement(
      "g",
      null,
      svgShape,
      React.createElement(
        "text",
        { x: radius + 1, y: radius + 7, textAnchor: "middle", fill: "white" },
        allele
      )
    )
  );
};

AlleleView.propTypes = {
  allele: _react.PropTypes.string,
  width: _react.PropTypes.number,
  target: _react.PropTypes.bool,
  color: _react.PropTypes.string,
  shape: _react.PropTypes.string,
  hovering: _react.PropTypes.bool
};

exports.default = AlleleView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],52:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _reactMotion = require('react-motion');

var _gamete = require('./gamete');

var _gamete2 = _interopRequireDefault(_gamete);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/**
 * Stateless functional React component for displaying a Biologica gamete that animates
 *
 * @param {Object} gamete - Biologica gamete (map of chromosome names to chromosomes)
 * @param {number} id - the unique id of this gamete
 * @param {string[]} hiddenAlleles - individual alleles of genes for which all alleles should be hidden
 * @param {Object} [initialDisplay] - initial display parameters used to represent the gamete
 * @param {number} [initialDisplay.x] - initial location (left) of the gamete
 * @param {number} [initialDisplay.y] - initial location (top) of the gamete
 * @param {number} [initialDisplay.size=30] - initial size (width & height) of the gamete
 * @param {number} [initialDisplay.rotation=0] - initial rotation of the gamete
 * @param {number} [initialDisplay.opacity=1] - initial opacity of the gamete
 * @param {Object} display - final display parameters used to represent the gamete
 * @param {number} display.x - final location (left) of the gamete
 * @param {number} display.y - final location (top) of the gamete
 * @param {number} [display.size=30] - final size (width & height) of the gamete
 * @param {number} [display.rotation=0] - final rotation of the gamete
 * @param {number} [display.opacity=1] - final opacity of the gamete
 * @param {number} [animStiffness=100] - spring stiffness used to control animation speed
 * @param {boolean} [isSelected=false] - whether the gamete should have the 'selected' class applied
 * @param {boolean} [isDisabled=false] - whether the gamete should have the 'disabled' class applied
 * @param {function} [onClick(evt, id, rect)] - callback function to be called when the gamete is clicked
 * @param {function} [onRect()] - callback function to be called when the animation is at rest
 *
 * Note: As things stand currently, there is _no_ particular representation of the gamete defined
 * by this view. The client can style the representation of the gamete by styling the
 * '.geniblocks.gamete' class in CSS, e.g. by assigning a background-image.
 */
var AnimatedGameteView = function AnimatedGameteView(_ref) {
  var id = _ref.id;
  var initialDisplay = _ref.initialDisplay;
  var display = _ref.display;
  var _ref$animStiffness = _ref.animStiffness;
  var animStiffness = _ref$animStiffness === undefined ? 100 : _ref$animStiffness;
  var onRest = _ref.onRest;

  var others = _objectWithoutProperties(_ref, ['id', 'initialDisplay', 'display', 'animStiffness', 'onRest']);

  var group = id % 4,
      rotationForGroup = group * 90,
      initial = initialDisplay || display,
      initialSize = initial.size || 30,
      initialRotation = initial.rotation != null ? initial.rotation : rotationForGroup,
      initialOpacity = initial.opacity != null ? initial.opacity : 1.0,
      finalSize = display.size || 30,
      finalRotation = display.rotation != null ? display.rotation : rotationForGroup,
      finalOpacity = display.opacity != null ? display.opacity : 1.0,
      springConfig = { stiffness: animStiffness };
  return React.createElement(
    _reactMotion.Motion,
    { className: 'geniblocks animated-gamete',
      defaultStyle: {
        x: initial.x, y: initial.y, size: initialSize,
        rotation: initialRotation, opacity: initialOpacity
      },
      style: {
        x: (0, _reactMotion.spring)(display.x, springConfig),
        y: (0, _reactMotion.spring)(display.y, springConfig),
        size: (0, _reactMotion.spring)(finalSize, springConfig),
        rotation: (0, _reactMotion.spring)(finalRotation, springConfig),
        opacity: (0, _reactMotion.spring)(finalOpacity, springConfig)
      },
      onRest: onRest },
    function (interpolatedStyle) {
      return React.createElement(_gamete2.default, _extends({ id: id, display: interpolatedStyle }, others));
    }
  );
};

AnimatedGameteView.propTypes = {
  gamete: _react.PropTypes.object.isRequired,
  id: _react.PropTypes.number.isRequired,
  hiddenAlleles: _react.PropTypes.arrayOf(_react.PropTypes.string),
  initialDisplay: _react.PropTypes.shape({ // initial display properties
    x: _react.PropTypes.number.isRequired, // location (left) of gamete image
    y: _react.PropTypes.number.isRequired, // location (top) of gamete image
    size: _react.PropTypes.number, // size of gamete image (default: 30)
    rotation: _react.PropTypes.number, // rotation (deg) of gamete image (default: 0|90|180|270)
    opacity: _react.PropTypes.number // opacity of gamete image (default: 1.0)
  }),
  display: _react.PropTypes.shape({ // final display properties
    x: _react.PropTypes.number.isRequired, // location (left) of gamete image
    y: _react.PropTypes.number.isRequired, // location (top) of gamete image
    size: _react.PropTypes.number, // size of gamete image (default: 30)
    rotation: _react.PropTypes.number, // rotation (deg) of gamete image (default: 0|90|180|270)
    opacity: _react.PropTypes.number // opacity of gamete image (default: 1.0)
  }).isRequired,
  animStiffness: _react.PropTypes.number, // stiffness of spring for animation (default: 100)
  isSelected: _react.PropTypes.bool,
  isDisabled: _react.PropTypes.bool,
  onClick: _react.PropTypes.func,
  onRest: _react.PropTypes.func
};

exports.default = AnimatedGameteView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./gamete":62,"react-motion":30}],53:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _reactMotion = require('react-motion');

var _organism = require('./organism');

var _organism2 = _interopRequireDefault(_organism);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AnimatedOrganismView = function AnimatedOrganismView(_ref) {
  var org = _ref.org;
  var id = _ref.id;
  var _ref$width = _ref.width;
  var width = _ref$width === undefined ? 200 : _ref$width;
  var _ref$style = _ref.style;
  var style = _ref$style === undefined ? {} : _ref$style;
  var _ref$initialOpacity = _ref.initialOpacity;
  var initialOpacity = _ref$initialOpacity === undefined ? 1.0 : _ref$initialOpacity;
  var _ref$opacity = _ref.opacity;
  var opacity = _ref$opacity === undefined ? 1.0 : _ref$opacity;
  var _ref$stiffness = _ref.stiffness;
  var stiffness = _ref$stiffness === undefined ? 60 : _ref$stiffness;
  var onRest = _ref.onRest;
  var onClick = _ref.onClick;

  var opacityStart = initialOpacity !== undefined ? initialOpacity : opacity !== undefined ? opacity : 1.0;
  var opacityEnd = opacity !== undefined ? opacity : opacityStart;

  if (opacityEnd !== opacityStart) opacityEnd = (0, _reactMotion.spring)(opacityEnd, { stiffness: stiffness });

  return React.createElement(
    _reactMotion.Motion,
    { className: 'geniblocks animated-organism-view',
      defaultStyle: { opacity: opacityStart }, style: { opacity: opacityEnd }, onRest: onRest },
    function (interpolatedStyle) {
      var tStyle = _extends({}, style, interpolatedStyle);
      return React.createElement(_organism2.default, { org: org, id: id, width: width, style: tStyle, onClick: onClick });
    }
  );
};

AnimatedOrganismView.propTypes = {
  org: _react.PropTypes.object.isRequired,
  id: _react.PropTypes.string,
  width: _react.PropTypes.number,
  style: _react.PropTypes.object,
  initialOpacity: _react.PropTypes.number,
  opacity: _react.PropTypes.number,
  stiffness: _react.PropTypes.number,
  onRest: _react.PropTypes.func,
  onClick: _react.PropTypes.func
};

exports.default = AnimatedOrganismView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./organism":69,"react-motion":30}],54:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * This component is a very thin wrapper around a standard button designed to prevent
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * extraneous focus highlighting added by browsers when clicking on a button while
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * maintaining keyboard accessibility. See 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * https://www.paciellogroup.com/blog/2012/04/how-to-remove-css-outlines-in-an-accessible-manner/
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * for details. The upshot is that we use mouse events on the button to disable the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * focus highlight -- mousing/clicking on a push button should not be used as an
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * incidator that the user would like to keyboard-interact with that button, which
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * is what focusing a clicked button implies.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * IMPORTANT: To maintain accessibility, there must be code somewhere to reenable
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * the focus highlight when appropriate. This can be done for 'keydown' by calling
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Button.enableButtonFocusHighlightOnKeyDown() during application/page initialization,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * or by adding your own event handler that calls Button.enableButtonFocusHighlight().
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var Button = function (_React$Component) {
  _inherits(Button, _React$Component);

  function Button() {
    var _Object$getPrototypeO;

    var _temp, _this, _ret;

    _classCallCheck(this, Button);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(Button)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.suppressButtonFocusHighlight = function () {
      var noFocusHighlight = 'no-focus-highlight',
          button = _this.refs.button;
      if (button && button.className.indexOf(noFocusHighlight) < 0) button.className += ' ' + noFocusHighlight;
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Button, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var className = _props.className;
      var label = _props.label;
      var others = _objectWithoutProperties(_props, ['className', 'label']);
      var classes = (className ? className + ' ' : '') + 'gb-button';

      var handleMouseEvent = function () {
        this.suppressButtonFocusHighlight();
      }.bind(this);

      return React.createElement(
        'button',
        _extends({ className: classes, ref: 'button' }, others, {
          onMouseEnter: handleMouseEvent,
          onMouseDown: handleMouseEvent }),
        label
      );
    }
  }], [{
    key: 'enableButtonFocusHighlightOnKeyDown',


    // Installs a keydown handler on the document which will enable button focus highlighting.
    // Should be called once during application initialization.
    value: function enableButtonFocusHighlightOnKeyDown() {
      document.addEventListener('keydown', function () {
        return Button.enableButtonFocusHighlight();
      });
    }

    // Enables button focus highlighting; designed to be called from the keydown handler above
    // but available separately for implementations that require it.

  }, {
    key: 'enableButtonFocusHighlight',
    value: function enableButtonFocusHighlight() {
      var buttons = document.querySelectorAll('.gb-button'),
          count = buttons.length;
      // cf. https://developer.mozilla.org/en-US/docs/Web/API/NodeList#Example
      for (var i = 0; i < count; ++i) {
        var button = buttons[i];
        if (button && button.className) {
          // cf. http://stackoverflow.com/questions/195951/change-an-elements-class-with-javascript
          button.className = button.className.replace(/(?:^|\s)no-focus-highlight(?!\S)/g, '');
        }
      }
    }

    // prevent extraneous focus highlight on click while maintaining keyboard accessibility
    // see https://www.paciellogroup.com/blog/2012/04/how-to-remove-css-outlines-in-an-accessible-manner/

  }]);

  return Button;
}(React.Component);

Button.propTypes = {
  className: _react.PropTypes.string,
  label: _react.PropTypes.string.isRequired
};
exports.default = Button;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],55:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

/**
 * Stateless functional React component for displaying male/female change buttons
 * The appearance of the buttons is currently entirely controlled via external CSS.
 * @param {string} sex - ['male' | 'female'] currently selected button
 * @param {function} onChange(evt, sex) - callback to be called when use clicks to change sex
 */
var ChangeSexButtons = function ChangeSexButtons(_ref) {
  var id = _ref.id;
  var sex = _ref.sex;
  var species = _ref.species;
  var showLabel = _ref.showLabel;
  var _ref$style = _ref.style;
  var style = _ref$style === undefined ? {} : _ref$style;
  var onChange = _ref.onChange;

  var capSex = sex.substr(0, 1).toUpperCase() + sex.substr(1),
      selectedSexClass = sex === 'male' ? 'male-selected' : 'female-selected',
      BUTTON_IMAGE_WIDTH = 100,
      BUTTON_IMAGE_MIDPOINT_X = BUTTON_IMAGE_WIDTH / 2,
      imageStyle = _extends({ position: 'absolute' }, style),
      label = showLabel ? capSex + ' ' + species : '',
      labelElement = showLabel ? React.createElement(
    'div',
    { style: { position: 'absolute',
        fontSize: '14pt',
        fontWeight: 'bold',
        color: 'white',
        left: BUTTON_IMAGE_WIDTH,
        whiteSpace: 'nowrap',
        marginLeft: 10 } },
    label
  ) : '';

  function handleClick(evt) {
    var eltRect = evt.target.getBoundingClientRect(),
        clickX = evt.clientX - eltRect.left;
    if (sex === 'male' !== clickX > BUTTON_IMAGE_MIDPOINT_X) onChange(sex === 'male' ? 'female' : 'male');
  }

  return React.createElement(
    'div',
    { id: id, style: { position: 'relative' } },
    React.createElement('div', { className: 'geniblocks change-sex-buttons ' + selectedSexClass,
      style: imageStyle, onClick: handleClick }),
    labelElement
  );
};

ChangeSexButtons.propTypes = {
  id: _react.PropTypes.string,
  sex: _react.PropTypes.oneOf(['male', 'female']).isRequired,
  species: _react.PropTypes.string,
  showLabel: _react.PropTypes.bool,
  style: _react.PropTypes.object,
  onChange: _react.PropTypes.func.isRequired
};

exports.default = ChangeSexButtons;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],56:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var ChromosomeImageView = function ChromosomeImageView(_ref) {
  var _ref$width = _ref.width;
  var width = _ref$width === undefined ? 23 : _ref$width;
  var _ref$height = _ref.height;
  var height = _ref$height === undefined ? 126 : _ref$height;
  var _ref$color = _ref.color;
  var color = _ref$color === undefined ? '#FF9999' : _ref$color;

  var split = 45,
      radius = width / 2,
      imageWidth = width + 4,
      halfImageWidth = imageWidth / 2,
      imageHeight = height + 4;

  return React.createElement(
    'svg',
    { width: imageWidth, height: imageHeight, xmlns: 'http://www.w3.org/2000/svg' },
    React.createElement(
      'g',
      null,
      React.createElement('circle', { r: radius, cy: radius + 2, cx: halfImageWidth, strokeWidth: '2', stroke: '#000000', fill: color }),
      React.createElement('circle', { r: radius, cy: split - radius, cx: halfImageWidth, strokeWidth: '2', stroke: '#000000', fill: color }),
      React.createElement('circle', { r: radius, cy: split + radius, cx: halfImageWidth, strokeWidth: '2', stroke: '#000000', fill: color }),
      React.createElement('circle', { r: radius, cy: height - radius, cx: halfImageWidth, strokeWidth: '2', stroke: '#000000', fill: color }),
      React.createElement('rect', { height: split - radius - (radius + 2), width: width, y: radius + 2, x: '2', strokeWidth: '0', stroke: '#000000', fill: color }),
      React.createElement('rect', { height: height - radius - (split + radius), width: width, y: split + radius, x: '2', strokeWidth: '0', stroke: '#000000', fill: color }),
      React.createElement('line', { y1: radius + 2, x1: '2', y2: split - radius + 2, x2: '2', strokeLinecap: 'null', strokeLinejoin: 'null', strokeWidth: '2', stroke: '#000000', fill: 'none' }),
      React.createElement('line', { y1: radius + 2, x1: width + 2, y2: split - radius + 2, x2: width + 2, strokeLinecap: 'null', strokeLinejoin: 'null', strokeWidth: '2', stroke: '#000000', fill: 'none' }),
      React.createElement('line', { y1: split + radius, x1: '2', y2: height - radius, x2: '2', strokeLinecap: 'null', strokeLinejoin: 'null', strokeWidth: '2', stroke: '#000000', fill: 'none' }),
      React.createElement('line', { y1: split + radius, x1: width + 2, y2: height - radius, x2: width + 2, strokeLinecap: 'null', strokeLinejoin: 'null', strokeWidth: '2', stroke: '#000000', fill: 'none' })
    )
  );
};

ChromosomeImageView.propTypes = {
  width: _react.PropTypes.number,
  height: _react.PropTypes.number,
  color: _react.PropTypes.string
};

exports.default = ChromosomeImageView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],57:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _chromosomeImage = require('./chromosome-image');

var _chromosomeImage2 = _interopRequireDefault(_chromosomeImage);

var _geneLabel = require('./gene-label');

var _geneLabel2 = _interopRequireDefault(_geneLabel);

var _geneticsUtils = require('../utilities/genetics-utils');

var _geneticsUtils2 = _interopRequireDefault(_geneticsUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ChromosomeView = function ChromosomeView(_ref) {
  var org = _ref.org;
  var chromosomeName = _ref.chromosomeName;
  var side = _ref.side;
  var _ref$hiddenAlleles = _ref.hiddenAlleles;
  var hiddenAlleles = _ref$hiddenAlleles === undefined ? [] : _ref$hiddenAlleles;
  var _ref$editable = _ref.editable;
  var editable = _ref$editable === undefined ? true : _ref$editable;
  var _onAlleleChange = _ref.onAlleleChange;
  var _ref$labelsOnRight = _ref.labelsOnRight;
  var labelsOnRight = _ref$labelsOnRight === undefined ? true : _ref$labelsOnRight;

  var alleles = org.getGenotype().chromosomes[chromosomeName][side].alleles,
      visibleAlleles = _geneticsUtils2.default.filterAlleles(alleles, hiddenAlleles, org.species),
      labels = visibleAlleles.map(function (a) {
    return React.createElement(_geneLabel2.default, { key: a, species: org.species, allele: a, editable: editable,
      onAlleleChange: function onAlleleChange(event) {
        _onAlleleChange(a, event.target.value);
      } });
  }),
      containerClass = "items";

  if (!labelsOnRight) {
    containerClass += " rtl";
  }

  return React.createElement(
    'div',
    { className: 'geniblocks chromosome-container' },
    React.createElement(
      'div',
      { className: containerClass },
      React.createElement(_chromosomeImage2.default, null),
      React.createElement(
        'div',
        { className: 'labels' },
        labels
      )
    )
  );
};

ChromosomeView.propTypes = {
  org: _react.PropTypes.object.isRequired,
  chromosomeName: _react.PropTypes.string.isRequired,
  side: _react.PropTypes.string.isRequired,
  hiddenAlleles: _react.PropTypes.array,
  editable: _react.PropTypes.bool,
  onAlleleChange: _react.PropTypes.func,
  labelsOnRight: _react.PropTypes.bool
};

exports.default = ChromosomeView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../utilities/genetics-utils":76,"./chromosome-image":56,"./gene-label":63}],58:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

/**
 * Uses an SVG circular gradient to implement a fading glow background.
 * Implemented as a stateless functional React component.
 *
 * @param {string} color - the color of the circular gradient "glow"
 * @param {number} size - the diameter of the circular gradient
 * @param {object} style - styles applied to the outer div
 */
var CircularGlowView = function CircularGlowView(_ref) {
  var id = _ref.id;
  var color = _ref.color;
  var size = _ref.size;
  var style = _ref.style;

  var radius = size / 2,
      colorNoHash = color.replace('#', ''),
      gradientID = 'CircularGlowView_' + (id || colorNoHash),
      gradientIDUrl = 'url(#' + gradientID + ')';

  return React.createElement(
    'div',
    { className: 'geniblocks circular-glow', style: style },
    React.createElement(
      'svg',
      { width: size + 2, height: size + 2, xmlns: 'http://www.w3.org/2000/svg' },
      React.createElement(
        'defs',
        null,
        React.createElement(
          'radialGradient',
          { id: gradientID },
          React.createElement('stop', { offset: '0%', stopColor: color, stopOpacity: '1.0' }),
          React.createElement('stop', { offset: '100%', stopColor: color, stopOpacity: '0.0' })
        )
      ),
      React.createElement('circle', { fill: gradientIDUrl, cx: radius, cy: radius, r: radius })
    )
  );
};

CircularGlowView.propTypes = {
  id: _react.PropTypes.string,
  color: _react.PropTypes.string.isRequired,
  size: _react.PropTypes.number.isRequired,
  style: _react.PropTypes.object
};

exports.default = CircularGlowView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],59:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

/**
 * Implements a rectangular text area for providing feedback to users, such as
 * that used in Geniverse's challenges for providing trial and goal feedback.
 * Implemented as a React stateless functional component.
 *
 * @param {string|string[]} text - a single or multiple lines of text to display
 * @param {object} style - inline styles applied to the <div> containing each line of text
 */
var FeedbackView = function FeedbackView(_ref) {
  var text = _ref.text;
  var _ref$style = _ref.style;
  var style = _ref$style === undefined ? {} : _ref$style;

  var tText = Array.isArray(text) ? text : [text],
      lineCount = tText.length,
      height = 20 * lineCount + 2,
      defaultStyle = _extends({ height: height }, style),
      textLines = tText.map(function (iText, index) {
    return React.createElement(
      "div",
      { className: "geniblocks feedback text-line", key: index },
      iText
    );
  });

  return React.createElement(
    "div",
    { className: "geniblocks feedback-view", style: defaultStyle },
    textLines
  );
};

FeedbackView.propTypes = {
  text: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.arrayOf(_react.PropTypes.string)]).isRequired,
  style: _react.PropTypes.object
};

exports.default = FeedbackView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],60:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GAMETE_TYPE = undefined;

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _animatedGamete = require('./animated-gamete');

var _animatedGamete2 = _interopRequireDefault(_animatedGamete);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var INITIAL_GAMETE_SIZE = 30,
    FINAL_GAMETE_SIZE = 140,
    RESTING_MOTHER_GAMETE_X = 0,
    RESTING_FATHER_GAMETE_X = 150,
    FERTILIZING_MOTHER_GAMETE_X = 70,
    FERTILIZING_FATHER_GAMETE_X = 80,
    FINAL_ZYGOTE_Y = -150;

var GAMETE_TYPE = exports.GAMETE_TYPE = { MOTHER: 'mother', FATHER: 'father' };

var FertilizingGameteView = function (_React$Component) {
  _inherits(FertilizingGameteView, _React$Component);

  function FertilizingGameteView(props) {
    _classCallCheck(this, FertilizingGameteView);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FertilizingGameteView).call(this, props));

    _this.render = function () {
      var _this$props = _this.props;
      var gamete = _this$props.gamete;
      var id = _this$props.id;
      var hiddenAlleles = _this$props.hiddenAlleles;
      var animStiffness = _this$props.animStiffness;
      var onRest = _this$props.onRest;
      var xOffset = _this.props.srcRect ? _this.props.srcRect.left - _this.props.dstRect.left : 0;
      var yOffset = _this.props.srcRect ? _this.props.srcRect.top - _this.props.dstRect.top : 0;
      var xResting = _this.props.type === GAMETE_TYPE.FATHER ? RESTING_FATHER_GAMETE_X : RESTING_MOTHER_GAMETE_X;
      var xFertilizing = _this.props.type === GAMETE_TYPE.FATHER ? FERTILIZING_FATHER_GAMETE_X : FERTILIZING_MOTHER_GAMETE_X;
      var initial = void 0;var tFinal = void 0;

      if (!gamete || id == null) return;

      if (_this.props.fertilizationState === 'none') {
        if (_this.props.type === GAMETE_TYPE.FATHER) xOffset += RESTING_FATHER_GAMETE_X;
        initial = { x: xOffset, y: yOffset, size: INITIAL_GAMETE_SIZE };
        tFinal = { x: xResting, y: 0, size: FINAL_GAMETE_SIZE };
      } else if (_this.props.fertilizationState === 'fertilizing') {
        initial = { x: xResting, y: 0, size: FINAL_GAMETE_SIZE, opacity: 1.0 };
        tFinal = { x: xFertilizing, y: 0, size: FINAL_GAMETE_SIZE, rotation: 0, opacity: 1.0 };
      } else {
        initial = { x: xFertilizing, y: 0, size: FINAL_GAMETE_SIZE, rotation: 0, opacity: 1.0 };
        tFinal = { x: xFertilizing, y: FINAL_ZYGOTE_Y, size: FINAL_GAMETE_SIZE, rotation: 0, opacity: 0.0 };
      }

      return React.createElement(_animatedGamete2.default, { gamete: gamete, id: id, hiddenAlleles: hiddenAlleles,
        initialDisplay: initial, display: tFinal,
        animStiffness: animStiffness, onRest: onRest });
    };

    return _this;
  }

  return FertilizingGameteView;
}(React.Component);

FertilizingGameteView.propTypes = {
  type: _react.PropTypes.oneOf([GAMETE_TYPE.MOTHER, GAMETE_TYPE.FATHER]).isRequired,
  gamete: _react.PropTypes.object.isRequired,
  id: _react.PropTypes.number.isRequired,
  fertilizationState: _react.PropTypes.oneOf(['none', 'fertilizing', 'fertilized', 'complete']).isRequired,
  hiddenAlleles: _react.PropTypes.arrayOf(_react.PropTypes.string),
  srcRect: _react.PropTypes.shape({
    left: _react.PropTypes.number.isRequired,
    top: _react.PropTypes.number.isRequired,
    width: _react.PropTypes.number.isRequired,
    height: _react.PropTypes.number.isRequired
  }),
  dstRect: _react.PropTypes.shape({
    left: _react.PropTypes.number.isRequired,
    top: _react.PropTypes.number.isRequired,
    width: _react.PropTypes.number.isRequired,
    height: _react.PropTypes.number.isRequired
  }),
  animStiffness: _react.PropTypes.number, // stiffness of spring for animation (default: 100)
  onRest: _react.PropTypes.func
};
FertilizingGameteView.defaultProps = {
  hiddenAlleles: [],
  animStiffness: 100
};
exports.default = FertilizingGameteView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./animated-gamete":52}],61:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _animatedGamete = require('./animated-gamete');

var _animatedGamete2 = _interopRequireDefault(_animatedGamete);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GametePoolView = function GametePoolView(_ref) {
  var gametes = _ref.gametes;
  var _ref$hiddenAlleles = _ref.hiddenAlleles;
  var hiddenAlleles = _ref$hiddenAlleles === undefined ? [] : _ref$hiddenAlleles;
  var _ref$width = _ref.width;
  var width = _ref$width === undefined ? 300 : _ref$width;
  var _ref$height = _ref.height;
  var height = _ref$height === undefined ? 200 : _ref$height;
  var _ref$animStiffness = _ref.animStiffness;
  var animStiffness = _ref$animStiffness === undefined ? 60 : _ref$animStiffness;
  var selectedId = _ref.selectedId;
  var isGameteDisabled = _ref.isGameteDisabled;
  var onGameteSelected = _ref.onGameteSelected;

  var gameteCount = gametes.length,
      gameteSize = 30,
      margin = 5,
      spacingDefault = gameteSize + 2 * margin,
      xSpacing = spacingDefault,
      ySpacing = spacingDefault,
      colDefault = Math.floor(width / spacingDefault),
      rowDefault = Math.floor(height / spacingDefault),
      enabledCount = 0,
      disabledCount = 0,
      disabledFlags = isGameteDisabled ? gametes.map(function (g) {
    return isGameteDisabled(g);
  }) : [],
      totalDisabledCount = disabledFlags.reduce(function (total, flag) {
    return total + flag;
  }, 0),

  // leave room for the disabled gamete row if there are disabled gametes
  availableHeight = height - (totalDisabledCount ? spacingDefault : 0) - 4 * margin,

  // pack the disabled gametes into the disabled row
  xDisabledSpacing = Math.min(xSpacing / 2, (width - 7 * margin) / totalDisabledCount),
      yDisabledSpacing = spacingDefault,
      totalEnabledCount = gameteCount - totalDisabledCount,
      gameteViews = void 0;

  // squeeze in to make room for additional gametes if necessary
  var colCount = colDefault,
      rowCount = rowDefault - (totalDisabledCount > 0);
  while (colCount * rowCount < totalEnabledCount) {
    if (ySpacing > xSpacing) {
      ySpacing = availableHeight / ++rowCount;
    } else {
      xSpacing = (width - 4 * margin) / ++colCount;
    }
  }

  gameteViews = gametes.map(function (gamete, index) {
    var isDisabled = disabledFlags[index],
        layoutIndex = isDisabled ? disabledCount++ : enabledCount++,
        row = isDisabled ? rowDefault - 1 : Math.floor(layoutIndex / colCount),
        col = isDisabled ? layoutIndex : layoutIndex % colCount,
        y = isDisabled ? row * yDisabledSpacing : row * ySpacing,
        x = isDisabled ? col * xDisabledSpacing : col * xSpacing;
    return React.createElement(_animatedGamete2.default, { gamete: gamete, id: index + 1, key: index,
      hiddenAlleles: hiddenAlleles,
      initialDisplay: { x: Math.round(width / 2), y: -Math.round(ySpacing) },
      display: { x: Math.round(x), y: Math.round(y) },
      animStiffness: animStiffness,
      isSelected: index + 1 === selectedId,
      isDisabled: isDisabled,
      onClick: onGameteSelected });
  });

  return React.createElement(
    'div',
    { className: 'geniblocks gamete-pool', style: { width: width, height: height } },
    gameteViews
  );
};

GametePoolView.propTypes = {
  gametes: _react.PropTypes.arrayOf(_react.PropTypes.object).isRequired,
  hiddenAlleles: _react.PropTypes.arrayOf(_react.PropTypes.string),
  width: _react.PropTypes.number,
  height: _react.PropTypes.number,
  animStiffness: _react.PropTypes.number,
  selectedId: _react.PropTypes.number,
  isGameteDisabled: _react.PropTypes.func,
  onGameteSelected: _react.PropTypes.func
};

exports.default = GametePoolView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./animated-gamete":52}],62:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Stateless functional React component for displaying a Biologica gamete
 *
 * @param {Object} gamete - Biologica gamete (map of chromosome names to chromosomes)
 * @param {number} id - the unique id of this gamete
 * @param {string[]} hiddenAlleles - individual alleles of genes for which all alleles should be hidden
 * @param {Object} display - display parameters used to represent the gamete
 * @param {number} display.x - location (left) of the gamete
 * @param {number} display.y - location (top) of the gamete
 * @param {number} [display.size=30] - size (width & height) of the gamete
 * @param {number} [display.rotation=0] - rotation of the gamete
 * @param {number} [display.opacity=1] - opacity of the gamete
 * @param {boolean} [isSelected=false] - whether the gamete should have the 'selected' class applied
 * @param {boolean} [isDisabled=false] - whether the gamete should have the 'disabled' class applied
 * @param {function} [onClick(evt, id, rect)] - callback function to be called when the gamete is clicked
 *
 * Note: As things stand currently, there is _no_ particular representation of the gamete defined
 * by this view. The client can style the representation of the gamete by styling the
 * '.geniblocks.gamete' class in CSS, e.g. by assigning a background-image.
 */
var GameteView = function GameteView(_ref) {
  var gamete = _ref.gamete;
  var id = _ref.id;
  var _ref$hiddenAlleles = _ref.hiddenAlleles;
  var hiddenAlleles = _ref$hiddenAlleles === undefined ? [] : _ref$hiddenAlleles;
  var display = _ref.display;
  var _ref$isSelected = _ref.isSelected;
  var isSelected = _ref$isSelected === undefined ? false : _ref$isSelected;
  var _ref$isDisabled = _ref.isDisabled;
  var isDisabled = _ref$isDisabled === undefined ? false : _ref$isDisabled;
  var onClick = _ref.onClick;


  function handleClick(evt) {
    var elt = evt.target,
        rect = elt.getBoundingClientRect();
    if (!isDisabled && onClick) {
      onClick(evt, id, rect);
    }
  }

  function buildTooltipForGamete(gamete) {
    var tooltip = "",
        allHiddenAlleles = void 0;
    // Note: it would be more efficient for the caller to pass in the
    // allHiddenAlleles array rather than computing it each time here.
    // But if we moved it out right now we'd have to eliminate the ES6 splat.
    function concatHiddenAlleles(iSpecies, iHiddenAlleles) {
      allHiddenAlleles = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = iHiddenAlleles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _allHiddenAlleles;

          var allele = _step.value;

          var gene = BioLogica.Genetics.getGeneOfAllele(iSpecies, allele);
          (_allHiddenAlleles = allHiddenAlleles).push.apply(_allHiddenAlleles, _toConsumableArray(gene.alleles));
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
    for (var ch in gamete) {
      var chromosome = gamete[ch];
      if (allHiddenAlleles == null) concatHiddenAlleles(chromosome.species, hiddenAlleles);
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = chromosome.alleles[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var allele = _step2.value;

          if (allHiddenAlleles.indexOf(allele) < 0) {
            var label = chromosome.species.alleleLabelMap[allele];
            tooltip += (tooltip ? '\n' : '') + ch + ': ' + label;
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      if (ch === 'XY') {
        var value = chromosome.side === 'y' ? 'y' : 'x';
        tooltip += (tooltip ? '\n' : '') + ch + ': ' + value;
      }
    }
    return tooltip;
  }

  var selectedClass = isSelected && !isDisabled ? "selected" : "",
      disabledClass = isDisabled ? "disabled" : "",
      group = id % 4,
      rotationForGroup = group * 90,
      classes = 'geniblocks gamete ' + selectedClass + ' ' + disabledClass + ' group' + group,
      size = display.size || 30,
      rotation = display.rotation != null ? display.rotation : rotationForGroup,
      transform = rotation ? 'rotate(' + rotation + 'deg)' : '',
      opacity = display.opacity != null ? display.opacity : 1.0,
      tooltip = buildTooltipForGamete(gamete);
  return React.createElement('div', { className: classes, title: tooltip,
    style: {
      left: display.x, top: display.y,
      width: size, height: size,
      transform: transform, opacity: opacity
    },
    onClick: handleClick });
};

GameteView.propTypes = {
  gamete: _react.PropTypes.object.isRequired,
  id: _react.PropTypes.number.isRequired,
  hiddenAlleles: _react.PropTypes.arrayOf(_react.PropTypes.string),
  display: _react.PropTypes.shape({ // display properties
    x: _react.PropTypes.number.isRequired, // location (left) of gamete image
    y: _react.PropTypes.number.isRequired, // location (top) of gamete image
    size: _react.PropTypes.number, // size of gamete image (default: 30)
    rotation: _react.PropTypes.number, // rotation (deg) of gamete image (default: 0|90|180|270)
    opacity: _react.PropTypes.number // opacity of gamete image (default: 1.0)
  }).isRequired,
  isSelected: _react.PropTypes.bool,
  isDisabled: _react.PropTypes.bool,
  onClick: _react.PropTypes.func
};

exports.default = GameteView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],63:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var GeneLabelView = function GeneLabelView(_ref) {
  var species = _ref.species;
  var allele = _ref.allele;
  var _ref$editable = _ref.editable;
  var editable = _ref$editable === undefined ? false : _ref$editable;
  var onAlleleChange = _ref.onAlleleChange;

  if (!editable) {
    var alleleName = species.alleleLabelMap[allele];
    return React.createElement(
      "div",
      { className: "geniblocks gene-label allele noneditable" },
      React.createElement(
        "span",
        null,
        alleleName
      )
    );
  } else {
    var _ret = function () {
      var alleles = BioLogica.Genetics.getGeneOfAllele(species, allele).alleles,
          alleleNames = alleles.map(function (a) {
        return species.alleleLabelMap[a];
      }),
          alleleOptions = alleleNames.map(function (name, i) {
        return React.createElement(
          "option",
          { key: name, value: alleles[i] },
          name
        );
      });
      return {
        v: React.createElement(
          "div",
          { className: "geniblocks gene-label allele editable" },
          React.createElement(
            "select",
            { value: allele, onChange: onAlleleChange },
            alleleOptions
          )
        )
      };
    }();

    if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
  }
};

GeneLabelView.propTypes = {
  species: _react.PropTypes.object.isRequired,
  allele: _react.PropTypes.string.isRequired,
  editable: _react.PropTypes.bool,
  onAlleleChange: _react.PropTypes.func
};

exports.default = GeneLabelView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],64:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _chromosomeImage = require('./chromosome-image');

var _chromosomeImage2 = _interopRequireDefault(_chromosomeImage);

var _geneticsUtils = require('../utilities/genetics-utils');

var _geneticsUtils2 = _interopRequireDefault(_geneticsUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TestPulldownView = function TestPulldownView(_ref) {
  var species = _ref.species;
  var gene = _ref.gene;
  var selection = _ref.selection;
  var onSelectionChange = _ref.onSelectionChange;

  var alleles = gene.alleles,
      alleleNames = alleles.map(function (a) {
    return species.alleleLabelMap[a];
  }),
      numAlleles = alleleNames.length,
      possibleCombos = [],
      currentSelection = selection || "placeholder",
      i = void 0,
      j = void 0;

  possibleCombos.push(React.createElement(
    'option',
    { key: 'placeholder', value: 'placeholder', disabled: 'disabled' },
    'Select a Genotype'
  ));

  for (i = 0; i < numAlleles; i++) {
    for (j = i; j < numAlleles; j++) {
      var key = i + " " + j,
          string = alleleNames[i] + " / " + alleleNames[j];
      possibleCombos.push(React.createElement(
        'option',
        { key: key, value: key },
        string
      ));
    }
  }

  return React.createElement(
    'div',
    { className: 'select-wrapper' },
    React.createElement(
      'select',
      { value: currentSelection, onChange: onSelectionChange },
      possibleCombos
    )
  );
};

var GenomeTestView = function GenomeTestView(_ref2) {
  var org = _ref2.org;
  var _ref2$hiddenAlleles = _ref2.hiddenAlleles;
  var hiddenAlleles = _ref2$hiddenAlleles === undefined ? [] : _ref2$hiddenAlleles;
  var _ref2$selection = _ref2.selection;
  var selection = _ref2$selection === undefined ? {} : _ref2$selection;
  var _onSelectionChange = _ref2.onSelectionChange;

  var pairWrappers = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = org.species.chromosomeNames[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var chromosomeName = _step.value;

      var chrom = org.genetics.genotype.chromosomes[chromosomeName],
          alleles = chrom[Object.keys(chrom)[0]].alleles,
          visibleAlleles = _geneticsUtils2.default.filterAlleles(alleles, hiddenAlleles, org.species),
          genes = visibleAlleles.map(function (a) {
        return BioLogica.Genetics.getGeneOfAllele(org.species, a);
      }),
          pulldowns = genes.map(function (g) {
        return React.createElement(TestPulldownView, {
          key: g.name,
          species: org.species,
          gene: g,
          selection: selection[g.name],
          onSelectionChange: function onSelectionChange(event) {
            _onSelectionChange(g, event.target.value);
          }
        });
      });

      pairWrappers.push(React.createElement(
        'div',
        { className: 'items', key: chromosomeName },
        React.createElement(_chromosomeImage2.default, null),
        React.createElement(_chromosomeImage2.default, null),
        React.createElement(
          'div',
          { className: 'genome-test-options' },
          pulldowns
        )
      ));
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return React.createElement(
    'div',
    { className: 'geniblocks genome-test' },
    pairWrappers
  );
};

TestPulldownView.propTypes = {
  species: _react.PropTypes.object.isRequired,
  gene: _react.PropTypes.object.isRequired,
  selection: _react.PropTypes.string,
  onSelectionChange: _react.PropTypes.func.isRequired
};

GenomeTestView.propTypes = {
  org: _react.PropTypes.object.isRequired,
  hiddenAlleles: _react.PropTypes.array,
  selection: _react.PropTypes.object,
  onSelectionChange: _react.PropTypes.func.isRequired
};

exports.default = GenomeTestView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../utilities/genetics-utils":76,"./chromosome-image":56}],65:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _chromosome = require('./chromosome');

var _chromosome2 = _interopRequireDefault(_chromosome);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GenomeView = function GenomeView(_ref) {
  var org = _ref.org;
  var _ref$hiddenAlleles = _ref.hiddenAlleles;
  var hiddenAlleles = _ref$hiddenAlleles === undefined ? [] : _ref$hiddenAlleles;
  var _ref$editable = _ref.editable;
  var editable = _ref$editable === undefined ? true : _ref$editable;
  var _onAlleleChange = _ref.onAlleleChange;

  var pairWrappers = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    var _loop = function _loop() {
      var chromosomeName = _step.value;

      var chrom = org.genetics.genotype.chromosomes[chromosomeName],
          pairs = [];

      var _loop2 = function _loop2(side) {
        pairs.push(React.createElement(_chromosome2.default, {
          org: org,
          key: pairs.length + 1,
          chromosomeName: chromosomeName,
          side: side,
          hiddenAlleles: hiddenAlleles,
          labelsOnRight: pairs.length > 0,
          editable: editable,
          onAlleleChange: function onAlleleChange(prevAllele, newAllele) {
            _onAlleleChange(chromosomeName, side, prevAllele, newAllele);
          } }));
      };

      for (var side in chrom) {
        _loop2(side);
      }
      pairWrappers.push(React.createElement(
        'div',
        { className: 'geniblocks chromosome-pair', key: pairWrappers.length + 1 },
        pairs
      ));
    };

    for (var _iterator = org.species.chromosomeNames[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      _loop();
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return React.createElement(
    'div',
    { className: 'geniblocks genome' },
    pairWrappers
  );
};

GenomeView.propTypes = {
  org: _react.PropTypes.object.isRequired,
  hiddenAlleles: _react.PropTypes.array,
  onAlleleChange: _react.PropTypes.func,
  editable: _react.PropTypes.bool
};

exports.default = GenomeView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./chromosome":57}],66:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _circularGlow = require('./circular-glow');

var _circularGlow2 = _interopRequireDefault(_circularGlow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var GlowBackgroundView = function GlowBackgroundView(_ref) {
  var id = _ref.id;
  var color = _ref.color;
  var size = _ref.size;
  var _ref$containerStyle = _ref.containerStyle;
  var containerStyle = _ref$containerStyle === undefined ? {} : _ref$containerStyle;
  var _ref$glowStyle = _ref.glowStyle;
  var glowStyle = _ref$glowStyle === undefined ? {} : _ref$glowStyle;
  var ChildComponent = _ref.ChildComponent;
  var _ref$childStyle = _ref.childStyle;
  var childStyle = _ref$childStyle === undefined ? {} : _ref$childStyle;

  var others = _objectWithoutProperties(_ref, ['id', 'color', 'size', 'containerStyle', 'glowStyle', 'ChildComponent', 'childStyle']);

  var tContainerStyle = _extends({ position: 'relative', width: size, height: size }, containerStyle),
      tGlowStyle = _extends({ position: 'absolute' }, glowStyle),
      tChildStyle = _extends({ position: 'absolute' }, childStyle);

  return React.createElement(
    'div',
    { className: 'geniblocks glow-background', style: tContainerStyle },
    React.createElement(_circularGlow2.default, { id: 'glow-' + id, color: color, size: size, style: tGlowStyle }),
    React.createElement(ChildComponent, _extends({ id: 'child-' + id, style: tChildStyle, width: size }, others))
  );
};

GlowBackgroundView.propTypes = {
  id: _react.PropTypes.string.isRequired,
  color: _react.PropTypes.string.isRequired,
  size: _react.PropTypes.number.isRequired,
  containerStyle: _react.PropTypes.object,
  glowStyle: _react.PropTypes.object,
  ChildComponent: _react.PropTypes.func.isRequired,
  childStyle: _react.PropTypes.object
};

exports.default = GlowBackgroundView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./circular-glow":58}],67:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /*
                                                                                                                                                                                                                                                                   * Based on ReactOverlays demo at http://react-bootstrap.github.io/react-overlays/examples/#modals
                                                                                                                                                                                                                                                                   */


var _Modal = require('react-overlays/lib/Modal');

var _Modal2 = _interopRequireDefault(_Modal);

var _button = require('./button');

var _button2 = _interopRequireDefault(_button);

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var modalStyle = {
  position: 'fixed',
  zIndex: 1040,
  top: 0, bottom: 0, left: 0, right: 0
};

var backdropStyle = _extends({}, modalStyle, {
  zIndex: 'auto',
  backgroundColor: '#000',
  opacity: 0.1
});

var dialogStyle = function dialogStyle() {
  // we use some psuedo random coords so nested modals
  // don't sit right on top of each other.
  var top = 50;
  var left = 50;

  return {
    position: 'absolute',
    width: 400,
    top: top + '%', left: left + '%',
    transform: 'translate(-' + top + '%, -' + left + '%)',
    border: '1px solid #e5e5e5',
    backgroundColor: 'white',
    boxShadow: '0 5px 15px rgba(0,0,0,.5)',
    padding: 20
  };
};

var ModalAlert = function (_React$Component) {
  _inherits(ModalAlert, _React$Component);

  function ModalAlert() {
    _classCallCheck(this, ModalAlert);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ModalAlert).apply(this, arguments));
  }

  _createClass(ModalAlert, [{
    key: 'render',
    value: function render() {
      /* eslint react/jsx-handler-names: 0 */
      var leftProps = this.props.leftButton || {},
          leftButton = leftProps ? React.createElement(_button2.default, { label: leftProps.label || "",
        onClick: leftProps.onClick }) : null,
          rightProps = this.props.rightButton || {},
          rightButton = React.createElement(_button2.default, { label: rightProps.label || "",
        onClick: rightProps.onClick });

      return React.createElement(
        _Modal2.default,
        { 'aria-labelledby': 'modal-label',
          style: modalStyle,
          backdropStyle: backdropStyle,
          show: this.props.show,
          onHide: this.props.onHide },
        React.createElement(
          'div',
          { style: dialogStyle() },
          React.createElement(
            'h4',
            { id: 'modal-label' },
            this.props.message
          ),
          React.createElement(
            'p',
            null,
            this.props.explanation
          ),
          leftButton,
          ' ',
          rightButton
        )
      );
    }
  }]);

  return ModalAlert;
}(React.Component);

ModalAlert.propTypes = {
  show: _react.PropTypes.bool,
  message: _react.PropTypes.string,
  explanation: _react.PropTypes.string,
  leftButton: _react.PropTypes.shape({
    label: _react.PropTypes.string,
    onClick: _react.PropTypes.func
  }),
  rightButton: _react.PropTypes.shape({
    label: _react.PropTypes.string,
    onClick: _react.PropTypes.func
  }),
  onHide: _react.PropTypes.func
};
ModalAlert.defaultProps = {
  show: false
};
exports.default = ModalAlert;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./button":54,"react-overlays/lib/Modal":36}],68:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _circularGlow = require('./circular-glow');

var _circularGlow2 = _interopRequireDefault(_circularGlow);

var _organism = require('./organism');

var _organism2 = _interopRequireDefault(_organism);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/**
 * Represents a BioLogica organism as an image on top of a circular gradient "glow" background.
 * Implemented as a React stateless functional component.
 *
 * @param {BioLogica.Organism} org - the organism to be represented
 * @param {string} color - the color of the circular gradient "glow" background view.
 * @param {number} size
 */
var OrganismGlowView = function OrganismGlowView(_ref) {
  var id = _ref.id;
  var className = _ref.className;
  var color = _ref.color;
  var size = _ref.size;
  var _ref$style = _ref.style;
  var style = _ref$style === undefined ? {} : _ref$style;

  var other = _objectWithoutProperties(_ref, ['id', 'className', 'color', 'size', 'style']);

  var containerStyle = { position: 'relative', width: size, height: size },
      glowStyle = { position: 'absolute' },
      orgStyle = _extends({ position: 'absolute' }, style);

  return React.createElement(
    'div',
    { id: id, className: 'geniblocks organism-glow ' + className, style: containerStyle },
    React.createElement(_circularGlow2.default, { id: id + '-glow', color: color, size: size, style: glowStyle }),
    React.createElement(_organism2.default, _extends({ id: id + '-organism', width: size, style: orgStyle }, other))
  );
};

OrganismGlowView.propTypes = {
  id: _react.PropTypes.string,
  className: _react.PropTypes.string,
  color: _react.PropTypes.string.isRequired,
  size: _react.PropTypes.number.isRequired,
  style: _react.PropTypes.object
};

exports.default = OrganismGlowView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./circular-glow":58,"./organism":69}],69:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var OrganismView = function OrganismView(_ref) {
  var org = _ref.org;
  var id = _ref.id;
  var _ref$width = _ref.width;
  var width = _ref$width === undefined ? 200 : _ref$width;
  var _ref$style = _ref.style;
  var style = _ref$style === undefined ? {} : _ref$style;
  var onClick = _ref.onClick;
  var wrapper = _ref.wrapper;

  var baseUrl = "https://geniverse-resources.concord.org/resources/drakes/images/",
      url = baseUrl + org.getImageName(),

  // The goal here was to have the onMouseDown handler select the organism,
  // so that mousedown-drag will both select the organism and begin the
  // drag. This works on Chrome and Safari, but on Firefox it disables
  // dragging. Disabling the onMouseDown handler means that Firefox users
  // must click to select and then click to drag, but at least they can
  // drag. The right solution is probably to allow organisms to be dragged
  // whether or not they're selected and then hopefully the onMouseDown
  // handler will work as expected. Otherwise, it may be necessary to
  // select the organism (if it isn't already selected) in beginDrag.
  isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') >= 0,
      handleMouseDown = isFirefox ? undefined : handleClick,
      divWrapper = wrapper || function (elt) {
    return elt;
  };

  function handleClick() {
    if (onClick) onClick(id, org);
  }

  return divWrapper(React.createElement(
    'div',
    { className: 'geniblocks organism', id: id, style: style,
      onMouseDown: handleMouseDown, onClick: handleClick },
    React.createElement('img', { src: url, width: width })
  ));
};

OrganismView.propTypes = {
  org: _react.PropTypes.object.isRequired,
  id: _react.PropTypes.string,
  width: _react.PropTypes.number,
  style: _react.PropTypes.object,
  onClick: _react.PropTypes.func,
  wrapper: _react.PropTypes.func
};

exports.default = OrganismView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],70:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _pen = require('./pen');

var _pen2 = _interopRequireDefault(_pen);

var _stats = require('./stats');

var _stats2 = _interopRequireDefault(_stats);

var _reactSimpletabs = require('react-simpletabs');

var _reactSimpletabs2 = _interopRequireDefault(_reactSimpletabs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PenStatsView = function (_React$Component) {
  _inherits(PenStatsView, _React$Component);

  function PenStatsView() {
    _classCallCheck(this, PenStatsView);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(PenStatsView).apply(this, arguments));
  }

  _createClass(PenStatsView, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var orgs = _props.orgs;
      var lastClutchSize = _props.lastClutchSize;
      var selectedIndex = _props.selectedIndex;
      var onSelectionChange = _props.onSelectionChange;
      var others = _objectWithoutProperties(_props, ['orgs', 'lastClutchSize', 'selectedIndex', 'onSelectionChange']);
      var lastClutch = orgs.slice(-lastClutchSize);

      return React.createElement(
        _reactSimpletabs2.default,
        null,
        React.createElement(
          _reactSimpletabs2.default.Panel,
          { title: 'Breeding Pen', key: 'Breeding Pen' },
          React.createElement(_pen2.default, _extends({ orgs: lastClutch }, others, {
            selectedIndex: selectedIndex,
            onClick: function onClick(iSelectedIndex) {
              if (onSelectionChange) onSelectionChange(iSelectedIndex);
            } }))
        ),
        React.createElement(
          _reactSimpletabs2.default.Panel,
          { title: 'Stats', key: 'Stats' },
          React.createElement(_stats2.default, { orgs: orgs, lastClutchSize: lastClutchSize })
        )
      );
    }
  }]);

  return PenStatsView;
}(React.Component);

PenStatsView.propTypes = {
  orgs: _react.PropTypes.arrayOf(_react.PropTypes.object).isRequired,
  lastClutchSize: _react.PropTypes.number.isRequired,
  selectedIndex: _react.PropTypes.number,
  onSelectionChange: _react.PropTypes.func
};
exports.default = PenStatsView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./pen":71,"./stats":74,"react-simpletabs":48}],71:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _organism = require('./organism');

var _organism2 = _interopRequireDefault(_organism);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PenView = function PenView(_ref) {
  var orgs = _ref.orgs;
  var _ref$idPrefix = _ref.idPrefix;
  var idPrefix = _ref$idPrefix === undefined ? 'organism-' : _ref$idPrefix;
  var _ref$width = _ref.width;
  var width = _ref$width === undefined ? 400 : _ref$width;
  var _ref$columns = _ref.columns;
  var columns = _ref$columns === undefined ? 5 : _ref$columns;
  var _ref$SelectedOrganism = _ref.SelectedOrganismView;
  var SelectedOrganismView = _ref$SelectedOrganism === undefined ? _organism2.default : _ref$SelectedOrganism;
  var selectedIndex = _ref.selectedIndex;
  var onClick = _ref.onClick;


  function handleClick(id, org) {
    var prefixIndex = id.indexOf(idPrefix),
        index = Number(id.substr(prefixIndex + idPrefix.length));
    if (onClick) onClick(index, id, org);
  }

  var orgWidth = width / columns,
      orgViews = orgs.map(function (org, index) {
    return index === selectedIndex ? React.createElement(SelectedOrganismView, { org: org, id: idPrefix + index, index: index, key: index,
      color: '#FFFFAA', size: orgWidth, onClick: handleClick }) : React.createElement(_organism2.default, { org: org, id: idPrefix + index, index: index, key: index,
      width: orgWidth, onClick: handleClick });
  });

  return React.createElement(
    'div',
    { className: 'geniblocks pen' },
    orgViews
  );
};

PenView.propTypes = {
  orgs: _react.PropTypes.arrayOf(_react.PropTypes.object).isRequired,
  idPrefix: _react.PropTypes.string,
  width: _react.PropTypes.number,
  columns: _react.PropTypes.number,
  SelectedOrganismView: _react.PropTypes.func,
  selectedIndex: _react.PropTypes.number,
  onClick: _react.PropTypes.func
};

exports.default = PenView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./organism":69}],72:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _circularGlow = require('./circular-glow');

var _circularGlow2 = _interopRequireDefault(_circularGlow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var QuestionGlowView = function QuestionGlowView(_ref) {
  var glowColor = _ref.glowColor;
  var _ref$size = _ref.size;
  var size = _ref$size === undefined ? 200 : _ref$size;

  var containerStyle = { position: 'relative', width: size, height: size },
      glowStyle = { position: 'absolute' };

  return React.createElement(
    'div',
    { className: 'geniblocks question-glow', style: containerStyle },
    React.createElement(_circularGlow2.default, { color: glowColor, size: size, style: glowStyle }),
    React.createElement('div', { className: 'geniblocks question-glow question-mark',
      style: { position: "absolute", width: size, height: size } })
  );
  // HTML text node
  //<div style={tStyle}>{text}</div>

  // SVG text node
  //<svg width={size+2} height={size+2} xmlns="http://www.w3.org/2000/svg">
  //  <text x='50' y='175' fill='#0D0D8C' style={tStyle}>
  //    {text}
  //  </text>
  //</svg>
};

QuestionGlowView.propTypes = {
  glowColor: _react.PropTypes.string.isRequired,
  size: _react.PropTypes.number
};

exports.default = QuestionGlowView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./circular-glow":58}],73:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _organismGlow = require('./organism-glow');

var _organismGlow2 = _interopRequireDefault(_organismGlow);

var _questionGlow = require('./question-glow');

var _questionGlow2 = _interopRequireDefault(_questionGlow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var QuestionOrganismGlowView = function QuestionOrganismGlowView(_ref) {
  var hidden = _ref.hidden;
  var color = _ref.color;
  var size = _ref.size;

  var other = _objectWithoutProperties(_ref, ['hidden', 'color', 'size']);

  var orgView = React.createElement(_organismGlow2.default, _extends({ color: color, size: size }, other)),
      questionView = React.createElement(_questionGlow2.default, { glowColor: color, width: size }),
      finalView = hidden ? questionView : orgView;

  return React.createElement(
    'div',
    { className: 'geniblocks question-organism-glow' },
    finalView
  );
};

QuestionOrganismGlowView.propTypes = {
  hidden: _react.PropTypes.bool,
  color: _react.PropTypes.string.isRequired,
  size: _react.PropTypes.number
};

exports.default = QuestionOrganismGlowView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./organism-glow":68,"./question-glow":72}],74:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _geneticsUtils = require('../utilities/genetics-utils');

var _geneticsUtils2 = _interopRequireDefault(_geneticsUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Stateless functional React component for displaying breeding statistics for a set of Biologica organisms
 * @param {Object[]} orgs - array of Biologica organisms for which statistics are to be displayed
 * @param {Object} orgs[].phenotype - the phenotype of the Biologica organism
 * @param {number} [lastClutchSize=orgs.length] - the number of organisms at the end of the array that comprise the most recent clutch
 */
var StatsView = function StatsView(_ref) {
  var orgs = _ref.orgs;
  var lastClutchSize = _ref.lastClutchSize;


  var traits = _geneticsUtils2.default.computeTraitCountsForOrganisms(orgs, lastClutchSize),
      clutchSize = lastClutchSize || orgs.length,
      rows = [];

  // build cumulative stats for table rows
  var traitNum = 0;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = traits[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _step$value = _slicedToArray(_step.value, 2);

      var trait = _step$value[0];
      var values = _step$value[1];
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = values[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _step2$value = _slicedToArray(_step2.value, 2);

          var value = _step2$value[0];
          var counts = _step2$value[1];

          var cMales = counts.clutch[BioLogica.MALE],
              cFemales = counts.clutch[BioLogica.FEMALE],
              cTotal = cMales + cFemales,
              cPct = Math.round(100 * cTotal / clutchSize),
              tMales = counts.total[BioLogica.MALE],
              tFemales = counts.total[BioLogica.FEMALE],
              tTotal = tMales + tFemales,
              tPct = Math.round(100 * tTotal / orgs.length);
          rows.push({ trait: trait, traitNum: traitNum, value: value, cMales: cMales, cFemales: cFemales, cTotal: cTotal, cPct: cPct,
            tMales: tMales, tFemales: tFemales, tTotal: tTotal, tPct: tPct });
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      ++traitNum;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return React.createElement(
    'div',
    { className: 'geniblocks stats' },
    React.createElement(
      'table',
      { id: 'stats-table', className: orgs.length > 0 ? "has-data" : "no-data" },
      React.createElement(
        'thead',
        null,
        React.createElement(
          'tr',
          null,
          React.createElement(
            'th',
            null,
            'Trait Value'
          ),
          React.createElement(
            'th',
            { colSpan: '2' },
            'Clutch'
          ),
          React.createElement(
            'th',
            null,
            'F'
          ),
          React.createElement(
            'th',
            null,
            'M'
          ),
          React.createElement(
            'th',
            { colSpan: '2' },
            'Total'
          ),
          React.createElement(
            'th',
            null,
            'F'
          ),
          React.createElement(
            'th',
            null,
            'M'
          )
        )
      ),
      React.createElement(
        'tbody',
        null,
        rows.map(function (row, index) {
          return React.createElement(
            'tr',
            { key: index, className: row.traitNum & 1 ? "odd-trait" : "even-trait",
              'data-trait-value': row.value },
            React.createElement(
              'td',
              { className: 'label' },
              row.value
            ),
            React.createElement(
              'td',
              { className: 'numeric' },
              row.cTotal
            ),
            React.createElement(
              'td',
              { className: 'numeric' },
              row.cPct,
              '%'
            ),
            React.createElement(
              'td',
              { className: 'numeric' },
              row.cFemales
            ),
            React.createElement(
              'td',
              { className: 'numeric' },
              row.cMales
            ),
            React.createElement(
              'td',
              { className: 'numeric' },
              row.tTotal
            ),
            React.createElement(
              'td',
              { className: 'numeric' },
              row.tPct,
              '%'
            ),
            React.createElement(
              'td',
              { className: 'numeric' },
              row.tFemales
            ),
            React.createElement(
              'td',
              { className: 'numeric' },
              row.tMales
            )
          );
        })
      )
    )
  );
};

StatsView.propTypes = {
  orgs: _react.PropTypes.arrayOf(_react.PropTypes.object).isRequired,
  lastClutchSize: _react.PropTypes.number
};

exports.default = StatsView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../utilities/genetics-utils":76}],75:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _alleleFilters = require('./components/allele-filters');

Object.defineProperty(exports, 'AlleleFiltersView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_alleleFilters).default;
  }
});

var _allele = require('./components/allele');

Object.defineProperty(exports, 'AlleleView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_allele).default;
  }
});

var _animatedGamete = require('./components/animated-gamete');

Object.defineProperty(exports, 'AnimatedGameteView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_animatedGamete).default;
  }
});

var _animatedOrganism = require('./components/animated-organism');

Object.defineProperty(exports, 'AnimatedOrganismView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_animatedOrganism).default;
  }
});

var _button = require('./components/button');

Object.defineProperty(exports, 'Button', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_button).default;
  }
});

var _changeSexButtons = require('./components/change-sex-buttons');

Object.defineProperty(exports, 'ChangeSexButtons', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_changeSexButtons).default;
  }
});

var _chromosomeImage = require('./components/chromosome-image');

Object.defineProperty(exports, 'ChromosomeImageView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_chromosomeImage).default;
  }
});

var _chromosome = require('./components/chromosome');

Object.defineProperty(exports, 'ChromosomeView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_chromosome).default;
  }
});

var _circularGlow = require('./components/circular-glow');

Object.defineProperty(exports, 'CircularGlowView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_circularGlow).default;
  }
});

var _feedback = require('./components/feedback');

Object.defineProperty(exports, 'FeedbackView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_feedback).default;
  }
});

var _fertilizingGamete = require('./components/fertilizing-gamete');

Object.defineProperty(exports, 'FertilizingGameteView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_fertilizingGamete).default;
  }
});

var _gametePool = require('./components/gamete-pool');

Object.defineProperty(exports, 'GametePoolView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_gametePool).default;
  }
});

var _gamete = require('./components/gamete');

Object.defineProperty(exports, 'GameteView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_gamete).default;
  }
});

var _geneLabel = require('./components/gene-label');

Object.defineProperty(exports, 'GeneLabelView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_geneLabel).default;
  }
});

var _genomeTest = require('./components/genome-test');

Object.defineProperty(exports, 'GenomeTestView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_genomeTest).default;
  }
});

var _genome = require('./components/genome');

Object.defineProperty(exports, 'GenomeView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_genome).default;
  }
});

var _glowBackground = require('./components/glow-background');

Object.defineProperty(exports, 'GlowBackgroundView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_glowBackground).default;
  }
});

var _modalAlert = require('./components/modal-alert');

Object.defineProperty(exports, 'ModalAlert', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_modalAlert).default;
  }
});

var _organism = require('./components/organism');

Object.defineProperty(exports, 'OrganismView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_organism).default;
  }
});

var _organismGlow = require('./components/organism-glow');

Object.defineProperty(exports, 'OrganismGlowView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_organismGlow).default;
  }
});

var _pen = require('./components/pen');

Object.defineProperty(exports, 'PenView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_pen).default;
  }
});

var _penStats = require('./components/pen-stats');

Object.defineProperty(exports, 'PenStatsView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_penStats).default;
  }
});

var _questionGlow = require('./components/question-glow');

Object.defineProperty(exports, 'QuestionGlowView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_questionGlow).default;
  }
});

var _questionOrganismGlow = require('./components/question-organism-glow');

Object.defineProperty(exports, 'QuestionOrganismGlowView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_questionOrganismGlow).default;
  }
});

var _stats = require('./components/stats');

Object.defineProperty(exports, 'StatsView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_stats).default;
  }
});

var _geneticsUtils = require('./utilities/genetics-utils');

Object.defineProperty(exports, 'GeneticsUtils', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_geneticsUtils).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./components/allele":51,"./components/allele-filters":50,"./components/animated-gamete":52,"./components/animated-organism":53,"./components/button":54,"./components/change-sex-buttons":55,"./components/chromosome":57,"./components/chromosome-image":56,"./components/circular-glow":58,"./components/feedback":59,"./components/fertilizing-gamete":60,"./components/gamete":62,"./components/gamete-pool":61,"./components/gene-label":63,"./components/genome":65,"./components/genome-test":64,"./components/glow-background":66,"./components/modal-alert":67,"./components/organism":69,"./components/organism-glow":68,"./components/pen":71,"./components/pen-stats":70,"./components/question-glow":72,"./components/question-organism-glow":73,"./components/stats":74,"./utilities/genetics-utils":76}],76:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class providing utility functions for BioLogica genetics operations.
 * In some cases these are adapted from corresponding code in Geniverse.
 */

var GeneticsUtils = function () {
  function GeneticsUtils() {
    _classCallCheck(this, GeneticsUtils);
  }

  _createClass(GeneticsUtils, null, [{
    key: "filterAlleles",


    /**
     * Filters out hidden alleles from an original list of alleles
     *
     * @param {string[]} alleles - the set of alleles to be filtered
     * @param {string[]} hiddenAlleles - the alleles identifying the hidden genes
     * @param {BioLogica.species} species - the species that defines the genotype
     * @return {string[]} - the filtered alleles
     */
    value: function filterAlleles(alleles, hiddenAlleles, species) {
      var hiddenGenes = hiddenAlleles.map(function (a) {
        return BioLogica.Genetics.getGeneOfAllele(species, a);
      });
      return alleles.filter(function (a) {
        var gene = BioLogica.Genetics.getGeneOfAllele(species, a);
        return hiddenGenes.indexOf(gene) === -1;
      });
    }

    /**
     * Compute a map of traits -> traitValues -> traitCounts.
     *
     * @param {BioLogica.Organism[]} organisms - the set of organisms to compute stats for
     * @param {number} clutchSize - the last 'clutchSize' organisms are assumed to be the last clutch
     * @return {Map} - e.g. { "tail": { "long tail": { "clutch": [9, 11], "total": [53, 47] }}}
     */

  }, {
    key: "computeTraitCountsForOrganisms",
    value: function computeTraitCountsForOrganisms(organisms, lastClutchSize) {
      var traits = new Map(),
          clutchSize = lastClutchSize || organisms.length;

      // accumulate stats for each trait/value combination
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = organisms.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _slicedToArray(_step.value, 2);

          var index = _step$value[0];
          var org = _step$value[1];
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = Object.keys(org.phenotype.characteristics)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var trait = _step2.value;

              var value = org.phenotype.characteristics[trait],
                  traitValues = traits.get(trait) || new Map(),
                  valueCounts = traitValues.get(value) || { clutch: [0, 0], total: [0, 0] };
              if (!traits.has(trait)) traits.set(trait, traitValues);
              if (!traitValues.has(value)) traitValues.set(value, valueCounts);
              // most recent clutch assumed to be at end of organisms array
              if (index >= organisms.length - clutchSize) ++valueCounts.clutch[org.sex];
              ++valueCounts.total[org.sex];
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return traits;
    }

    /**
     * Converts an allele string to a JavaScript object that maps genes to alleles.
     * This can be useful for comparison purposes, for instance.
     *
     * @param {BioLogica.Genetics} genetics - genetics object to use for gene mapping
     * @param {string} alleleString - allele string of form "a:h,b:h,a:a,b:a..." to be modified
     * @return {object} - gene map of form { horns: {a:"h", b:"h"}, armor: {a:"a", b:"a"}, ...}
     */

  }, {
    key: "buildGeneMapFromAlleleString",
    value: function buildGeneMapFromAlleleString(genetics, alleleString) {
      var geneMap = {},
          alleleSubstrings = alleleString.split(",");
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = alleleSubstrings[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var alleleSubstr = _step3.value;

          var _alleleSubstr$split = alleleSubstr.split(":");

          var _alleleSubstr$split2 = _slicedToArray(_alleleSubstr$split, 2);

          var side = _alleleSubstr$split2[0];
          var allele = _alleleSubstr$split2[1];
          var gene = genetics.geneForAllele(allele);
          if (side && allele && gene) {
            if (!geneMap[gene]) geneMap[gene] = {};
            geneMap[gene][side] = allele;
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      return geneMap;
    }

    /**
     * Given an allele string and a gene map defining a set of base (default) alleles,
     * returns a new allele string with missing alleles replaced by their defaults.
     *
     * @param {BioLogica.Genetics} genetics - genetics object to use for gene mapping
     * @param {string} alleleString - allele string of form "a:h,b:h,a:a,b:a..." to be modified
     * @param {object} baseGeneMap - gene map of form { horn: {a:"h", b:"h"}, armor: {a:"a", b:"a"}, ...}
     * @return {string} - updated allele string of form "a:h,b:h,a:a,b:a..."
     */

  }, {
    key: "fillInMissingAllelesFromGeneMap",
    value: function fillInMissingAllelesFromGeneMap(genetics, alleleString, baseGeneMap) {
      var dstGeneMap = GeneticsUtils.buildGeneMapFromAlleleString(genetics, alleleString);
      var dstAlleleString = alleleString;
      for (var gene in dstGeneMap) {
        var geneValue = dstGeneMap[gene];
        // replace a missing 'a' side allele with the default if appropriate
        if (!geneValue.a && baseGeneMap[gene] && baseGeneMap[gene].a) {
          dstAlleleString = dstAlleleString.replace("b:" + geneValue.b, "a:" + baseGeneMap[gene].a + ",$&");
        }
        // replace a missing 'b' side allele with the default if appropriate
        if (!geneValue.b && baseGeneMap[gene] && baseGeneMap[gene].b) {
          dstAlleleString = dstAlleleString.replace("a:" + geneValue.a, "$&,b:" + baseGeneMap[gene].b);
        }
      }
      return dstAlleleString;
    }

    /**
     * Given two allele strings, returns a new allele string in which missing alleles
     * in the first are replaced by defaults provided by the second allele string.
     *
     * @param {BioLogica.Genetics} genetics - genetics object to use for gene mapping
     * @param {string} alleleString - allele string of form "a:h,b:h,a:a,b:a..." to be modified
     * @param {string} baseAlleleString - allele string of form "a:h,b:h,a:a,b:a..." to use as defaults
     * @return {string} - updated allele string of form "a:h,b:h,a:a,b:a..."
     */

  }, {
    key: "fillInMissingAllelesFromAlleleString",
    value: function fillInMissingAllelesFromAlleleString(genetics, alleleString, baseAlleleString) {
      var baseGeneMap = GeneticsUtils.buildGeneMapFromAlleleString(genetics, baseAlleleString);
      return GeneticsUtils.fillInMissingAllelesFromGeneMap(genetics, alleleString, baseGeneMap);
    }
  }, {
    key: "numberOfBreedingMovesToReachDrake",
    value: function numberOfBreedingMovesToReachDrake(organism1, organism2, changeableAlleles1, changeableAlleles2, targetOrganism) {
      var moves = 0,
          org1Alleles = organism1.getAlleleString().split(',').map(function (a) {
        return a.split(':')[1];
      }),
          org2Alleles = organism2.getAlleleString().split(',').map(function (a) {
        return a.split(':')[1];
      }),
          targetchars = targetOrganism.phenotype.characteristics,
          traitRules = organism1.species.traitRules;

      for (var trait in traitRules) {
        if (traitRules.hasOwnProperty(trait)) {
          var possibleSolutions = traitRules[trait][targetchars[trait]],
              shortestPath = Infinity;
          if (possibleSolutions && possibleSolutions.length) {
            for (var i = 0, ii = possibleSolutions.length; i < ii; i++) {
              var solution = possibleSolutions[i],
                  movesForSolution1 = 0,
                  movesForSolution2 = 0;
              for (var j = 0, jj = solution.length; j < jj; j++) {
                var allele1 = solution[j],
                    allele2 = j % 2 === 0 ? solution[j + 1] : solution[j - 1],
                    solutionMoves = 0;
                if (org1Alleles.indexOf(allele1) === -1) {
                  if (allele1 && (changeableAlleles1.indexOf(allele1) > -1 || changeableAlleles1.indexOf(allele1.toLowerCase()) > -1)) {
                    solutionMoves++;
                  } else {
                    solutionMoves = Infinity;
                  }
                }

                if (org2Alleles.indexOf(allele2) === -1) {
                  if (allele2 && (changeableAlleles2.indexOf(allele2) > -1 || changeableAlleles2.indexOf(allele2.toLowerCase()) > -1)) {
                    solutionMoves++;
                  } else {
                    solutionMoves = Infinity;
                  }
                }

                if (j % 2 === 0) {
                  movesForSolution1 += solutionMoves;
                } else {
                  movesForSolution2 += solutionMoves;
                }
              }
              shortestPath = Math.min(shortestPath, Math.min(movesForSolution1, movesForSolution2));
            }
            moves += shortestPath;
          }
        }
      }

      return moves;
    }

    /**
     * Returns the number of separate changes, including allele changes and sex changes,
     * required to match the phenotype of the 'testOrganism' to that of the 'targetOrganism'.
     *
     * @param {BioLogica.Organism} testOrganism - the organism to which changes would apply
     * @param {BioLogica.Organism} targetOrganism - the organism that serves as destination
     * @return {number} - the total number of changes required for the phenotypes to match
     */

  }, {
    key: "numberOfChangesToReachPhenotype",
    value: function numberOfChangesToReachPhenotype(testOrganism, targetOrganism) {
      var requiredChangeCount = GeneticsUtils.numberOfAlleleChangesToReachPhenotype(testOrganism.phenotype.characteristics, targetOrganism.phenotype.characteristics, testOrganism.genetics.genotype.allAlleles, testOrganism.species.traitRules);
      if (testOrganism.sex !== targetOrganism.sex) ++requiredChangeCount;

      return requiredChangeCount;
    }

    /**
     * Returns the number of separate allele changes required to make the phenotype of
     * the organism characterized by 'testCharacterstics' match that of the organism
     * characterized by 'targetCharacteristics'. Adapted from:
     * @see https://github.com/concord-consortium/Geniverse-SproutCore/blob/master/frameworks/geniverse/controllers/match.js
     *
     * @param {object} testCharacteristics - the characteristics of the test organism
     * @param {object} targetCharacteristics - the characteristics of the target organism
     * @param {string[]} testAlleles - the array of alleles of the test organism
     * @param {object} traitRules - the traitRules of the BioLogica.Species of the organisms
     * @return {number} - the number of allele changes required for the phenotypes to match
     */

  }, {
    key: "numberOfAlleleChangesToReachPhenotype",
    value: function numberOfAlleleChangesToReachPhenotype(testCharacteristics, targetCharacteristics, testAlleles, traitRules) {
      var alleles = testAlleles;
      var moves = 0;

      for (var trait in traitRules) {
        if (traitRules.hasOwnProperty(trait)) {
          if (testCharacteristics[trait] !== targetCharacteristics[trait]) {
            // first we have to work out what alleles the original drake has that correspond to
            // their non-matching trait
            var possibleTraitAlleles = GeneticsUtils.collectAllAllelesForTrait(trait, traitRules);
            var characteristicAlleles = [];
            for (var i = 0, ii = alleles.length; i < ii; i++) {
              if (possibleTraitAlleles.indexOf(alleles[i]) >= 0) {
                characteristicAlleles.push(alleles[i]);
              }
            }
            // now work out the smallest number of steps to get from there to the desired characteristic
            var possibleSolutions = traitRules[trait][targetCharacteristics[trait]];
            var shortestPathLength = Infinity;
            for (var _i = 0, _ii = possibleSolutions.length; _i < _ii; _i++) {
              var solution = possibleSolutions[_i].slice(),
                  pathLength = 0;
              for (var j = 0, jj = characteristicAlleles.length; j < jj; j++) {
                if (solution.indexOf(characteristicAlleles[j]) === -1) {
                  pathLength++;
                } else {
                  solution.splice(solution.indexOf(characteristicAlleles[j]), 1); // already matched this one, can't match it again
                }
              }
              shortestPathLength = pathLength < shortestPathLength ? pathLength : shortestPathLength;
            }
            moves += shortestPathLength;
          }
        }
      }
      return moves;
    }

    /**
     * Goes through the traitRules to find out what unique alleles are associated with each trait
     * e.g. For "tail" it will return ["T", "Tk", "t"]. Adapted from:
     * @see https://github.com/concord-consortium/Geniverse-SproutCore/blob/master/frameworks/geniverse/controllers/match.js
     *
     * @param {string} trait - name of trait, e.g. "tail"
     * @param {object} traitRules - the traitRules of the BioLogica.Species whose traits are of interest
     * @return {string[]} - array of allele strings, e.g. ["T", "Tk", "t"]
     */

  }, {
    key: "collectAllAllelesForTrait",
    value: function collectAllAllelesForTrait(trait, traitRules) {
      if (GeneticsUtils._possibleAllelesForTrait[trait]) {
        return GeneticsUtils._possibleAllelesForTrait[trait];
      }

      var allelesHash = {},
          alleles = [];
      for (var characteristic in traitRules[trait]) {
        for (var possibileAllelesCombo in traitRules[trait][characteristic]) {
          if (traitRules[trait][characteristic].hasOwnProperty(possibileAllelesCombo)) {
            for (var i = 0, ii = traitRules[trait][characteristic][possibileAllelesCombo].length; i < ii; i++) {
              allelesHash[traitRules[trait][characteristic][possibileAllelesCombo][i]] = 1;
            }
          }
        }
      }

      for (var allele in allelesHash) {
        alleles.push(allele);
      }

      GeneticsUtils._possibleAllelesForTrait[trait] = alleles; // store so we don't need to recalculate it
      return alleles;
    }
  }]);

  return GeneticsUtils;
}();

GeneticsUtils._possibleAllelesForTrait = {};
exports.default = GeneticsUtils;

},{}]},{},[75])(75)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvYWN0aXZlRWxlbWVudC5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy9jbGFzcy9hZGRDbGFzcy5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy9jbGFzcy9oYXNDbGFzcy5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy9jbGFzcy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy9jbGFzcy9yZW1vdmVDbGFzcy5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy9ldmVudHMvb2ZmLmpzIiwibm9kZV9tb2R1bGVzL2RvbS1oZWxwZXJzL2V2ZW50cy9vbi5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy9vd25lckRvY3VtZW50LmpzIiwibm9kZV9tb2R1bGVzL2RvbS1oZWxwZXJzL3F1ZXJ5L2NvbnRhaW5zLmpzIiwibm9kZV9tb2R1bGVzL2RvbS1oZWxwZXJzL3F1ZXJ5L2lzV2luZG93LmpzIiwibm9kZV9tb2R1bGVzL2RvbS1oZWxwZXJzL3N0eWxlL2dldENvbXB1dGVkU3R5bGUuanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvc3R5bGUvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvc3R5bGUvcmVtb3ZlU3R5bGUuanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvdXRpbC9iYWJlbEhlbHBlcnMuanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvdXRpbC9jYW1lbGl6ZS5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy91dGlsL2NhbWVsaXplU3R5bGUuanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvdXRpbC9oeXBoZW5hdGUuanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvdXRpbC9oeXBoZW5hdGVTdHlsZS5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy91dGlsL2luRE9NLmpzIiwibm9kZV9tb2R1bGVzL2RvbS1oZWxwZXJzL3V0aWwvc2Nyb2xsYmFyU2l6ZS5qcyIsIm5vZGVfbW9kdWxlcy9wZXJmb3JtYW5jZS1ub3cvbGliL3BlcmZvcm1hbmNlLW5vdy5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvcmFmL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW1vdGlvbi9saWIvTW90aW9uLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW1vdGlvbi9saWIvU3RhZ2dlcmVkTW90aW9uLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW1vdGlvbi9saWIvVHJhbnNpdGlvbk1vdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1tb3Rpb24vbGliL21hcFRvWmVyby5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1tb3Rpb24vbGliL21lcmdlRGlmZi5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1tb3Rpb24vbGliL3ByZXNldHMuanMiLCJub2RlX21vZHVsZXMvcmVhY3QtbW90aW9uL2xpYi9yZWFjdC1tb3Rpb24uanMiLCJub2RlX21vZHVsZXMvcmVhY3QtbW90aW9uL2xpYi9yZW9yZGVyS2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1tb3Rpb24vbGliL3Nob3VsZFN0b3BBbmltYXRpb24uanMiLCJub2RlX21vZHVsZXMvcmVhY3QtbW90aW9uL2xpYi9zcHJpbmcuanMiLCJub2RlX21vZHVsZXMvcmVhY3QtbW90aW9uL2xpYi9zdGVwcGVyLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW1vdGlvbi9saWIvc3RyaXBTdHlsZS5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1vdmVybGF5cy9saWIvTW9kYWwuanMiLCJub2RlX21vZHVsZXMvcmVhY3Qtb3ZlcmxheXMvbGliL01vZGFsTWFuYWdlci5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1vdmVybGF5cy9saWIvUG9ydGFsLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW92ZXJsYXlzL2xpYi91dGlscy9hZGRFdmVudExpc3RlbmVyLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW92ZXJsYXlzL2xpYi91dGlscy9hZGRGb2N1c0xpc3RlbmVyLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW92ZXJsYXlzL2xpYi91dGlscy9nZXRDb250YWluZXIuanMiLCJub2RlX21vZHVsZXMvcmVhY3Qtb3ZlcmxheXMvbGliL3V0aWxzL2lzT3ZlcmZsb3dpbmcuanMiLCJub2RlX21vZHVsZXMvcmVhY3Qtb3ZlcmxheXMvbGliL3V0aWxzL21hbmFnZUFyaWFIaWRkZW4uanMiLCJub2RlX21vZHVsZXMvcmVhY3Qtb3ZlcmxheXMvbGliL3V0aWxzL293bmVyRG9jdW1lbnQuanMiLCJub2RlX21vZHVsZXMvcmVhY3QtcHJvcC10eXBlcy9saWIvY29tbW9uLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LXByb3AtdHlwZXMvbGliL2VsZW1lbnRUeXBlLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LXByb3AtdHlwZXMvbGliL21vdW50YWJsZS5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1zaW1wbGV0YWJzL2Rpc3QvcmVhY3Qtc2ltcGxldGFicy5qcyIsIm5vZGVfbW9kdWxlcy93YXJuaW5nL2Jyb3dzZXIuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2FsbGVsZS1maWx0ZXJzLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9hbGxlbGUuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2FuaW1hdGVkLWdhbWV0ZS5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvYW5pbWF0ZWQtb3JnYW5pc20uanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2J1dHRvbi5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvY2hhbmdlLXNleC1idXR0b25zLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9jaHJvbW9zb21lLWltYWdlLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9jaHJvbW9zb21lLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9jaXJjdWxhci1nbG93LmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9mZWVkYmFjay5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvZmVydGlsaXppbmctZ2FtZXRlLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9nYW1ldGUtcG9vbC5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvZ2FtZXRlLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9nZW5lLWxhYmVsLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9nZW5vbWUtdGVzdC5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvZ2Vub21lLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9nbG93LWJhY2tncm91bmQuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL21vZGFsLWFsZXJ0LmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9vcmdhbmlzbS1nbG93LmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9vcmdhbmlzbS5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvcGVuLXN0YXRzLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9wZW4uanMiLCJzcmMvY29kZS9jb21wb25lbnRzL3F1ZXN0aW9uLWdsb3cuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL3F1ZXN0aW9uLW9yZ2FuaXNtLWdsb3cuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL3N0YXRzLmpzIiwic3JjL2NvZGUvZ2VuaWJsb2Nrcy5qcyIsInNyYy9jb2RlL3V0aWxpdGllcy9nZW5ldGljcy11dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUMzRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ2hQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNyUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3ZlQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDNWZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDM0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDaklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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YSxDQWlQWix3QixHQUEyQixFO2tCQWpQZixhIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJhYmVsSGVscGVycyA9IHJlcXVpcmUoJy4vdXRpbC9iYWJlbEhlbHBlcnMuanMnKTtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuLyoqXHJcbiAqIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnRcclxuICovXG5leHBvcnRzWydkZWZhdWx0J10gPSBhY3RpdmVFbGVtZW50O1xuXG52YXIgX293bmVyRG9jdW1lbnQgPSByZXF1aXJlKCcuL293bmVyRG9jdW1lbnQnKTtcblxudmFyIF9vd25lckRvY3VtZW50MiA9IGJhYmVsSGVscGVycy5pbnRlcm9wUmVxdWlyZURlZmF1bHQoX293bmVyRG9jdW1lbnQpO1xuXG5mdW5jdGlvbiBhY3RpdmVFbGVtZW50KCkge1xuICB2YXIgZG9jID0gYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyBkb2N1bWVudCA6IGFyZ3VtZW50c1swXTtcblxuICB0cnkge1xuICAgIHJldHVybiBkb2MuYWN0aXZlRWxlbWVudDtcbiAgfSBjYXRjaCAoZSkge31cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGhhc0NsYXNzID0gcmVxdWlyZSgnLi9oYXNDbGFzcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGFkZENsYXNzKGVsZW1lbnQsIGNsYXNzTmFtZSkge1xuICBpZiAoZWxlbWVudC5jbGFzc0xpc3QpIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO2Vsc2UgaWYgKCFoYXNDbGFzcyhlbGVtZW50KSkgZWxlbWVudC5jbGFzc05hbWUgPSBlbGVtZW50LmNsYXNzTmFtZSArICcgJyArIGNsYXNzTmFtZTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBoYXNDbGFzcyhlbGVtZW50LCBjbGFzc05hbWUpIHtcbiAgaWYgKGVsZW1lbnQuY2xhc3NMaXN0KSByZXR1cm4gISFjbGFzc05hbWUgJiYgZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKTtlbHNlIHJldHVybiAoJyAnICsgZWxlbWVudC5jbGFzc05hbWUgKyAnICcpLmluZGV4T2YoJyAnICsgY2xhc3NOYW1lICsgJyAnKSAhPT0gLTE7XG59OyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFkZENsYXNzOiByZXF1aXJlKCcuL2FkZENsYXNzJyksXG4gIHJlbW92ZUNsYXNzOiByZXF1aXJlKCcuL3JlbW92ZUNsYXNzJyksXG4gIGhhc0NsYXNzOiByZXF1aXJlKCcuL2hhc0NsYXNzJylcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHJlbW92ZUNsYXNzKGVsZW1lbnQsIGNsYXNzTmFtZSkge1xuICBpZiAoZWxlbWVudC5jbGFzc0xpc3QpIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO2Vsc2UgZWxlbWVudC5jbGFzc05hbWUgPSBlbGVtZW50LmNsYXNzTmFtZS5yZXBsYWNlKG5ldyBSZWdFeHAoJyhefFxcXFxzKScgKyBjbGFzc05hbWUgKyAnKD86XFxcXHN8JCknLCAnZycpLCAnJDEnKS5yZXBsYWNlKC9cXHMrL2csICcgJykucmVwbGFjZSgvXlxccyp8XFxzKiQvZywgJycpO1xufTsiLCIndXNlIHN0cmljdCc7XG52YXIgY2FuVXNlRE9NID0gcmVxdWlyZSgnLi4vdXRpbC9pbkRPTScpO1xudmFyIG9mZiA9IGZ1bmN0aW9uIG9mZigpIHt9O1xuXG5pZiAoY2FuVXNlRE9NKSB7XG5cbiAgb2ZmID0gKGZ1bmN0aW9uICgpIHtcblxuICAgIGlmIChkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKSByZXR1cm4gZnVuY3Rpb24gKG5vZGUsIGV2ZW50TmFtZSwgaGFuZGxlciwgY2FwdHVyZSkge1xuICAgICAgcmV0dXJuIG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGhhbmRsZXIsIGNhcHR1cmUgfHwgZmFsc2UpO1xuICAgIH07ZWxzZSBpZiAoZG9jdW1lbnQuYXR0YWNoRXZlbnQpIHJldHVybiBmdW5jdGlvbiAobm9kZSwgZXZlbnROYW1lLCBoYW5kbGVyKSB7XG4gICAgICByZXR1cm4gbm9kZS5kZXRhY2hFdmVudCgnb24nICsgZXZlbnROYW1lLCBoYW5kbGVyKTtcbiAgICB9O1xuICB9KSgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG9mZjsiLCIndXNlIHN0cmljdCc7XG52YXIgY2FuVXNlRE9NID0gcmVxdWlyZSgnLi4vdXRpbC9pbkRPTScpO1xudmFyIG9uID0gZnVuY3Rpb24gb24oKSB7fTtcblxuaWYgKGNhblVzZURPTSkge1xuICBvbiA9IChmdW5jdGlvbiAoKSB7XG5cbiAgICBpZiAoZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcikgcmV0dXJuIGZ1bmN0aW9uIChub2RlLCBldmVudE5hbWUsIGhhbmRsZXIsIGNhcHR1cmUpIHtcbiAgICAgIHJldHVybiBub2RlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBoYW5kbGVyLCBjYXB0dXJlIHx8IGZhbHNlKTtcbiAgICB9O2Vsc2UgaWYgKGRvY3VtZW50LmF0dGFjaEV2ZW50KSByZXR1cm4gZnVuY3Rpb24gKG5vZGUsIGV2ZW50TmFtZSwgaGFuZGxlcikge1xuICAgICAgcmV0dXJuIG5vZGUuYXR0YWNoRXZlbnQoJ29uJyArIGV2ZW50TmFtZSwgaGFuZGxlcik7XG4gICAgfTtcbiAgfSkoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBvbjsiLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gb3duZXJEb2N1bWVudDtcblxuZnVuY3Rpb24gb3duZXJEb2N1bWVudChub2RlKSB7XG4gIHJldHVybiBub2RlICYmIG5vZGUub3duZXJEb2N1bWVudCB8fCBkb2N1bWVudDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzW1wiZGVmYXVsdFwiXTsiLCIndXNlIHN0cmljdCc7XG52YXIgY2FuVXNlRE9NID0gcmVxdWlyZSgnLi4vdXRpbC9pbkRPTScpO1xuXG52YXIgY29udGFpbnMgPSAoZnVuY3Rpb24gKCkge1xuICB2YXIgcm9vdCA9IGNhblVzZURPTSAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG5cbiAgcmV0dXJuIHJvb3QgJiYgcm9vdC5jb250YWlucyA/IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XG4gICAgcmV0dXJuIGNvbnRleHQuY29udGFpbnMobm9kZSk7XG4gIH0gOiByb290ICYmIHJvb3QuY29tcGFyZURvY3VtZW50UG9zaXRpb24gPyBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xuICAgIHJldHVybiBjb250ZXh0ID09PSBub2RlIHx8ICEhKGNvbnRleHQuY29tcGFyZURvY3VtZW50UG9zaXRpb24obm9kZSkgJiAxNik7XG4gIH0gOiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xuICAgIGlmIChub2RlKSBkbyB7XG4gICAgICBpZiAobm9kZSA9PT0gY29udGV4dCkgcmV0dXJuIHRydWU7XG4gICAgfSB3aGlsZSAobm9kZSA9IG5vZGUucGFyZW50Tm9kZSk7XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbnRhaW5zOyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRXaW5kb3cobm9kZSkge1xuICByZXR1cm4gbm9kZSA9PT0gbm9kZS53aW5kb3cgPyBub2RlIDogbm9kZS5ub2RlVHlwZSA9PT0gOSA/IG5vZGUuZGVmYXVsdFZpZXcgfHwgbm9kZS5wYXJlbnRXaW5kb3cgOiBmYWxzZTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYmFiZWxIZWxwZXJzID0gcmVxdWlyZSgnLi4vdXRpbC9iYWJlbEhlbHBlcnMuanMnKTtcblxudmFyIF91dGlsQ2FtZWxpemVTdHlsZSA9IHJlcXVpcmUoJy4uL3V0aWwvY2FtZWxpemVTdHlsZScpO1xuXG52YXIgX3V0aWxDYW1lbGl6ZVN0eWxlMiA9IGJhYmVsSGVscGVycy5pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3V0aWxDYW1lbGl6ZVN0eWxlKTtcblxudmFyIHJwb3NpdGlvbiA9IC9eKHRvcHxyaWdodHxib3R0b218bGVmdCkkLztcbnZhciBybnVtbm9ucHggPSAvXihbKy1dPyg/OlxcZCpcXC58KVxcZCsoPzpbZUVdWystXT9cXGQrfCkpKD8hcHgpW2EteiVdKyQvaTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfZ2V0Q29tcHV0ZWRTdHlsZShub2RlKSB7XG4gIGlmICghbm9kZSkgdGhyb3cgbmV3IFR5cGVFcnJvcignTm8gRWxlbWVudCBwYXNzZWQgdG8gYGdldENvbXB1dGVkU3R5bGUoKWAnKTtcbiAgdmFyIGRvYyA9IG5vZGUub3duZXJEb2N1bWVudDtcblxuICByZXR1cm4gJ2RlZmF1bHRWaWV3JyBpbiBkb2MgPyBkb2MuZGVmYXVsdFZpZXcub3BlbmVyID8gbm9kZS5vd25lckRvY3VtZW50LmRlZmF1bHRWaWV3LmdldENvbXB1dGVkU3R5bGUobm9kZSwgbnVsbCkgOiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShub2RlLCBudWxsKSA6IHsgLy9pZSA4IFwibWFnaWNcIiBmcm9tOiBodHRwczovL2dpdGh1Yi5jb20vanF1ZXJ5L2pxdWVyeS9ibG9iLzEuMTEtc3RhYmxlL3NyYy9jc3MvY3VyQ1NTLmpzI0w3MlxuICAgIGdldFByb3BlcnR5VmFsdWU6IGZ1bmN0aW9uIGdldFByb3BlcnR5VmFsdWUocHJvcCkge1xuICAgICAgdmFyIHN0eWxlID0gbm9kZS5zdHlsZTtcblxuICAgICAgcHJvcCA9ICgwLCBfdXRpbENhbWVsaXplU3R5bGUyWydkZWZhdWx0J10pKHByb3ApO1xuXG4gICAgICBpZiAocHJvcCA9PSAnZmxvYXQnKSBwcm9wID0gJ3N0eWxlRmxvYXQnO1xuXG4gICAgICB2YXIgY3VycmVudCA9IG5vZGUuY3VycmVudFN0eWxlW3Byb3BdIHx8IG51bGw7XG5cbiAgICAgIGlmIChjdXJyZW50ID09IG51bGwgJiYgc3R5bGUgJiYgc3R5bGVbcHJvcF0pIGN1cnJlbnQgPSBzdHlsZVtwcm9wXTtcblxuICAgICAgaWYgKHJudW1ub25weC50ZXN0KGN1cnJlbnQpICYmICFycG9zaXRpb24udGVzdChwcm9wKSkge1xuICAgICAgICAvLyBSZW1lbWJlciB0aGUgb3JpZ2luYWwgdmFsdWVzXG4gICAgICAgIHZhciBsZWZ0ID0gc3R5bGUubGVmdDtcbiAgICAgICAgdmFyIHJ1blN0eWxlID0gbm9kZS5ydW50aW1lU3R5bGU7XG4gICAgICAgIHZhciByc0xlZnQgPSBydW5TdHlsZSAmJiBydW5TdHlsZS5sZWZ0O1xuXG4gICAgICAgIC8vIFB1dCBpbiB0aGUgbmV3IHZhbHVlcyB0byBnZXQgYSBjb21wdXRlZCB2YWx1ZSBvdXRcbiAgICAgICAgaWYgKHJzTGVmdCkgcnVuU3R5bGUubGVmdCA9IG5vZGUuY3VycmVudFN0eWxlLmxlZnQ7XG5cbiAgICAgICAgc3R5bGUubGVmdCA9IHByb3AgPT09ICdmb250U2l6ZScgPyAnMWVtJyA6IGN1cnJlbnQ7XG4gICAgICAgIGN1cnJlbnQgPSBzdHlsZS5waXhlbExlZnQgKyAncHgnO1xuXG4gICAgICAgIC8vIFJldmVydCB0aGUgY2hhbmdlZCB2YWx1ZXNcbiAgICAgICAgc3R5bGUubGVmdCA9IGxlZnQ7XG4gICAgICAgIGlmIChyc0xlZnQpIHJ1blN0eWxlLmxlZnQgPSByc0xlZnQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjdXJyZW50O1xuICAgIH1cbiAgfTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2FtZWxpemUgPSByZXF1aXJlKCcuLi91dGlsL2NhbWVsaXplU3R5bGUnKSxcbiAgICBoeXBoZW5hdGUgPSByZXF1aXJlKCcuLi91dGlsL2h5cGhlbmF0ZVN0eWxlJyksXG4gICAgX2dldENvbXB1dGVkU3R5bGUgPSByZXF1aXJlKCcuL2dldENvbXB1dGVkU3R5bGUnKSxcbiAgICByZW1vdmVTdHlsZSA9IHJlcXVpcmUoJy4vcmVtb3ZlU3R5bGUnKTtcblxudmFyIGhhcyA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc3R5bGUobm9kZSwgcHJvcGVydHksIHZhbHVlKSB7XG4gIHZhciBjc3MgPSAnJyxcbiAgICAgIHByb3BzID0gcHJvcGVydHk7XG5cbiAgaWYgKHR5cGVvZiBwcm9wZXJ0eSA9PT0gJ3N0cmluZycpIHtcblxuICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gbm9kZS5zdHlsZVtjYW1lbGl6ZShwcm9wZXJ0eSldIHx8IF9nZXRDb21wdXRlZFN0eWxlKG5vZGUpLmdldFByb3BlcnR5VmFsdWUoaHlwaGVuYXRlKHByb3BlcnR5KSk7ZWxzZSAocHJvcHMgPSB7fSlbcHJvcGVydHldID0gdmFsdWU7XG4gIH1cblxuICBmb3IgKHZhciBrZXkgaW4gcHJvcHMpIGlmIChoYXMuY2FsbChwcm9wcywga2V5KSkge1xuICAgICFwcm9wc1trZXldICYmIHByb3BzW2tleV0gIT09IDAgPyByZW1vdmVTdHlsZShub2RlLCBoeXBoZW5hdGUoa2V5KSkgOiBjc3MgKz0gaHlwaGVuYXRlKGtleSkgKyAnOicgKyBwcm9wc1trZXldICsgJzsnO1xuICB9XG5cbiAgbm9kZS5zdHlsZS5jc3NUZXh0ICs9ICc7JyArIGNzcztcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHJlbW92ZVN0eWxlKG5vZGUsIGtleSkge1xuICByZXR1cm4gJ3JlbW92ZVByb3BlcnR5JyBpbiBub2RlLnN0eWxlID8gbm9kZS5zdHlsZS5yZW1vdmVQcm9wZXJ0eShrZXkpIDogbm9kZS5zdHlsZS5yZW1vdmVBdHRyaWJ1dGUoa2V5KTtcbn07IiwiKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShbXCJleHBvcnRzXCJdLCBmYWN0b3J5KTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gXCJvYmplY3RcIikge1xuICAgIGZhY3RvcnkoZXhwb3J0cyk7XG4gIH0gZWxzZSB7XG4gICAgZmFjdG9yeShyb290LmJhYmVsSGVscGVycyA9IHt9KTtcbiAgfVxufSkodGhpcywgZnVuY3Rpb24gKGdsb2JhbCkge1xuICB2YXIgYmFiZWxIZWxwZXJzID0gZ2xvYmFsO1xuXG4gIGJhYmVsSGVscGVycy5pbnRlcm9wUmVxdWlyZURlZmF1bHQgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHtcbiAgICAgIFwiZGVmYXVsdFwiOiBvYmpcbiAgICB9O1xuICB9O1xuXG4gIGJhYmVsSGVscGVycy5fZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkge1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldO1xuXG4gICAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7XG4gICAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0YXJnZXQ7XG4gIH07XG59KSIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgckh5cGhlbiA9IC8tKC4pL2c7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY2FtZWxpemUoc3RyaW5nKSB7XG4gIHJldHVybiBzdHJpbmcucmVwbGFjZShySHlwaGVuLCBmdW5jdGlvbiAoXywgY2hyKSB7XG4gICAgcmV0dXJuIGNoci50b1VwcGVyQ2FzZSgpO1xuICB9KTtcbn07IiwiLyoqXHJcbiAqIENvcHlyaWdodCAyMDE0LTIwMTUsIEZhY2Vib29rLCBJbmMuXHJcbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9ibG9iLzJhZWI4YTJhNmJlYjAwNjE3YTQyMTdmN2Y4Mjg0OTI0ZmEyYWQ4MTkvc3JjL3ZlbmRvci9jb3JlL2NhbWVsaXplU3R5bGVOYW1lLmpzXHJcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG52YXIgY2FtZWxpemUgPSByZXF1aXJlKCcuL2NhbWVsaXplJyk7XG52YXIgbXNQYXR0ZXJuID0gL14tbXMtLztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjYW1lbGl6ZVN0eWxlTmFtZShzdHJpbmcpIHtcbiAgcmV0dXJuIGNhbWVsaXplKHN0cmluZy5yZXBsYWNlKG1zUGF0dGVybiwgJ21zLScpKTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgclVwcGVyID0gLyhbQS1aXSkvZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBoeXBoZW5hdGUoc3RyaW5nKSB7XG4gIHJldHVybiBzdHJpbmcucmVwbGFjZShyVXBwZXIsICctJDEnKS50b0xvd2VyQ2FzZSgpO1xufTsiLCIvKipcclxuICogQ29weXJpZ2h0IDIwMTMtMjAxNCwgRmFjZWJvb2ssIEluYy5cclxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuICogaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlYWN0L2Jsb2IvMmFlYjhhMmE2YmViMDA2MTdhNDIxN2Y3ZjgyODQ5MjRmYTJhZDgxOS9zcmMvdmVuZG9yL2NvcmUvaHlwaGVuYXRlU3R5bGVOYW1lLmpzXHJcbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGh5cGhlbmF0ZSA9IHJlcXVpcmUoXCIuL2h5cGhlbmF0ZVwiKTtcbnZhciBtc1BhdHRlcm4gPSAvXm1zLS87XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaHlwaGVuYXRlU3R5bGVOYW1lKHN0cmluZykge1xuICByZXR1cm4gaHlwaGVuYXRlKHN0cmluZykucmVwbGFjZShtc1BhdHRlcm4sIFwiLW1zLVwiKTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xubW9kdWxlLmV4cG9ydHMgPSAhISh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuZG9jdW1lbnQgJiYgd2luZG93LmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQpOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNhblVzZURPTSA9IHJlcXVpcmUoJy4vaW5ET00nKTtcblxudmFyIHNpemU7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHJlY2FsYykge1xuICBpZiAoIXNpemUgfHwgcmVjYWxjKSB7XG4gICAgaWYgKGNhblVzZURPTSkge1xuICAgICAgdmFyIHNjcm9sbERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgICBzY3JvbGxEaXYuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgc2Nyb2xsRGl2LnN0eWxlLnRvcCA9ICctOTk5OXB4JztcbiAgICAgIHNjcm9sbERpdi5zdHlsZS53aWR0aCA9ICc1MHB4JztcbiAgICAgIHNjcm9sbERpdi5zdHlsZS5oZWlnaHQgPSAnNTBweCc7XG4gICAgICBzY3JvbGxEaXYuc3R5bGUub3ZlcmZsb3cgPSAnc2Nyb2xsJztcblxuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzY3JvbGxEaXYpO1xuICAgICAgc2l6ZSA9IHNjcm9sbERpdi5vZmZzZXRXaWR0aCAtIHNjcm9sbERpdi5jbGllbnRXaWR0aDtcbiAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoc2Nyb2xsRGl2KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gc2l6ZTtcbn07IiwiLy8gR2VuZXJhdGVkIGJ5IENvZmZlZVNjcmlwdCAxLjcuMVxuKGZ1bmN0aW9uKCkge1xuICB2YXIgZ2V0TmFub1NlY29uZHMsIGhydGltZSwgbG9hZFRpbWU7XG5cbiAgaWYgKCh0eXBlb2YgcGVyZm9ybWFuY2UgIT09IFwidW5kZWZpbmVkXCIgJiYgcGVyZm9ybWFuY2UgIT09IG51bGwpICYmIHBlcmZvcm1hbmNlLm5vdykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgfTtcbiAgfSBlbHNlIGlmICgodHlwZW9mIHByb2Nlc3MgIT09IFwidW5kZWZpbmVkXCIgJiYgcHJvY2VzcyAhPT0gbnVsbCkgJiYgcHJvY2Vzcy5ocnRpbWUpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIChnZXROYW5vU2Vjb25kcygpIC0gbG9hZFRpbWUpIC8gMWU2O1xuICAgIH07XG4gICAgaHJ0aW1lID0gcHJvY2Vzcy5ocnRpbWU7XG4gICAgZ2V0TmFub1NlY29uZHMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBocjtcbiAgICAgIGhyID0gaHJ0aW1lKCk7XG4gICAgICByZXR1cm4gaHJbMF0gKiAxZTkgKyBoclsxXTtcbiAgICB9O1xuICAgIGxvYWRUaW1lID0gZ2V0TmFub1NlY29uZHMoKTtcbiAgfSBlbHNlIGlmIChEYXRlLm5vdykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gRGF0ZS5ub3coKSAtIGxvYWRUaW1lO1xuICAgIH07XG4gICAgbG9hZFRpbWUgPSBEYXRlLm5vdygpO1xuICB9IGVsc2Uge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCkgLSBsb2FkVGltZTtcbiAgICB9O1xuICAgIGxvYWRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gIH1cblxufSkuY2FsbCh0aGlzKTtcbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBzZXRUaW1lb3V0KGRyYWluUXVldWUsIDApO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwidmFyIG5vdyA9IHJlcXVpcmUoJ3BlcmZvcm1hbmNlLW5vdycpXG4gICwgcm9vdCA9IHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnID8gZ2xvYmFsIDogd2luZG93XG4gICwgdmVuZG9ycyA9IFsnbW96JywgJ3dlYmtpdCddXG4gICwgc3VmZml4ID0gJ0FuaW1hdGlvbkZyYW1lJ1xuICAsIHJhZiA9IHJvb3RbJ3JlcXVlc3QnICsgc3VmZml4XVxuICAsIGNhZiA9IHJvb3RbJ2NhbmNlbCcgKyBzdWZmaXhdIHx8IHJvb3RbJ2NhbmNlbFJlcXVlc3QnICsgc3VmZml4XVxuXG5mb3IodmFyIGkgPSAwOyAhcmFmICYmIGkgPCB2ZW5kb3JzLmxlbmd0aDsgaSsrKSB7XG4gIHJhZiA9IHJvb3RbdmVuZG9yc1tpXSArICdSZXF1ZXN0JyArIHN1ZmZpeF1cbiAgY2FmID0gcm9vdFt2ZW5kb3JzW2ldICsgJ0NhbmNlbCcgKyBzdWZmaXhdXG4gICAgICB8fCByb290W3ZlbmRvcnNbaV0gKyAnQ2FuY2VsUmVxdWVzdCcgKyBzdWZmaXhdXG59XG5cbi8vIFNvbWUgdmVyc2lvbnMgb2YgRkYgaGF2ZSByQUYgYnV0IG5vdCBjQUZcbmlmKCFyYWYgfHwgIWNhZikge1xuICB2YXIgbGFzdCA9IDBcbiAgICAsIGlkID0gMFxuICAgICwgcXVldWUgPSBbXVxuICAgICwgZnJhbWVEdXJhdGlvbiA9IDEwMDAgLyA2MFxuXG4gIHJhZiA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgaWYocXVldWUubGVuZ3RoID09PSAwKSB7XG4gICAgICB2YXIgX25vdyA9IG5vdygpXG4gICAgICAgICwgbmV4dCA9IE1hdGgubWF4KDAsIGZyYW1lRHVyYXRpb24gLSAoX25vdyAtIGxhc3QpKVxuICAgICAgbGFzdCA9IG5leHQgKyBfbm93XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgY3AgPSBxdWV1ZS5zbGljZSgwKVxuICAgICAgICAvLyBDbGVhciBxdWV1ZSBoZXJlIHRvIHByZXZlbnRcbiAgICAgICAgLy8gY2FsbGJhY2tzIGZyb20gYXBwZW5kaW5nIGxpc3RlbmVyc1xuICAgICAgICAvLyB0byB0aGUgY3VycmVudCBmcmFtZSdzIHF1ZXVlXG4gICAgICAgIHF1ZXVlLmxlbmd0aCA9IDBcbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGNwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYoIWNwW2ldLmNhbmNlbGxlZCkge1xuICAgICAgICAgICAgdHJ5e1xuICAgICAgICAgICAgICBjcFtpXS5jYWxsYmFjayhsYXN0KVxuICAgICAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IHRocm93IGUgfSwgMClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIE1hdGgucm91bmQobmV4dCkpXG4gICAgfVxuICAgIHF1ZXVlLnB1c2goe1xuICAgICAgaGFuZGxlOiArK2lkLFxuICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrLFxuICAgICAgY2FuY2VsbGVkOiBmYWxzZVxuICAgIH0pXG4gICAgcmV0dXJuIGlkXG4gIH1cblxuICBjYWYgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgcXVldWUubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmKHF1ZXVlW2ldLmhhbmRsZSA9PT0gaGFuZGxlKSB7XG4gICAgICAgIHF1ZXVlW2ldLmNhbmNlbGxlZCA9IHRydWVcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihmbikge1xuICAvLyBXcmFwIGluIGEgbmV3IGZ1bmN0aW9uIHRvIHByZXZlbnRcbiAgLy8gYGNhbmNlbGAgcG90ZW50aWFsbHkgYmVpbmcgYXNzaWduZWRcbiAgLy8gdG8gdGhlIG5hdGl2ZSByQUYgZnVuY3Rpb25cbiAgcmV0dXJuIHJhZi5jYWxsKHJvb3QsIGZuKVxufVxubW9kdWxlLmV4cG9ydHMuY2FuY2VsID0gZnVuY3Rpb24oKSB7XG4gIGNhZi5hcHBseShyb290LCBhcmd1bWVudHMpXG59XG5tb2R1bGUuZXhwb3J0cy5wb2x5ZmlsbCA9IGZ1bmN0aW9uKCkge1xuICByb290LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHJhZlxuICByb290LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gY2FmXG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9tYXBUb1plcm8gPSByZXF1aXJlKCcuL21hcFRvWmVybycpO1xuXG52YXIgX21hcFRvWmVybzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9tYXBUb1plcm8pO1xuXG52YXIgX3N0cmlwU3R5bGUgPSByZXF1aXJlKCcuL3N0cmlwU3R5bGUnKTtcblxudmFyIF9zdHJpcFN0eWxlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3N0cmlwU3R5bGUpO1xuXG52YXIgX3N0ZXBwZXIzID0gcmVxdWlyZSgnLi9zdGVwcGVyJyk7XG5cbnZhciBfc3RlcHBlcjQgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zdGVwcGVyMyk7XG5cbnZhciBfcGVyZm9ybWFuY2VOb3cgPSByZXF1aXJlKCdwZXJmb3JtYW5jZS1ub3cnKTtcblxudmFyIF9wZXJmb3JtYW5jZU5vdzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wZXJmb3JtYW5jZU5vdyk7XG5cbnZhciBfcmFmID0gcmVxdWlyZSgncmFmJyk7XG5cbnZhciBfcmFmMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JhZik7XG5cbnZhciBfc2hvdWxkU3RvcEFuaW1hdGlvbiA9IHJlcXVpcmUoJy4vc2hvdWxkU3RvcEFuaW1hdGlvbicpO1xuXG52YXIgX3Nob3VsZFN0b3BBbmltYXRpb24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc2hvdWxkU3RvcEFuaW1hdGlvbik7XG5cbnZhciBfcmVhY3QgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snUmVhY3QnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1JlYWN0J10gOiBudWxsKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBtc1BlckZyYW1lID0gMTAwMCAvIDYwO1xuXG52YXIgTW90aW9uID0gX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdNb3Rpb24nLFxuXG4gIHByb3BUeXBlczoge1xuICAgIC8vIFRPT0Q6IHdhcm4gYWdhaW5zdCBwdXR0aW5nIGEgY29uZmlnIGluIGhlcmVcbiAgICBkZWZhdWx0U3R5bGU6IF9yZWFjdC5Qcm9wVHlwZXMub2JqZWN0T2YoX3JlYWN0LlByb3BUeXBlcy5udW1iZXIpLFxuICAgIHN0eWxlOiBfcmVhY3QuUHJvcFR5cGVzLm9iamVjdE9mKF9yZWFjdC5Qcm9wVHlwZXMub25lT2ZUeXBlKFtfcmVhY3QuUHJvcFR5cGVzLm51bWJlciwgX3JlYWN0LlByb3BUeXBlcy5vYmplY3RdKSkuaXNSZXF1aXJlZCxcbiAgICBjaGlsZHJlbjogX3JlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgb25SZXN0OiBfcmVhY3QuUHJvcFR5cGVzLmZ1bmNcbiAgfSxcblxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZSgpIHtcbiAgICB2YXIgX3Byb3BzID0gdGhpcy5wcm9wcztcbiAgICB2YXIgZGVmYXVsdFN0eWxlID0gX3Byb3BzLmRlZmF1bHRTdHlsZTtcbiAgICB2YXIgc3R5bGUgPSBfcHJvcHMuc3R5bGU7XG5cbiAgICB2YXIgY3VycmVudFN0eWxlID0gZGVmYXVsdFN0eWxlIHx8IF9zdHJpcFN0eWxlMlsnZGVmYXVsdCddKHN0eWxlKTtcbiAgICB2YXIgY3VycmVudFZlbG9jaXR5ID0gX21hcFRvWmVybzJbJ2RlZmF1bHQnXShjdXJyZW50U3R5bGUpO1xuICAgIHJldHVybiB7XG4gICAgICBjdXJyZW50U3R5bGU6IGN1cnJlbnRTdHlsZSxcbiAgICAgIGN1cnJlbnRWZWxvY2l0eTogY3VycmVudFZlbG9jaXR5LFxuICAgICAgbGFzdElkZWFsU3R5bGU6IGN1cnJlbnRTdHlsZSxcbiAgICAgIGxhc3RJZGVhbFZlbG9jaXR5OiBjdXJyZW50VmVsb2NpdHlcbiAgICB9O1xuICB9LFxuXG4gIHdhc0FuaW1hdGluZzogZmFsc2UsXG4gIGFuaW1hdGlvbklEOiBudWxsLFxuICBwcmV2VGltZTogMCxcbiAgYWNjdW11bGF0ZWRUaW1lOiAwLFxuICAvLyBpdCdzIHBvc3NpYmxlIHRoYXQgY3VycmVudFN0eWxlJ3MgdmFsdWUgaXMgc3RhbGU6IGlmIHByb3BzIGlzIGltbWVkaWF0ZWx5XG4gIC8vIGNoYW5nZWQgZnJvbSAwIHRvIDQwMCB0byBzcHJpbmcoMCkgYWdhaW4sIHRoZSBhc3luYyBjdXJyZW50U3R5bGUgaXMgc3RpbGxcbiAgLy8gYXQgMCAoZGlkbid0IGhhdmUgdGltZSB0byB0aWNrIGFuZCBpbnRlcnBvbGF0ZSBldmVuIG9uY2UpLiBJZiB3ZSBuYWl2ZWx5XG4gIC8vIGNvbXBhcmUgY3VycmVudFN0eWxlIHdpdGggZGVzdFZhbCBpdCdsbCBiZSAwID09PSAwIChubyBhbmltYXRpb24sIHN0b3ApLlxuICAvLyBJbiByZWFsaXR5IGN1cnJlbnRTdHlsZSBzaG91bGQgYmUgNDAwXG4gIHVucmVhZFByb3BTdHlsZTogbnVsbCxcbiAgLy8gYWZ0ZXIgY2hlY2tpbmcgZm9yIHVucmVhZFByb3BTdHlsZSAhPSBudWxsLCB3ZSBtYW51YWxseSBnbyBzZXQgdGhlXG4gIC8vIG5vbi1pbnRlcnBvbGF0aW5nIHZhbHVlcyAodGhvc2UgdGhhdCBhcmUgYSBudW1iZXIsIHdpdGhvdXQgYSBzcHJpbmdcbiAgLy8gY29uZmlnKVxuICBjbGVhclVucmVhZFByb3BTdHlsZTogZnVuY3Rpb24gY2xlYXJVbnJlYWRQcm9wU3R5bGUoZGVzdFN0eWxlKSB7XG4gICAgdmFyIGRpcnR5ID0gZmFsc2U7XG4gICAgdmFyIF9zdGF0ZSA9IHRoaXMuc3RhdGU7XG4gICAgdmFyIGN1cnJlbnRTdHlsZSA9IF9zdGF0ZS5jdXJyZW50U3R5bGU7XG4gICAgdmFyIGN1cnJlbnRWZWxvY2l0eSA9IF9zdGF0ZS5jdXJyZW50VmVsb2NpdHk7XG4gICAgdmFyIGxhc3RJZGVhbFN0eWxlID0gX3N0YXRlLmxhc3RJZGVhbFN0eWxlO1xuICAgIHZhciBsYXN0SWRlYWxWZWxvY2l0eSA9IF9zdGF0ZS5sYXN0SWRlYWxWZWxvY2l0eTtcblxuICAgIGZvciAodmFyIGtleSBpbiBkZXN0U3R5bGUpIHtcbiAgICAgIGlmICghZGVzdFN0eWxlLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIHZhciBzdHlsZVZhbHVlID0gZGVzdFN0eWxlW2tleV07XG4gICAgICBpZiAodHlwZW9mIHN0eWxlVmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgICAgIGlmICghZGlydHkpIHtcbiAgICAgICAgICBkaXJ0eSA9IHRydWU7XG4gICAgICAgICAgY3VycmVudFN0eWxlID0gX2V4dGVuZHMoe30sIGN1cnJlbnRTdHlsZSk7XG4gICAgICAgICAgY3VycmVudFZlbG9jaXR5ID0gX2V4dGVuZHMoe30sIGN1cnJlbnRWZWxvY2l0eSk7XG4gICAgICAgICAgbGFzdElkZWFsU3R5bGUgPSBfZXh0ZW5kcyh7fSwgbGFzdElkZWFsU3R5bGUpO1xuICAgICAgICAgIGxhc3RJZGVhbFZlbG9jaXR5ID0gX2V4dGVuZHMoe30sIGxhc3RJZGVhbFZlbG9jaXR5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGN1cnJlbnRTdHlsZVtrZXldID0gc3R5bGVWYWx1ZTtcbiAgICAgICAgY3VycmVudFZlbG9jaXR5W2tleV0gPSAwO1xuICAgICAgICBsYXN0SWRlYWxTdHlsZVtrZXldID0gc3R5bGVWYWx1ZTtcbiAgICAgICAgbGFzdElkZWFsVmVsb2NpdHlba2V5XSA9IDA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGRpcnR5KSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgY3VycmVudFN0eWxlOiBjdXJyZW50U3R5bGUsIGN1cnJlbnRWZWxvY2l0eTogY3VycmVudFZlbG9jaXR5LCBsYXN0SWRlYWxTdHlsZTogbGFzdElkZWFsU3R5bGUsIGxhc3RJZGVhbFZlbG9jaXR5OiBsYXN0SWRlYWxWZWxvY2l0eSB9KTtcbiAgICB9XG4gIH0sXG5cbiAgc3RhcnRBbmltYXRpb25JZk5lY2Vzc2FyeTogZnVuY3Rpb24gc3RhcnRBbmltYXRpb25JZk5lY2Vzc2FyeSgpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgLy8gVE9ETzogd2hlbiBjb25maWcgaXMge2E6IDEwfSBhbmQgZGVzdCBpcyB7YTogMTB9IGRvIHdlIHJhZiBvbmNlIGFuZFxuICAgIC8vIGNhbGwgY2I/IE5vLCBvdGhlcndpc2UgYWNjaWRlbnRhbCBwYXJlbnQgcmVyZW5kZXIgY2F1c2VzIGNiIHRyaWdnZXJcbiAgICB0aGlzLmFuaW1hdGlvbklEID0gX3JhZjJbJ2RlZmF1bHQnXShmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBjaGVjayBpZiB3ZSBuZWVkIHRvIGFuaW1hdGUgaW4gdGhlIGZpcnN0IHBsYWNlXG4gICAgICB2YXIgcHJvcHNTdHlsZSA9IF90aGlzLnByb3BzLnN0eWxlO1xuICAgICAgaWYgKF9zaG91bGRTdG9wQW5pbWF0aW9uMlsnZGVmYXVsdCddKF90aGlzLnN0YXRlLmN1cnJlbnRTdHlsZSwgcHJvcHNTdHlsZSwgX3RoaXMuc3RhdGUuY3VycmVudFZlbG9jaXR5KSkge1xuICAgICAgICBpZiAoX3RoaXMud2FzQW5pbWF0aW5nICYmIF90aGlzLnByb3BzLm9uUmVzdCkge1xuICAgICAgICAgIF90aGlzLnByb3BzLm9uUmVzdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbm8gbmVlZCB0byBjYW5jZWwgYW5pbWF0aW9uSUQgaGVyZTsgc2hvdWxkbid0IGhhdmUgYW55IGluIGZsaWdodFxuICAgICAgICBfdGhpcy5hbmltYXRpb25JRCA9IG51bGw7XG4gICAgICAgIF90aGlzLndhc0FuaW1hdGluZyA9IGZhbHNlO1xuICAgICAgICBfdGhpcy5hY2N1bXVsYXRlZFRpbWUgPSAwO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIF90aGlzLndhc0FuaW1hdGluZyA9IHRydWU7XG5cbiAgICAgIHZhciBjdXJyZW50VGltZSA9IF9wZXJmb3JtYW5jZU5vdzJbJ2RlZmF1bHQnXSgpO1xuICAgICAgdmFyIHRpbWVEZWx0YSA9IGN1cnJlbnRUaW1lIC0gX3RoaXMucHJldlRpbWU7XG4gICAgICBfdGhpcy5wcmV2VGltZSA9IGN1cnJlbnRUaW1lO1xuICAgICAgX3RoaXMuYWNjdW11bGF0ZWRUaW1lID0gX3RoaXMuYWNjdW11bGF0ZWRUaW1lICsgdGltZURlbHRhO1xuICAgICAgLy8gbW9yZSB0aGFuIDEwIGZyYW1lcz8gcHJvbGx5IHN3aXRjaGVkIGJyb3dzZXIgdGFiLiBSZXN0YXJ0XG4gICAgICBpZiAoX3RoaXMuYWNjdW11bGF0ZWRUaW1lID4gbXNQZXJGcmFtZSAqIDEwKSB7XG4gICAgICAgIF90aGlzLmFjY3VtdWxhdGVkVGltZSA9IDA7XG4gICAgICB9XG5cbiAgICAgIGlmIChfdGhpcy5hY2N1bXVsYXRlZFRpbWUgPT09IDApIHtcbiAgICAgICAgLy8gbm8gbmVlZCB0byBjYW5jZWwgYW5pbWF0aW9uSUQgaGVyZTsgc2hvdWxkbid0IGhhdmUgYW55IGluIGZsaWdodFxuICAgICAgICBfdGhpcy5hbmltYXRpb25JRCA9IG51bGw7XG4gICAgICAgIF90aGlzLnN0YXJ0QW5pbWF0aW9uSWZOZWNlc3NhcnkoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgY3VycmVudEZyYW1lQ29tcGxldGlvbiA9IChfdGhpcy5hY2N1bXVsYXRlZFRpbWUgLSBNYXRoLmZsb29yKF90aGlzLmFjY3VtdWxhdGVkVGltZSAvIG1zUGVyRnJhbWUpICogbXNQZXJGcmFtZSkgLyBtc1BlckZyYW1lO1xuICAgICAgdmFyIGZyYW1lc1RvQ2F0Y2hVcCA9IE1hdGguZmxvb3IoX3RoaXMuYWNjdW11bGF0ZWRUaW1lIC8gbXNQZXJGcmFtZSk7XG5cbiAgICAgIHZhciBuZXdMYXN0SWRlYWxTdHlsZSA9IHt9O1xuICAgICAgdmFyIG5ld0xhc3RJZGVhbFZlbG9jaXR5ID0ge307XG4gICAgICB2YXIgbmV3Q3VycmVudFN0eWxlID0ge307XG4gICAgICB2YXIgbmV3Q3VycmVudFZlbG9jaXR5ID0ge307XG5cbiAgICAgIGZvciAodmFyIGtleSBpbiBwcm9wc1N0eWxlKSB7XG4gICAgICAgIGlmICghcHJvcHNTdHlsZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc3R5bGVWYWx1ZSA9IHByb3BzU3R5bGVba2V5XTtcbiAgICAgICAgaWYgKHR5cGVvZiBzdHlsZVZhbHVlID09PSAnbnVtYmVyJykge1xuICAgICAgICAgIG5ld0N1cnJlbnRTdHlsZVtrZXldID0gc3R5bGVWYWx1ZTtcbiAgICAgICAgICBuZXdDdXJyZW50VmVsb2NpdHlba2V5XSA9IDA7XG4gICAgICAgICAgbmV3TGFzdElkZWFsU3R5bGVba2V5XSA9IHN0eWxlVmFsdWU7XG4gICAgICAgICAgbmV3TGFzdElkZWFsVmVsb2NpdHlba2V5XSA9IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIG5ld0xhc3RJZGVhbFN0eWxlVmFsdWUgPSBfdGhpcy5zdGF0ZS5sYXN0SWRlYWxTdHlsZVtrZXldO1xuICAgICAgICAgIHZhciBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlID0gX3RoaXMuc3RhdGUubGFzdElkZWFsVmVsb2NpdHlba2V5XTtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZyYW1lc1RvQ2F0Y2hVcDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgX3N0ZXBwZXIgPSBfc3RlcHBlcjRbJ2RlZmF1bHQnXShtc1BlckZyYW1lIC8gMTAwMCwgbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSwgbmV3TGFzdElkZWFsVmVsb2NpdHlWYWx1ZSwgc3R5bGVWYWx1ZS52YWwsIHN0eWxlVmFsdWUuc3RpZmZuZXNzLCBzdHlsZVZhbHVlLmRhbXBpbmcsIHN0eWxlVmFsdWUucHJlY2lzaW9uKTtcblxuICAgICAgICAgICAgbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSA9IF9zdGVwcGVyWzBdO1xuICAgICAgICAgICAgbmV3TGFzdElkZWFsVmVsb2NpdHlWYWx1ZSA9IF9zdGVwcGVyWzFdO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBfc3RlcHBlcjIgPSBfc3RlcHBlcjRbJ2RlZmF1bHQnXShtc1BlckZyYW1lIC8gMTAwMCwgbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSwgbmV3TGFzdElkZWFsVmVsb2NpdHlWYWx1ZSwgc3R5bGVWYWx1ZS52YWwsIHN0eWxlVmFsdWUuc3RpZmZuZXNzLCBzdHlsZVZhbHVlLmRhbXBpbmcsIHN0eWxlVmFsdWUucHJlY2lzaW9uKTtcblxuICAgICAgICAgIHZhciBuZXh0SWRlYWxYID0gX3N0ZXBwZXIyWzBdO1xuICAgICAgICAgIHZhciBuZXh0SWRlYWxWID0gX3N0ZXBwZXIyWzFdO1xuXG4gICAgICAgICAgbmV3Q3VycmVudFN0eWxlW2tleV0gPSBuZXdMYXN0SWRlYWxTdHlsZVZhbHVlICsgKG5leHRJZGVhbFggLSBuZXdMYXN0SWRlYWxTdHlsZVZhbHVlKSAqIGN1cnJlbnRGcmFtZUNvbXBsZXRpb247XG4gICAgICAgICAgbmV3Q3VycmVudFZlbG9jaXR5W2tleV0gPSBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlICsgKG5leHRJZGVhbFYgLSBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlKSAqIGN1cnJlbnRGcmFtZUNvbXBsZXRpb247XG4gICAgICAgICAgbmV3TGFzdElkZWFsU3R5bGVba2V5XSA9IG5ld0xhc3RJZGVhbFN0eWxlVmFsdWU7XG4gICAgICAgICAgbmV3TGFzdElkZWFsVmVsb2NpdHlba2V5XSA9IG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgX3RoaXMuYW5pbWF0aW9uSUQgPSBudWxsO1xuICAgICAgLy8gdGhlIGFtb3VudCB3ZSdyZSBsb29wZWQgb3ZlciBhYm92ZVxuICAgICAgX3RoaXMuYWNjdW11bGF0ZWRUaW1lIC09IGZyYW1lc1RvQ2F0Y2hVcCAqIG1zUGVyRnJhbWU7XG5cbiAgICAgIF90aGlzLnNldFN0YXRlKHtcbiAgICAgICAgY3VycmVudFN0eWxlOiBuZXdDdXJyZW50U3R5bGUsXG4gICAgICAgIGN1cnJlbnRWZWxvY2l0eTogbmV3Q3VycmVudFZlbG9jaXR5LFxuICAgICAgICBsYXN0SWRlYWxTdHlsZTogbmV3TGFzdElkZWFsU3R5bGUsXG4gICAgICAgIGxhc3RJZGVhbFZlbG9jaXR5OiBuZXdMYXN0SWRlYWxWZWxvY2l0eVxuICAgICAgfSk7XG5cbiAgICAgIF90aGlzLnVucmVhZFByb3BTdHlsZSA9IG51bGw7XG5cbiAgICAgIF90aGlzLnN0YXJ0QW5pbWF0aW9uSWZOZWNlc3NhcnkoKTtcbiAgICB9KTtcbiAgfSxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5wcmV2VGltZSA9IF9wZXJmb3JtYW5jZU5vdzJbJ2RlZmF1bHQnXSgpO1xuICAgIHRoaXMuc3RhcnRBbmltYXRpb25JZk5lY2Vzc2FyeSgpO1xuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHM6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMocHJvcHMpIHtcbiAgICBpZiAodGhpcy51bnJlYWRQcm9wU3R5bGUgIT0gbnVsbCkge1xuICAgICAgLy8gcHJldmlvdXMgcHJvcHMgaGF2ZW4ndCBoYWQgdGhlIGNoYW5jZSB0byBiZSBzZXQgeWV0OyBzZXQgdGhlbSBoZXJlXG4gICAgICB0aGlzLmNsZWFyVW5yZWFkUHJvcFN0eWxlKHRoaXMudW5yZWFkUHJvcFN0eWxlKTtcbiAgICB9XG5cbiAgICB0aGlzLnVucmVhZFByb3BTdHlsZSA9IHByb3BzLnN0eWxlO1xuICAgIGlmICh0aGlzLmFuaW1hdGlvbklEID09IG51bGwpIHtcbiAgICAgIHRoaXMucHJldlRpbWUgPSBfcGVyZm9ybWFuY2VOb3cyWydkZWZhdWx0J10oKTtcbiAgICAgIHRoaXMuc3RhcnRBbmltYXRpb25JZk5lY2Vzc2FyeSgpO1xuICAgIH1cbiAgfSxcblxuICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24gY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgaWYgKHRoaXMuYW5pbWF0aW9uSUQgIT0gbnVsbCkge1xuICAgICAgX3JhZjJbJ2RlZmF1bHQnXS5jYW5jZWwodGhpcy5hbmltYXRpb25JRCk7XG4gICAgICB0aGlzLmFuaW1hdGlvbklEID0gbnVsbDtcbiAgICB9XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgdmFyIHJlbmRlcmVkQ2hpbGRyZW4gPSB0aGlzLnByb3BzLmNoaWxkcmVuKHRoaXMuc3RhdGUuY3VycmVudFN0eWxlKTtcbiAgICByZXR1cm4gcmVuZGVyZWRDaGlsZHJlbiAmJiBfcmVhY3QyWydkZWZhdWx0J10uQ2hpbGRyZW4ub25seShyZW5kZXJlZENoaWxkcmVuKTtcbiAgfVxufSk7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IE1vdGlvbjtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX21hcFRvWmVybyA9IHJlcXVpcmUoJy4vbWFwVG9aZXJvJyk7XG5cbnZhciBfbWFwVG9aZXJvMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX21hcFRvWmVybyk7XG5cbnZhciBfc3RyaXBTdHlsZSA9IHJlcXVpcmUoJy4vc3RyaXBTdHlsZScpO1xuXG52YXIgX3N0cmlwU3R5bGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc3RyaXBTdHlsZSk7XG5cbnZhciBfc3RlcHBlcjMgPSByZXF1aXJlKCcuL3N0ZXBwZXInKTtcblxudmFyIF9zdGVwcGVyNCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3N0ZXBwZXIzKTtcblxudmFyIF9wZXJmb3JtYW5jZU5vdyA9IHJlcXVpcmUoJ3BlcmZvcm1hbmNlLW5vdycpO1xuXG52YXIgX3BlcmZvcm1hbmNlTm93MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3BlcmZvcm1hbmNlTm93KTtcblxudmFyIF9yYWYgPSByZXF1aXJlKCdyYWYnKTtcblxudmFyIF9yYWYyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmFmKTtcblxudmFyIF9zaG91bGRTdG9wQW5pbWF0aW9uID0gcmVxdWlyZSgnLi9zaG91bGRTdG9wQW5pbWF0aW9uJyk7XG5cbnZhciBfc2hvdWxkU3RvcEFuaW1hdGlvbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zaG91bGRTdG9wQW5pbWF0aW9uKTtcblxudmFyIF9yZWFjdCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydSZWFjdCddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnUmVhY3QnXSA6IG51bGwpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIG1zUGVyRnJhbWUgPSAxMDAwIC8gNjA7XG5cbmZ1bmN0aW9uIHNob3VsZFN0b3BBbmltYXRpb25BbGwoY3VycmVudFN0eWxlcywgc3R5bGVzLCBjdXJyZW50VmVsb2NpdGllcykge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGN1cnJlbnRTdHlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoIV9zaG91bGRTdG9wQW5pbWF0aW9uMlsnZGVmYXVsdCddKGN1cnJlbnRTdHlsZXNbaV0sIHN0eWxlc1tpXSwgY3VycmVudFZlbG9jaXRpZXNbaV0pKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG52YXIgU3RhZ2dlcmVkTW90aW9uID0gX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdTdGFnZ2VyZWRNb3Rpb24nLFxuXG4gIHByb3BUeXBlczoge1xuICAgIC8vIFRPT0Q6IHdhcm4gYWdhaW5zdCBwdXR0aW5nIGEgY29uZmlnIGluIGhlcmVcbiAgICBkZWZhdWx0U3R5bGVzOiBfcmVhY3QuUHJvcFR5cGVzLmFycmF5T2YoX3JlYWN0LlByb3BUeXBlcy5vYmplY3RPZihfcmVhY3QuUHJvcFR5cGVzLm51bWJlcikpLFxuICAgIHN0eWxlczogX3JlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgY2hpbGRyZW46IF9yZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG4gIH0sXG5cbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgdmFyIF9wcm9wcyA9IHRoaXMucHJvcHM7XG4gICAgdmFyIGRlZmF1bHRTdHlsZXMgPSBfcHJvcHMuZGVmYXVsdFN0eWxlcztcbiAgICB2YXIgc3R5bGVzID0gX3Byb3BzLnN0eWxlcztcblxuICAgIHZhciBjdXJyZW50U3R5bGVzID0gZGVmYXVsdFN0eWxlcyB8fCBzdHlsZXMoKS5tYXAoX3N0cmlwU3R5bGUyWydkZWZhdWx0J10pO1xuICAgIHZhciBjdXJyZW50VmVsb2NpdGllcyA9IGN1cnJlbnRTdHlsZXMubWFwKGZ1bmN0aW9uIChjdXJyZW50U3R5bGUpIHtcbiAgICAgIHJldHVybiBfbWFwVG9aZXJvMlsnZGVmYXVsdCddKGN1cnJlbnRTdHlsZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGN1cnJlbnRTdHlsZXM6IGN1cnJlbnRTdHlsZXMsXG4gICAgICBjdXJyZW50VmVsb2NpdGllczogY3VycmVudFZlbG9jaXRpZXMsXG4gICAgICBsYXN0SWRlYWxTdHlsZXM6IGN1cnJlbnRTdHlsZXMsXG4gICAgICBsYXN0SWRlYWxWZWxvY2l0aWVzOiBjdXJyZW50VmVsb2NpdGllc1xuICAgIH07XG4gIH0sXG5cbiAgYW5pbWF0aW9uSUQ6IG51bGwsXG4gIHByZXZUaW1lOiAwLFxuICBhY2N1bXVsYXRlZFRpbWU6IDAsXG4gIC8vIGl0J3MgcG9zc2libGUgdGhhdCBjdXJyZW50U3R5bGUncyB2YWx1ZSBpcyBzdGFsZTogaWYgcHJvcHMgaXMgaW1tZWRpYXRlbHlcbiAgLy8gY2hhbmdlZCBmcm9tIDAgdG8gNDAwIHRvIHNwcmluZygwKSBhZ2FpbiwgdGhlIGFzeW5jIGN1cnJlbnRTdHlsZSBpcyBzdGlsbFxuICAvLyBhdCAwIChkaWRuJ3QgaGF2ZSB0aW1lIHRvIHRpY2sgYW5kIGludGVycG9sYXRlIGV2ZW4gb25jZSkuIElmIHdlIG5haXZlbHlcbiAgLy8gY29tcGFyZSBjdXJyZW50U3R5bGUgd2l0aCBkZXN0VmFsIGl0J2xsIGJlIDAgPT09IDAgKG5vIGFuaW1hdGlvbiwgc3RvcCkuXG4gIC8vIEluIHJlYWxpdHkgY3VycmVudFN0eWxlIHNob3VsZCBiZSA0MDBcbiAgdW5yZWFkUHJvcFN0eWxlczogbnVsbCxcbiAgLy8gYWZ0ZXIgY2hlY2tpbmcgZm9yIHVucmVhZFByb3BTdHlsZXMgIT0gbnVsbCwgd2UgbWFudWFsbHkgZ28gc2V0IHRoZVxuICAvLyBub24taW50ZXJwb2xhdGluZyB2YWx1ZXMgKHRob3NlIHRoYXQgYXJlIGEgbnVtYmVyLCB3aXRob3V0IGEgc3ByaW5nXG4gIC8vIGNvbmZpZylcbiAgY2xlYXJVbnJlYWRQcm9wU3R5bGU6IGZ1bmN0aW9uIGNsZWFyVW5yZWFkUHJvcFN0eWxlKHVucmVhZFByb3BTdHlsZXMpIHtcbiAgICB2YXIgX3N0YXRlID0gdGhpcy5zdGF0ZTtcbiAgICB2YXIgY3VycmVudFN0eWxlcyA9IF9zdGF0ZS5jdXJyZW50U3R5bGVzO1xuICAgIHZhciBjdXJyZW50VmVsb2NpdGllcyA9IF9zdGF0ZS5jdXJyZW50VmVsb2NpdGllcztcbiAgICB2YXIgbGFzdElkZWFsU3R5bGVzID0gX3N0YXRlLmxhc3RJZGVhbFN0eWxlcztcbiAgICB2YXIgbGFzdElkZWFsVmVsb2NpdGllcyA9IF9zdGF0ZS5sYXN0SWRlYWxWZWxvY2l0aWVzO1xuXG4gICAgdmFyIHNvbWVEaXJ0eSA9IGZhbHNlO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdW5yZWFkUHJvcFN0eWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHVucmVhZFByb3BTdHlsZSA9IHVucmVhZFByb3BTdHlsZXNbaV07XG4gICAgICB2YXIgZGlydHkgPSBmYWxzZTtcblxuICAgICAgZm9yICh2YXIga2V5IGluIHVucmVhZFByb3BTdHlsZSkge1xuICAgICAgICBpZiAoIXVucmVhZFByb3BTdHlsZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc3R5bGVWYWx1ZSA9IHVucmVhZFByb3BTdHlsZVtrZXldO1xuICAgICAgICBpZiAodHlwZW9mIHN0eWxlVmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgaWYgKCFkaXJ0eSkge1xuICAgICAgICAgICAgZGlydHkgPSB0cnVlO1xuICAgICAgICAgICAgc29tZURpcnR5ID0gdHJ1ZTtcbiAgICAgICAgICAgIGN1cnJlbnRTdHlsZXNbaV0gPSBfZXh0ZW5kcyh7fSwgY3VycmVudFN0eWxlc1tpXSk7XG4gICAgICAgICAgICBjdXJyZW50VmVsb2NpdGllc1tpXSA9IF9leHRlbmRzKHt9LCBjdXJyZW50VmVsb2NpdGllc1tpXSk7XG4gICAgICAgICAgICBsYXN0SWRlYWxTdHlsZXNbaV0gPSBfZXh0ZW5kcyh7fSwgbGFzdElkZWFsU3R5bGVzW2ldKTtcbiAgICAgICAgICAgIGxhc3RJZGVhbFZlbG9jaXRpZXNbaV0gPSBfZXh0ZW5kcyh7fSwgbGFzdElkZWFsVmVsb2NpdGllc1tpXSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGN1cnJlbnRTdHlsZXNbaV1ba2V5XSA9IHN0eWxlVmFsdWU7XG4gICAgICAgICAgY3VycmVudFZlbG9jaXRpZXNbaV1ba2V5XSA9IDA7XG4gICAgICAgICAgbGFzdElkZWFsU3R5bGVzW2ldW2tleV0gPSBzdHlsZVZhbHVlO1xuICAgICAgICAgIGxhc3RJZGVhbFZlbG9jaXRpZXNbaV1ba2V5XSA9IDA7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc29tZURpcnR5KSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgY3VycmVudFN0eWxlczogY3VycmVudFN0eWxlcywgY3VycmVudFZlbG9jaXRpZXM6IGN1cnJlbnRWZWxvY2l0aWVzLCBsYXN0SWRlYWxTdHlsZXM6IGxhc3RJZGVhbFN0eWxlcywgbGFzdElkZWFsVmVsb2NpdGllczogbGFzdElkZWFsVmVsb2NpdGllcyB9KTtcbiAgICB9XG4gIH0sXG5cbiAgc3RhcnRBbmltYXRpb25JZk5lY2Vzc2FyeTogZnVuY3Rpb24gc3RhcnRBbmltYXRpb25JZk5lY2Vzc2FyeSgpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgLy8gVE9ETzogd2hlbiBjb25maWcgaXMge2E6IDEwfSBhbmQgZGVzdCBpcyB7YTogMTB9IGRvIHdlIHJhZiBvbmNlIGFuZFxuICAgIC8vIGNhbGwgY2I/IE5vLCBvdGhlcndpc2UgYWNjaWRlbnRhbCBwYXJlbnQgcmVyZW5kZXIgY2F1c2VzIGNiIHRyaWdnZXJcbiAgICB0aGlzLmFuaW1hdGlvbklEID0gX3JhZjJbJ2RlZmF1bHQnXShmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgZGVzdFN0eWxlcyA9IF90aGlzLnByb3BzLnN0eWxlcyhfdGhpcy5zdGF0ZS5sYXN0SWRlYWxTdHlsZXMpO1xuXG4gICAgICAvLyBjaGVjayBpZiB3ZSBuZWVkIHRvIGFuaW1hdGUgaW4gdGhlIGZpcnN0IHBsYWNlXG4gICAgICBpZiAoc2hvdWxkU3RvcEFuaW1hdGlvbkFsbChfdGhpcy5zdGF0ZS5jdXJyZW50U3R5bGVzLCBkZXN0U3R5bGVzLCBfdGhpcy5zdGF0ZS5jdXJyZW50VmVsb2NpdGllcykpIHtcbiAgICAgICAgLy8gbm8gbmVlZCB0byBjYW5jZWwgYW5pbWF0aW9uSUQgaGVyZTsgc2hvdWxkbid0IGhhdmUgYW55IGluIGZsaWdodFxuICAgICAgICBfdGhpcy5hbmltYXRpb25JRCA9IG51bGw7XG4gICAgICAgIF90aGlzLmFjY3VtdWxhdGVkVGltZSA9IDA7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGN1cnJlbnRUaW1lID0gX3BlcmZvcm1hbmNlTm93MlsnZGVmYXVsdCddKCk7XG4gICAgICB2YXIgdGltZURlbHRhID0gY3VycmVudFRpbWUgLSBfdGhpcy5wcmV2VGltZTtcbiAgICAgIF90aGlzLnByZXZUaW1lID0gY3VycmVudFRpbWU7XG4gICAgICBfdGhpcy5hY2N1bXVsYXRlZFRpbWUgPSBfdGhpcy5hY2N1bXVsYXRlZFRpbWUgKyB0aW1lRGVsdGE7XG4gICAgICAvLyBtb3JlIHRoYW4gMTAgZnJhbWVzPyBwcm9sbHkgc3dpdGNoZWQgYnJvd3NlciB0YWIuIFJlc3RhcnRcbiAgICAgIGlmIChfdGhpcy5hY2N1bXVsYXRlZFRpbWUgPiBtc1BlckZyYW1lICogMTApIHtcbiAgICAgICAgX3RoaXMuYWNjdW11bGF0ZWRUaW1lID0gMDtcbiAgICAgIH1cblxuICAgICAgaWYgKF90aGlzLmFjY3VtdWxhdGVkVGltZSA9PT0gMCkge1xuICAgICAgICAvLyBubyBuZWVkIHRvIGNhbmNlbCBhbmltYXRpb25JRCBoZXJlOyBzaG91bGRuJ3QgaGF2ZSBhbnkgaW4gZmxpZ2h0XG4gICAgICAgIF90aGlzLmFuaW1hdGlvbklEID0gbnVsbDtcbiAgICAgICAgX3RoaXMuc3RhcnRBbmltYXRpb25JZk5lY2Vzc2FyeSgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBjdXJyZW50RnJhbWVDb21wbGV0aW9uID0gKF90aGlzLmFjY3VtdWxhdGVkVGltZSAtIE1hdGguZmxvb3IoX3RoaXMuYWNjdW11bGF0ZWRUaW1lIC8gbXNQZXJGcmFtZSkgKiBtc1BlckZyYW1lKSAvIG1zUGVyRnJhbWU7XG4gICAgICB2YXIgZnJhbWVzVG9DYXRjaFVwID0gTWF0aC5mbG9vcihfdGhpcy5hY2N1bXVsYXRlZFRpbWUgLyBtc1BlckZyYW1lKTtcblxuICAgICAgdmFyIG5ld0xhc3RJZGVhbFN0eWxlcyA9IFtdO1xuICAgICAgdmFyIG5ld0xhc3RJZGVhbFZlbG9jaXRpZXMgPSBbXTtcbiAgICAgIHZhciBuZXdDdXJyZW50U3R5bGVzID0gW107XG4gICAgICB2YXIgbmV3Q3VycmVudFZlbG9jaXRpZXMgPSBbXTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkZXN0U3R5bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBkZXN0U3R5bGUgPSBkZXN0U3R5bGVzW2ldO1xuICAgICAgICB2YXIgbmV3Q3VycmVudFN0eWxlID0ge307XG4gICAgICAgIHZhciBuZXdDdXJyZW50VmVsb2NpdHkgPSB7fTtcbiAgICAgICAgdmFyIG5ld0xhc3RJZGVhbFN0eWxlID0ge307XG4gICAgICAgIHZhciBuZXdMYXN0SWRlYWxWZWxvY2l0eSA9IHt9O1xuXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBkZXN0U3R5bGUpIHtcbiAgICAgICAgICBpZiAoIWRlc3RTdHlsZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgc3R5bGVWYWx1ZSA9IGRlc3RTdHlsZVtrZXldO1xuICAgICAgICAgIGlmICh0eXBlb2Ygc3R5bGVWYWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIG5ld0N1cnJlbnRTdHlsZVtrZXldID0gc3R5bGVWYWx1ZTtcbiAgICAgICAgICAgIG5ld0N1cnJlbnRWZWxvY2l0eVtrZXldID0gMDtcbiAgICAgICAgICAgIG5ld0xhc3RJZGVhbFN0eWxlW2tleV0gPSBzdHlsZVZhbHVlO1xuICAgICAgICAgICAgbmV3TGFzdElkZWFsVmVsb2NpdHlba2V5XSA9IDA7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBuZXdMYXN0SWRlYWxTdHlsZVZhbHVlID0gX3RoaXMuc3RhdGUubGFzdElkZWFsU3R5bGVzW2ldW2tleV07XG4gICAgICAgICAgICB2YXIgbmV3TGFzdElkZWFsVmVsb2NpdHlWYWx1ZSA9IF90aGlzLnN0YXRlLmxhc3RJZGVhbFZlbG9jaXRpZXNbaV1ba2V5XTtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgZnJhbWVzVG9DYXRjaFVwOyBqKyspIHtcbiAgICAgICAgICAgICAgdmFyIF9zdGVwcGVyID0gX3N0ZXBwZXI0WydkZWZhdWx0J10obXNQZXJGcmFtZSAvIDEwMDAsIG5ld0xhc3RJZGVhbFN0eWxlVmFsdWUsIG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWUsIHN0eWxlVmFsdWUudmFsLCBzdHlsZVZhbHVlLnN0aWZmbmVzcywgc3R5bGVWYWx1ZS5kYW1waW5nLCBzdHlsZVZhbHVlLnByZWNpc2lvbik7XG5cbiAgICAgICAgICAgICAgbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSA9IF9zdGVwcGVyWzBdO1xuICAgICAgICAgICAgICBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlID0gX3N0ZXBwZXJbMV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBfc3RlcHBlcjIgPSBfc3RlcHBlcjRbJ2RlZmF1bHQnXShtc1BlckZyYW1lIC8gMTAwMCwgbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSwgbmV3TGFzdElkZWFsVmVsb2NpdHlWYWx1ZSwgc3R5bGVWYWx1ZS52YWwsIHN0eWxlVmFsdWUuc3RpZmZuZXNzLCBzdHlsZVZhbHVlLmRhbXBpbmcsIHN0eWxlVmFsdWUucHJlY2lzaW9uKTtcblxuICAgICAgICAgICAgdmFyIG5leHRJZGVhbFggPSBfc3RlcHBlcjJbMF07XG4gICAgICAgICAgICB2YXIgbmV4dElkZWFsViA9IF9zdGVwcGVyMlsxXTtcblxuICAgICAgICAgICAgbmV3Q3VycmVudFN0eWxlW2tleV0gPSBuZXdMYXN0SWRlYWxTdHlsZVZhbHVlICsgKG5leHRJZGVhbFggLSBuZXdMYXN0SWRlYWxTdHlsZVZhbHVlKSAqIGN1cnJlbnRGcmFtZUNvbXBsZXRpb247XG4gICAgICAgICAgICBuZXdDdXJyZW50VmVsb2NpdHlba2V5XSA9IG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWUgKyAobmV4dElkZWFsViAtIG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWUpICogY3VycmVudEZyYW1lQ29tcGxldGlvbjtcbiAgICAgICAgICAgIG5ld0xhc3RJZGVhbFN0eWxlW2tleV0gPSBuZXdMYXN0SWRlYWxTdHlsZVZhbHVlO1xuICAgICAgICAgICAgbmV3TGFzdElkZWFsVmVsb2NpdHlba2V5XSA9IG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbmV3Q3VycmVudFN0eWxlc1tpXSA9IG5ld0N1cnJlbnRTdHlsZTtcbiAgICAgICAgbmV3Q3VycmVudFZlbG9jaXRpZXNbaV0gPSBuZXdDdXJyZW50VmVsb2NpdHk7XG4gICAgICAgIG5ld0xhc3RJZGVhbFN0eWxlc1tpXSA9IG5ld0xhc3RJZGVhbFN0eWxlO1xuICAgICAgICBuZXdMYXN0SWRlYWxWZWxvY2l0aWVzW2ldID0gbmV3TGFzdElkZWFsVmVsb2NpdHk7XG4gICAgICB9XG5cbiAgICAgIF90aGlzLmFuaW1hdGlvbklEID0gbnVsbDtcbiAgICAgIC8vIHRoZSBhbW91bnQgd2UncmUgbG9vcGVkIG92ZXIgYWJvdmVcbiAgICAgIF90aGlzLmFjY3VtdWxhdGVkVGltZSAtPSBmcmFtZXNUb0NhdGNoVXAgKiBtc1BlckZyYW1lO1xuXG4gICAgICBfdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGN1cnJlbnRTdHlsZXM6IG5ld0N1cnJlbnRTdHlsZXMsXG4gICAgICAgIGN1cnJlbnRWZWxvY2l0aWVzOiBuZXdDdXJyZW50VmVsb2NpdGllcyxcbiAgICAgICAgbGFzdElkZWFsU3R5bGVzOiBuZXdMYXN0SWRlYWxTdHlsZXMsXG4gICAgICAgIGxhc3RJZGVhbFZlbG9jaXRpZXM6IG5ld0xhc3RJZGVhbFZlbG9jaXRpZXNcbiAgICAgIH0pO1xuXG4gICAgICBfdGhpcy51bnJlYWRQcm9wU3R5bGVzID0gbnVsbDtcblxuICAgICAgX3RoaXMuc3RhcnRBbmltYXRpb25JZk5lY2Vzc2FyeSgpO1xuICAgIH0pO1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLnByZXZUaW1lID0gX3BlcmZvcm1hbmNlTm93MlsnZGVmYXVsdCddKCk7XG4gICAgdGhpcy5zdGFydEFuaW1hdGlvbklmTmVjZXNzYXJ5KCk7XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24gY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhwcm9wcykge1xuICAgIGlmICh0aGlzLnVucmVhZFByb3BTdHlsZXMgIT0gbnVsbCkge1xuICAgICAgLy8gcHJldmlvdXMgcHJvcHMgaGF2ZW4ndCBoYWQgdGhlIGNoYW5jZSB0byBiZSBzZXQgeWV0OyBzZXQgdGhlbSBoZXJlXG4gICAgICB0aGlzLmNsZWFyVW5yZWFkUHJvcFN0eWxlKHRoaXMudW5yZWFkUHJvcFN0eWxlcyk7XG4gICAgfVxuXG4gICAgdGhpcy51bnJlYWRQcm9wU3R5bGVzID0gcHJvcHMuc3R5bGVzKHRoaXMuc3RhdGUubGFzdElkZWFsU3R5bGVzKTtcbiAgICBpZiAodGhpcy5hbmltYXRpb25JRCA9PSBudWxsKSB7XG4gICAgICB0aGlzLnByZXZUaW1lID0gX3BlcmZvcm1hbmNlTm93MlsnZGVmYXVsdCddKCk7XG4gICAgICB0aGlzLnN0YXJ0QW5pbWF0aW9uSWZOZWNlc3NhcnkoKTtcbiAgICB9XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIGlmICh0aGlzLmFuaW1hdGlvbklEICE9IG51bGwpIHtcbiAgICAgIF9yYWYyWydkZWZhdWx0J10uY2FuY2VsKHRoaXMuYW5pbWF0aW9uSUQpO1xuICAgICAgdGhpcy5hbmltYXRpb25JRCA9IG51bGw7XG4gICAgfVxuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHZhciByZW5kZXJlZENoaWxkcmVuID0gdGhpcy5wcm9wcy5jaGlsZHJlbih0aGlzLnN0YXRlLmN1cnJlbnRTdHlsZXMpO1xuICAgIHJldHVybiByZW5kZXJlZENoaWxkcmVuICYmIF9yZWFjdDJbJ2RlZmF1bHQnXS5DaGlsZHJlbi5vbmx5KHJlbmRlcmVkQ2hpbGRyZW4pO1xuICB9XG59KTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gU3RhZ2dlcmVkTW90aW9uO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfbWFwVG9aZXJvID0gcmVxdWlyZSgnLi9tYXBUb1plcm8nKTtcblxudmFyIF9tYXBUb1plcm8yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbWFwVG9aZXJvKTtcblxudmFyIF9zdHJpcFN0eWxlID0gcmVxdWlyZSgnLi9zdHJpcFN0eWxlJyk7XG5cbnZhciBfc3RyaXBTdHlsZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zdHJpcFN0eWxlKTtcblxudmFyIF9zdGVwcGVyMyA9IHJlcXVpcmUoJy4vc3RlcHBlcicpO1xuXG52YXIgX3N0ZXBwZXI0ID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc3RlcHBlcjMpO1xuXG52YXIgX21lcmdlRGlmZiA9IHJlcXVpcmUoJy4vbWVyZ2VEaWZmJyk7XG5cbnZhciBfbWVyZ2VEaWZmMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX21lcmdlRGlmZik7XG5cbnZhciBfcGVyZm9ybWFuY2VOb3cgPSByZXF1aXJlKCdwZXJmb3JtYW5jZS1ub3cnKTtcblxudmFyIF9wZXJmb3JtYW5jZU5vdzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wZXJmb3JtYW5jZU5vdyk7XG5cbnZhciBfcmFmID0gcmVxdWlyZSgncmFmJyk7XG5cbnZhciBfcmFmMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JhZik7XG5cbnZhciBfc2hvdWxkU3RvcEFuaW1hdGlvbiA9IHJlcXVpcmUoJy4vc2hvdWxkU3RvcEFuaW1hdGlvbicpO1xuXG52YXIgX3Nob3VsZFN0b3BBbmltYXRpb24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc2hvdWxkU3RvcEFuaW1hdGlvbik7XG5cbnZhciBfcmVhY3QgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snUmVhY3QnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1JlYWN0J10gOiBudWxsKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBtc1BlckZyYW1lID0gMTAwMCAvIDYwO1xuXG4vLyB0aGUgY2hpbGRyZW4gZnVuY3Rpb24gJiAocG90ZW50aWFsKSBzdHlsZXMgZnVuY3Rpb24gYXNrcyBhcyBwYXJhbSBhblxuLy8gQXJyYXk8VHJhbnNpdGlvblBsYWluU3R5bGU+LCB3aGVyZSBlYWNoIFRyYW5zaXRpb25QbGFpblN0eWxlIGlzIG9mIHRoZSBmb3JtYXRcbi8vIHtrZXk6IHN0cmluZywgZGF0YT86IGFueSwgc3R5bGU6IFBsYWluU3R5bGV9LiBIb3dldmVyLCB0aGUgd2F5IHdlIGtlZXBcbi8vIGludGVybmFsIHN0YXRlcyBkb2Vzbid0IGNvbnRhaW4gc3VjaCBhIGRhdGEgc3RydWN0dXJlIChjaGVjayB0aGUgc3RhdGUgYW5kXG4vLyBUcmFuc2l0aW9uTW90aW9uU3RhdGUpLiBTbyB3aGVuIGNoaWxkcmVuIGZ1bmN0aW9uIGFuZCBvdGhlcnMgYXNrIGZvciBzdWNoXG4vLyBkYXRhIHdlIG5lZWQgdG8gZ2VuZXJhdGUgdGhlbSBvbiB0aGUgZmx5IGJ5IGNvbWJpbmluZyBtZXJnZWRQcm9wc1N0eWxlcyBhbmRcbi8vIGN1cnJlbnRTdHlsZXMvbGFzdElkZWFsU3R5bGVzXG5mdW5jdGlvbiByZWh5ZHJhdGVTdHlsZXMobWVyZ2VkUHJvcHNTdHlsZXMsIHVucmVhZFByb3BTdHlsZXMsIHBsYWluU3R5bGVzKSB7XG4gIGlmICh1bnJlYWRQcm9wU3R5bGVzID09IG51bGwpIHtcbiAgICAvLyAkRmxvd0ZpeE1lXG4gICAgcmV0dXJuIG1lcmdlZFByb3BzU3R5bGVzLm1hcChmdW5jdGlvbiAobWVyZ2VkUHJvcHNTdHlsZSwgaSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAga2V5OiBtZXJnZWRQcm9wc1N0eWxlLmtleSxcbiAgICAgICAgZGF0YTogbWVyZ2VkUHJvcHNTdHlsZS5kYXRhLFxuICAgICAgICBzdHlsZTogcGxhaW5TdHlsZXNbaV1cbiAgICAgIH07XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIG1lcmdlZFByb3BzU3R5bGVzLm1hcChmdW5jdGlvbiAobWVyZ2VkUHJvcHNTdHlsZSwgaSkge1xuICAgIC8vICRGbG93Rml4TWVcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IHVucmVhZFByb3BTdHlsZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgIC8vICRGbG93Rml4TWVcbiAgICAgIGlmICh1bnJlYWRQcm9wU3R5bGVzW2pdLmtleSA9PT0gbWVyZ2VkUHJvcHNTdHlsZS5rZXkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAvLyAkRmxvd0ZpeE1lXG4gICAgICAgICAga2V5OiB1bnJlYWRQcm9wU3R5bGVzW2pdLmtleSxcbiAgICAgICAgICBkYXRhOiB1bnJlYWRQcm9wU3R5bGVzW2pdLmRhdGEsXG4gICAgICAgICAgc3R5bGU6IHBsYWluU3R5bGVzW2ldXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICAgIC8vICRGbG93Rml4TWVcbiAgICByZXR1cm4geyBrZXk6IG1lcmdlZFByb3BzU3R5bGUua2V5LCBkYXRhOiBtZXJnZWRQcm9wc1N0eWxlLmRhdGEsIHN0eWxlOiBwbGFpblN0eWxlc1tpXSB9O1xuICB9KTtcbn1cblxuZnVuY3Rpb24gc2hvdWxkU3RvcEFuaW1hdGlvbkFsbChjdXJyZW50U3R5bGVzLCBkZXN0U3R5bGVzLCBjdXJyZW50VmVsb2NpdGllcywgbWVyZ2VkUHJvcHNTdHlsZXMpIHtcbiAgaWYgKG1lcmdlZFByb3BzU3R5bGVzLmxlbmd0aCAhPT0gZGVzdFN0eWxlcy5sZW5ndGgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IG1lcmdlZFByb3BzU3R5bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKG1lcmdlZFByb3BzU3R5bGVzW2ldLmtleSAhPT0gZGVzdFN0eWxlc1tpXS5rZXkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvLyB3ZSBoYXZlIHRoZSBpbnZhcmlhbnQgdGhhdCBtZXJnZWRQcm9wc1N0eWxlcyBhbmRcbiAgLy8gY3VycmVudFN0eWxlcy9jdXJyZW50VmVsb2NpdGllcy9sYXN0KiBhcmUgc3luY2VkIGluIHRlcm1zIG9mIGNlbGxzLCBzZWVcbiAgLy8gbWVyZ2VBbmRTeW5jIGNvbW1lbnQgZm9yIG1vcmUgaW5mb1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG1lcmdlZFByb3BzU3R5bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKCFfc2hvdWxkU3RvcEFuaW1hdGlvbjJbJ2RlZmF1bHQnXShjdXJyZW50U3R5bGVzW2ldLCBkZXN0U3R5bGVzW2ldLnN0eWxlLCBjdXJyZW50VmVsb2NpdGllc1tpXSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLy8gY29yZSBrZXkgbWVyZ2luZyBsb2dpY1xuXG4vLyB0aGluZ3MgdG8gZG86IHNheSBwcmV2aW91c2x5IG1lcmdlZCBzdHlsZSBpcyB7YSwgYn0sIGRlc3Qgc3R5bGUgKHByb3ApIGlzIHtiLFxuLy8gY30sIHByZXZpb3VzIGN1cnJlbnQgKGludGVycG9sYXRpbmcpIHN0eWxlIGlzIHthLCBifVxuLy8gKippbnZhcmlhbnQqKjogY3VycmVudFtpXSBjb3JyZXNwb25kcyB0byBtZXJnZWRbaV0gaW4gdGVybXMgb2Yga2V5XG5cbi8vIHN0ZXBzOlxuLy8gdHVybiBtZXJnZWQgc3R5bGUgaW50byB7YT8sIGIsIGN9XG4vLyAgICBhZGQgYywgdmFsdWUgb2YgYyBpcyBkZXN0U3R5bGVzLmNcbi8vICAgIG1heWJlIHJlbW92ZSBhLCBha2EgY2FsbCB3aWxsTGVhdmUoYSksIHRoZW4gbWVyZ2VkIGlzIGVpdGhlciB7YiwgY30gb3Ige2EsIGIsIGN9XG4vLyB0dXJuIGN1cnJlbnQgKGludGVycG9sYXRpbmcpIHN0eWxlIGZyb20ge2EsIGJ9IGludG8ge2E/LCBiLCBjfVxuLy8gICAgbWF5YmUgcmVtb3ZlIGFcbi8vICAgIGNlcnRhaW5seSBhZGQgYywgdmFsdWUgb2YgYyBpcyB3aWxsRW50ZXIoYylcbi8vIGxvb3Agb3ZlciBtZXJnZWQgYW5kIGNvbnN0cnVjdCBuZXcgY3VycmVudFxuLy8gZGVzdCBkb2Vzbid0IGNoYW5nZSwgdGhhdCdzIG93bmVyJ3NcbmZ1bmN0aW9uIG1lcmdlQW5kU3luYyh3aWxsRW50ZXIsIHdpbGxMZWF2ZSwgb2xkTWVyZ2VkUHJvcHNTdHlsZXMsIGRlc3RTdHlsZXMsIG9sZEN1cnJlbnRTdHlsZXMsIG9sZEN1cnJlbnRWZWxvY2l0aWVzLCBvbGRMYXN0SWRlYWxTdHlsZXMsIG9sZExhc3RJZGVhbFZlbG9jaXRpZXMpIHtcbiAgdmFyIG5ld01lcmdlZFByb3BzU3R5bGVzID0gX21lcmdlRGlmZjJbJ2RlZmF1bHQnXShvbGRNZXJnZWRQcm9wc1N0eWxlcywgZGVzdFN0eWxlcywgZnVuY3Rpb24gKG9sZEluZGV4LCBvbGRNZXJnZWRQcm9wc1N0eWxlKSB7XG4gICAgdmFyIGxlYXZpbmdTdHlsZSA9IHdpbGxMZWF2ZShvbGRNZXJnZWRQcm9wc1N0eWxlKTtcbiAgICBpZiAobGVhdmluZ1N0eWxlID09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoX3Nob3VsZFN0b3BBbmltYXRpb24yWydkZWZhdWx0J10ob2xkQ3VycmVudFN0eWxlc1tvbGRJbmRleF0sIGxlYXZpbmdTdHlsZSwgb2xkQ3VycmVudFZlbG9jaXRpZXNbb2xkSW5kZXhdKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB7IGtleTogb2xkTWVyZ2VkUHJvcHNTdHlsZS5rZXksIGRhdGE6IG9sZE1lcmdlZFByb3BzU3R5bGUuZGF0YSwgc3R5bGU6IGxlYXZpbmdTdHlsZSB9O1xuICB9KTtcblxuICB2YXIgbmV3Q3VycmVudFN0eWxlcyA9IFtdO1xuICB2YXIgbmV3Q3VycmVudFZlbG9jaXRpZXMgPSBbXTtcbiAgdmFyIG5ld0xhc3RJZGVhbFN0eWxlcyA9IFtdO1xuICB2YXIgbmV3TGFzdElkZWFsVmVsb2NpdGllcyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG5ld01lcmdlZFByb3BzU3R5bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIG5ld01lcmdlZFByb3BzU3R5bGVDZWxsID0gbmV3TWVyZ2VkUHJvcHNTdHlsZXNbaV07XG4gICAgdmFyIGZvdW5kT2xkSW5kZXggPSBudWxsO1xuICAgIGZvciAodmFyIGogPSAwOyBqIDwgb2xkTWVyZ2VkUHJvcHNTdHlsZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgIGlmIChvbGRNZXJnZWRQcm9wc1N0eWxlc1tqXS5rZXkgPT09IG5ld01lcmdlZFByb3BzU3R5bGVDZWxsLmtleSkge1xuICAgICAgICBmb3VuZE9sZEluZGV4ID0gajtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIFRPRE86IGtleSBzZWFyY2ggY29kZVxuICAgIGlmIChmb3VuZE9sZEluZGV4ID09IG51bGwpIHtcbiAgICAgIHZhciBwbGFpblN0eWxlID0gd2lsbEVudGVyKG5ld01lcmdlZFByb3BzU3R5bGVDZWxsKTtcbiAgICAgIG5ld0N1cnJlbnRTdHlsZXNbaV0gPSBwbGFpblN0eWxlO1xuICAgICAgbmV3TGFzdElkZWFsU3R5bGVzW2ldID0gcGxhaW5TdHlsZTtcblxuICAgICAgLy8gJEZsb3dGaXhNZVxuICAgICAgdmFyIHZlbG9jaXR5ID0gX21hcFRvWmVybzJbJ2RlZmF1bHQnXShuZXdNZXJnZWRQcm9wc1N0eWxlQ2VsbC5zdHlsZSk7XG4gICAgICBuZXdDdXJyZW50VmVsb2NpdGllc1tpXSA9IHZlbG9jaXR5O1xuICAgICAgbmV3TGFzdElkZWFsVmVsb2NpdGllc1tpXSA9IHZlbG9jaXR5O1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXdDdXJyZW50U3R5bGVzW2ldID0gb2xkQ3VycmVudFN0eWxlc1tmb3VuZE9sZEluZGV4XTtcbiAgICAgIG5ld0xhc3RJZGVhbFN0eWxlc1tpXSA9IG9sZExhc3RJZGVhbFN0eWxlc1tmb3VuZE9sZEluZGV4XTtcbiAgICAgIG5ld0N1cnJlbnRWZWxvY2l0aWVzW2ldID0gb2xkQ3VycmVudFZlbG9jaXRpZXNbZm91bmRPbGRJbmRleF07XG4gICAgICBuZXdMYXN0SWRlYWxWZWxvY2l0aWVzW2ldID0gb2xkTGFzdElkZWFsVmVsb2NpdGllc1tmb3VuZE9sZEluZGV4XTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gW25ld01lcmdlZFByb3BzU3R5bGVzLCBuZXdDdXJyZW50U3R5bGVzLCBuZXdDdXJyZW50VmVsb2NpdGllcywgbmV3TGFzdElkZWFsU3R5bGVzLCBuZXdMYXN0SWRlYWxWZWxvY2l0aWVzXTtcbn1cblxudmFyIFRyYW5zaXRpb25Nb3Rpb24gPSBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ1RyYW5zaXRpb25Nb3Rpb24nLFxuXG4gIHByb3BUeXBlczoge1xuICAgIGRlZmF1bHRTdHlsZXM6IF9yZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihfcmVhY3QuUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGtleTogX3JlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIGRhdGE6IF9yZWFjdC5Qcm9wVHlwZXMuYW55LFxuICAgICAgc3R5bGU6IF9yZWFjdC5Qcm9wVHlwZXMub2JqZWN0T2YoX3JlYWN0LlByb3BUeXBlcy5udW1iZXIpLmlzUmVxdWlyZWRcbiAgICB9KSksXG4gICAgc3R5bGVzOiBfcmVhY3QuUHJvcFR5cGVzLm9uZU9mVHlwZShbX3JlYWN0LlByb3BUeXBlcy5mdW5jLCBfcmVhY3QuUHJvcFR5cGVzLmFycmF5T2YoX3JlYWN0LlByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBrZXk6IF9yZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICBkYXRhOiBfcmVhY3QuUHJvcFR5cGVzLmFueSxcbiAgICAgIHN0eWxlOiBfcmVhY3QuUHJvcFR5cGVzLm9iamVjdE9mKF9yZWFjdC5Qcm9wVHlwZXMub25lT2ZUeXBlKFtfcmVhY3QuUHJvcFR5cGVzLm51bWJlciwgX3JlYWN0LlByb3BUeXBlcy5vYmplY3RdKSkuaXNSZXF1aXJlZFxuICAgIH0pKV0pLmlzUmVxdWlyZWQsXG4gICAgY2hpbGRyZW46IF9yZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHdpbGxMZWF2ZTogX3JlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgIHdpbGxFbnRlcjogX3JlYWN0LlByb3BUeXBlcy5mdW5jXG4gIH0sXG5cbiAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbiBnZXREZWZhdWx0UHJvcHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHdpbGxFbnRlcjogZnVuY3Rpb24gd2lsbEVudGVyKHN0eWxlVGhhdEVudGVyZWQpIHtcbiAgICAgICAgcmV0dXJuIF9zdHJpcFN0eWxlMlsnZGVmYXVsdCddKHN0eWxlVGhhdEVudGVyZWQuc3R5bGUpO1xuICAgICAgfSxcbiAgICAgIC8vIHJlY2FsbDogcmV0dXJuaW5nIG51bGwgbWFrZXMgdGhlIGN1cnJlbnQgdW5tb3VudGluZyBUcmFuc2l0aW9uU3R5bGVcbiAgICAgIC8vIGRpc2FwcGVhciBpbW1lZGlhdGVseVxuICAgICAgd2lsbExlYXZlOiBmdW5jdGlvbiB3aWxsTGVhdmUoKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH07XG4gIH0sXG5cbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgdmFyIF9wcm9wcyA9IHRoaXMucHJvcHM7XG4gICAgdmFyIGRlZmF1bHRTdHlsZXMgPSBfcHJvcHMuZGVmYXVsdFN0eWxlcztcbiAgICB2YXIgc3R5bGVzID0gX3Byb3BzLnN0eWxlcztcbiAgICB2YXIgd2lsbEVudGVyID0gX3Byb3BzLndpbGxFbnRlcjtcbiAgICB2YXIgd2lsbExlYXZlID0gX3Byb3BzLndpbGxMZWF2ZTtcblxuICAgIHZhciBkZXN0U3R5bGVzID0gdHlwZW9mIHN0eWxlcyA9PT0gJ2Z1bmN0aW9uJyA/IHN0eWxlcyhkZWZhdWx0U3R5bGVzKSA6IHN0eWxlcztcblxuICAgIC8vIHRoaXMgaXMgc3BlY2lhbC4gZm9yIHRoZSBmaXJzdCB0aW1lIGFyb3VuZCwgd2UgZG9uJ3QgaGF2ZSBhIGNvbXBhcmlzb25cbiAgICAvLyBiZXR3ZWVuIGxhc3QgKG5vIGxhc3QpIGFuZCBjdXJyZW50IG1lcmdlZCBwcm9wcy4gd2UnbGwgY29tcHV0ZSBsYXN0IHNvOlxuICAgIC8vIHNheSBkZWZhdWx0IGlzIHthLCBifSBhbmQgc3R5bGVzIChkZXN0IHN0eWxlKSBpcyB7YiwgY30sIHdlJ2xsXG4gICAgLy8gZmFicmljYXRlIGxhc3QgYXMge2EsIGJ9XG4gICAgdmFyIG9sZE1lcmdlZFByb3BzU3R5bGVzID0gdW5kZWZpbmVkO1xuICAgIGlmIChkZWZhdWx0U3R5bGVzID09IG51bGwpIHtcbiAgICAgIG9sZE1lcmdlZFByb3BzU3R5bGVzID0gZGVzdFN0eWxlcztcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gJEZsb3dGaXhNZVxuICAgICAgb2xkTWVyZ2VkUHJvcHNTdHlsZXMgPSBkZWZhdWx0U3R5bGVzLm1hcChmdW5jdGlvbiAoZGVmYXVsdFN0eWxlQ2VsbCkge1xuICAgICAgICAvLyBUT0RPOiBrZXkgc2VhcmNoIGNvZGVcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkZXN0U3R5bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKGRlc3RTdHlsZXNbaV0ua2V5ID09PSBkZWZhdWx0U3R5bGVDZWxsLmtleSkge1xuICAgICAgICAgICAgcmV0dXJuIGRlc3RTdHlsZXNbaV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZWZhdWx0U3R5bGVDZWxsO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHZhciBvbGRDdXJyZW50U3R5bGVzID0gZGVmYXVsdFN0eWxlcyA9PSBudWxsID8gZGVzdFN0eWxlcy5tYXAoZnVuY3Rpb24gKHMpIHtcbiAgICAgIHJldHVybiBfc3RyaXBTdHlsZTJbJ2RlZmF1bHQnXShzLnN0eWxlKTtcbiAgICB9KSA6IGRlZmF1bHRTdHlsZXMubWFwKGZ1bmN0aW9uIChzKSB7XG4gICAgICByZXR1cm4gX3N0cmlwU3R5bGUyWydkZWZhdWx0J10ocy5zdHlsZSk7XG4gICAgfSk7XG4gICAgdmFyIG9sZEN1cnJlbnRWZWxvY2l0aWVzID0gZGVmYXVsdFN0eWxlcyA9PSBudWxsID8gZGVzdFN0eWxlcy5tYXAoZnVuY3Rpb24gKHMpIHtcbiAgICAgIHJldHVybiBfbWFwVG9aZXJvMlsnZGVmYXVsdCddKHMuc3R5bGUpO1xuICAgIH0pIDogZGVmYXVsdFN0eWxlcy5tYXAoZnVuY3Rpb24gKHMpIHtcbiAgICAgIHJldHVybiBfbWFwVG9aZXJvMlsnZGVmYXVsdCddKHMuc3R5bGUpO1xuICAgIH0pO1xuXG4gICAgdmFyIF9tZXJnZUFuZFN5bmMgPSBtZXJnZUFuZFN5bmMoXG4gICAgLy8gJEZsb3dGaXhNZVxuICAgIHdpbGxFbnRlcixcbiAgICAvLyAkRmxvd0ZpeE1lXG4gICAgd2lsbExlYXZlLCBvbGRNZXJnZWRQcm9wc1N0eWxlcywgZGVzdFN0eWxlcywgb2xkQ3VycmVudFN0eWxlcywgb2xkQ3VycmVudFZlbG9jaXRpZXMsIG9sZEN1cnJlbnRTdHlsZXMsIC8vIG9sZExhc3RJZGVhbFN0eWxlcyByZWFsbHlcbiAgICBvbGRDdXJyZW50VmVsb2NpdGllcyk7XG5cbiAgICB2YXIgbWVyZ2VkUHJvcHNTdHlsZXMgPSBfbWVyZ2VBbmRTeW5jWzBdO1xuICAgIHZhciBjdXJyZW50U3R5bGVzID0gX21lcmdlQW5kU3luY1sxXTtcbiAgICB2YXIgY3VycmVudFZlbG9jaXRpZXMgPSBfbWVyZ2VBbmRTeW5jWzJdO1xuICAgIHZhciBsYXN0SWRlYWxTdHlsZXMgPSBfbWVyZ2VBbmRTeW5jWzNdO1xuICAgIHZhciBsYXN0SWRlYWxWZWxvY2l0aWVzID0gX21lcmdlQW5kU3luY1s0XTtcbiAgICAvLyBvbGRMYXN0SWRlYWxWZWxvY2l0aWVzIHJlYWxseVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGN1cnJlbnRTdHlsZXM6IGN1cnJlbnRTdHlsZXMsXG4gICAgICBjdXJyZW50VmVsb2NpdGllczogY3VycmVudFZlbG9jaXRpZXMsXG4gICAgICBsYXN0SWRlYWxTdHlsZXM6IGxhc3RJZGVhbFN0eWxlcyxcbiAgICAgIGxhc3RJZGVhbFZlbG9jaXRpZXM6IGxhc3RJZGVhbFZlbG9jaXRpZXMsXG4gICAgICBtZXJnZWRQcm9wc1N0eWxlczogbWVyZ2VkUHJvcHNTdHlsZXNcbiAgICB9O1xuICB9LFxuXG4gIGFuaW1hdGlvbklEOiBudWxsLFxuICBwcmV2VGltZTogMCxcbiAgYWNjdW11bGF0ZWRUaW1lOiAwLFxuICAvLyBpdCdzIHBvc3NpYmxlIHRoYXQgY3VycmVudFN0eWxlJ3MgdmFsdWUgaXMgc3RhbGU6IGlmIHByb3BzIGlzIGltbWVkaWF0ZWx5XG4gIC8vIGNoYW5nZWQgZnJvbSAwIHRvIDQwMCB0byBzcHJpbmcoMCkgYWdhaW4sIHRoZSBhc3luYyBjdXJyZW50U3R5bGUgaXMgc3RpbGxcbiAgLy8gYXQgMCAoZGlkbid0IGhhdmUgdGltZSB0byB0aWNrIGFuZCBpbnRlcnBvbGF0ZSBldmVuIG9uY2UpLiBJZiB3ZSBuYWl2ZWx5XG4gIC8vIGNvbXBhcmUgY3VycmVudFN0eWxlIHdpdGggZGVzdFZhbCBpdCdsbCBiZSAwID09PSAwIChubyBhbmltYXRpb24sIHN0b3ApLlxuICAvLyBJbiByZWFsaXR5IGN1cnJlbnRTdHlsZSBzaG91bGQgYmUgNDAwXG4gIHVucmVhZFByb3BTdHlsZXM6IG51bGwsXG4gIC8vIGFmdGVyIGNoZWNraW5nIGZvciB1bnJlYWRQcm9wU3R5bGVzICE9IG51bGwsIHdlIG1hbnVhbGx5IGdvIHNldCB0aGVcbiAgLy8gbm9uLWludGVycG9sYXRpbmcgdmFsdWVzICh0aG9zZSB0aGF0IGFyZSBhIG51bWJlciwgd2l0aG91dCBhIHNwcmluZ1xuICAvLyBjb25maWcpXG4gIGNsZWFyVW5yZWFkUHJvcFN0eWxlOiBmdW5jdGlvbiBjbGVhclVucmVhZFByb3BTdHlsZSh1bnJlYWRQcm9wU3R5bGVzKSB7XG4gICAgdmFyIF9tZXJnZUFuZFN5bmMyID0gbWVyZ2VBbmRTeW5jKFxuICAgIC8vICRGbG93Rml4TWVcbiAgICB0aGlzLnByb3BzLndpbGxFbnRlcixcbiAgICAvLyAkRmxvd0ZpeE1lXG4gICAgdGhpcy5wcm9wcy53aWxsTGVhdmUsIHRoaXMuc3RhdGUubWVyZ2VkUHJvcHNTdHlsZXMsIHVucmVhZFByb3BTdHlsZXMsIHRoaXMuc3RhdGUuY3VycmVudFN0eWxlcywgdGhpcy5zdGF0ZS5jdXJyZW50VmVsb2NpdGllcywgdGhpcy5zdGF0ZS5sYXN0SWRlYWxTdHlsZXMsIHRoaXMuc3RhdGUubGFzdElkZWFsVmVsb2NpdGllcyk7XG5cbiAgICB2YXIgbWVyZ2VkUHJvcHNTdHlsZXMgPSBfbWVyZ2VBbmRTeW5jMlswXTtcbiAgICB2YXIgY3VycmVudFN0eWxlcyA9IF9tZXJnZUFuZFN5bmMyWzFdO1xuICAgIHZhciBjdXJyZW50VmVsb2NpdGllcyA9IF9tZXJnZUFuZFN5bmMyWzJdO1xuICAgIHZhciBsYXN0SWRlYWxTdHlsZXMgPSBfbWVyZ2VBbmRTeW5jMlszXTtcbiAgICB2YXIgbGFzdElkZWFsVmVsb2NpdGllcyA9IF9tZXJnZUFuZFN5bmMyWzRdO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB1bnJlYWRQcm9wU3R5bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdW5yZWFkUHJvcFN0eWxlID0gdW5yZWFkUHJvcFN0eWxlc1tpXS5zdHlsZTtcbiAgICAgIHZhciBkaXJ0eSA9IGZhbHNlO1xuXG4gICAgICBmb3IgKHZhciBrZXkgaW4gdW5yZWFkUHJvcFN0eWxlKSB7XG4gICAgICAgIGlmICghdW5yZWFkUHJvcFN0eWxlLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzdHlsZVZhbHVlID0gdW5yZWFkUHJvcFN0eWxlW2tleV07XG4gICAgICAgIGlmICh0eXBlb2Ygc3R5bGVWYWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICBpZiAoIWRpcnR5KSB7XG4gICAgICAgICAgICBkaXJ0eSA9IHRydWU7XG4gICAgICAgICAgICBjdXJyZW50U3R5bGVzW2ldID0gX2V4dGVuZHMoe30sIGN1cnJlbnRTdHlsZXNbaV0pO1xuICAgICAgICAgICAgY3VycmVudFZlbG9jaXRpZXNbaV0gPSBfZXh0ZW5kcyh7fSwgY3VycmVudFZlbG9jaXRpZXNbaV0pO1xuICAgICAgICAgICAgbGFzdElkZWFsU3R5bGVzW2ldID0gX2V4dGVuZHMoe30sIGxhc3RJZGVhbFN0eWxlc1tpXSk7XG4gICAgICAgICAgICBsYXN0SWRlYWxWZWxvY2l0aWVzW2ldID0gX2V4dGVuZHMoe30sIGxhc3RJZGVhbFZlbG9jaXRpZXNbaV0pO1xuICAgICAgICAgICAgbWVyZ2VkUHJvcHNTdHlsZXNbaV0gPSB7XG4gICAgICAgICAgICAgIGtleTogbWVyZ2VkUHJvcHNTdHlsZXNbaV0ua2V5LFxuICAgICAgICAgICAgICBkYXRhOiBtZXJnZWRQcm9wc1N0eWxlc1tpXS5kYXRhLFxuICAgICAgICAgICAgICBzdHlsZTogX2V4dGVuZHMoe30sIG1lcmdlZFByb3BzU3R5bGVzW2ldLnN0eWxlKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY3VycmVudFN0eWxlc1tpXVtrZXldID0gc3R5bGVWYWx1ZTtcbiAgICAgICAgICBjdXJyZW50VmVsb2NpdGllc1tpXVtrZXldID0gMDtcbiAgICAgICAgICBsYXN0SWRlYWxTdHlsZXNbaV1ba2V5XSA9IHN0eWxlVmFsdWU7XG4gICAgICAgICAgbGFzdElkZWFsVmVsb2NpdGllc1tpXVtrZXldID0gMDtcbiAgICAgICAgICBtZXJnZWRQcm9wc1N0eWxlc1tpXS5zdHlsZVtrZXldID0gc3R5bGVWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHVubGlrZSB0aGUgb3RoZXIgMiBjb21wb25lbnRzLCB3ZSBjYW4ndCBkZXRlY3Qgc3RhbGVuZXNzIGFuZCBvcHRpb25hbGx5XG4gICAgLy8gb3B0IG91dCBvZiBzZXRTdGF0ZSBoZXJlLiBlYWNoIHN0eWxlIG9iamVjdCdzIGRhdGEgbWlnaHQgY29udGFpbiBuZXdcbiAgICAvLyBzdHVmZiB3ZSdyZSBub3QvY2Fubm90IGNvbXBhcmVcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGN1cnJlbnRTdHlsZXM6IGN1cnJlbnRTdHlsZXMsXG4gICAgICBjdXJyZW50VmVsb2NpdGllczogY3VycmVudFZlbG9jaXRpZXMsXG4gICAgICBtZXJnZWRQcm9wc1N0eWxlczogbWVyZ2VkUHJvcHNTdHlsZXMsXG4gICAgICBsYXN0SWRlYWxTdHlsZXM6IGxhc3RJZGVhbFN0eWxlcyxcbiAgICAgIGxhc3RJZGVhbFZlbG9jaXRpZXM6IGxhc3RJZGVhbFZlbG9jaXRpZXNcbiAgICB9KTtcbiAgfSxcblxuICBzdGFydEFuaW1hdGlvbklmTmVjZXNzYXJ5OiBmdW5jdGlvbiBzdGFydEFuaW1hdGlvbklmTmVjZXNzYXJ5KCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAvLyBUT0RPOiB3aGVuIGNvbmZpZyBpcyB7YTogMTB9IGFuZCBkZXN0IGlzIHthOiAxMH0gZG8gd2UgcmFmIG9uY2UgYW5kXG4gICAgLy8gY2FsbCBjYj8gTm8sIG90aGVyd2lzZSBhY2NpZGVudGFsIHBhcmVudCByZXJlbmRlciBjYXVzZXMgY2IgdHJpZ2dlclxuICAgIHRoaXMuYW5pbWF0aW9uSUQgPSBfcmFmMlsnZGVmYXVsdCddKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBwcm9wU3R5bGVzID0gX3RoaXMucHJvcHMuc3R5bGVzO1xuICAgICAgdmFyIGRlc3RTdHlsZXMgPSB0eXBlb2YgcHJvcFN0eWxlcyA9PT0gJ2Z1bmN0aW9uJyA/IHByb3BTdHlsZXMocmVoeWRyYXRlU3R5bGVzKF90aGlzLnN0YXRlLm1lcmdlZFByb3BzU3R5bGVzLCBfdGhpcy51bnJlYWRQcm9wU3R5bGVzLCBfdGhpcy5zdGF0ZS5sYXN0SWRlYWxTdHlsZXMpKSA6IHByb3BTdHlsZXM7XG5cbiAgICAgIC8vIGNoZWNrIGlmIHdlIG5lZWQgdG8gYW5pbWF0ZSBpbiB0aGUgZmlyc3QgcGxhY2VcbiAgICAgIGlmIChzaG91bGRTdG9wQW5pbWF0aW9uQWxsKF90aGlzLnN0YXRlLmN1cnJlbnRTdHlsZXMsIGRlc3RTdHlsZXMsIF90aGlzLnN0YXRlLmN1cnJlbnRWZWxvY2l0aWVzLCBfdGhpcy5zdGF0ZS5tZXJnZWRQcm9wc1N0eWxlcykpIHtcbiAgICAgICAgLy8gbm8gbmVlZCB0byBjYW5jZWwgYW5pbWF0aW9uSUQgaGVyZTsgc2hvdWxkbid0IGhhdmUgYW55IGluIGZsaWdodFxuICAgICAgICBfdGhpcy5hbmltYXRpb25JRCA9IG51bGw7XG4gICAgICAgIF90aGlzLmFjY3VtdWxhdGVkVGltZSA9IDA7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGN1cnJlbnRUaW1lID0gX3BlcmZvcm1hbmNlTm93MlsnZGVmYXVsdCddKCk7XG4gICAgICB2YXIgdGltZURlbHRhID0gY3VycmVudFRpbWUgLSBfdGhpcy5wcmV2VGltZTtcbiAgICAgIF90aGlzLnByZXZUaW1lID0gY3VycmVudFRpbWU7XG4gICAgICBfdGhpcy5hY2N1bXVsYXRlZFRpbWUgPSBfdGhpcy5hY2N1bXVsYXRlZFRpbWUgKyB0aW1lRGVsdGE7XG4gICAgICAvLyBtb3JlIHRoYW4gMTAgZnJhbWVzPyBwcm9sbHkgc3dpdGNoZWQgYnJvd3NlciB0YWIuIFJlc3RhcnRcbiAgICAgIGlmIChfdGhpcy5hY2N1bXVsYXRlZFRpbWUgPiBtc1BlckZyYW1lICogMTApIHtcbiAgICAgICAgX3RoaXMuYWNjdW11bGF0ZWRUaW1lID0gMDtcbiAgICAgIH1cblxuICAgICAgaWYgKF90aGlzLmFjY3VtdWxhdGVkVGltZSA9PT0gMCkge1xuICAgICAgICAvLyBubyBuZWVkIHRvIGNhbmNlbCBhbmltYXRpb25JRCBoZXJlOyBzaG91bGRuJ3QgaGF2ZSBhbnkgaW4gZmxpZ2h0XG4gICAgICAgIF90aGlzLmFuaW1hdGlvbklEID0gbnVsbDtcbiAgICAgICAgX3RoaXMuc3RhcnRBbmltYXRpb25JZk5lY2Vzc2FyeSgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBjdXJyZW50RnJhbWVDb21wbGV0aW9uID0gKF90aGlzLmFjY3VtdWxhdGVkVGltZSAtIE1hdGguZmxvb3IoX3RoaXMuYWNjdW11bGF0ZWRUaW1lIC8gbXNQZXJGcmFtZSkgKiBtc1BlckZyYW1lKSAvIG1zUGVyRnJhbWU7XG4gICAgICB2YXIgZnJhbWVzVG9DYXRjaFVwID0gTWF0aC5mbG9vcihfdGhpcy5hY2N1bXVsYXRlZFRpbWUgLyBtc1BlckZyYW1lKTtcblxuICAgICAgdmFyIF9tZXJnZUFuZFN5bmMzID0gbWVyZ2VBbmRTeW5jKFxuICAgICAgLy8gJEZsb3dGaXhNZVxuICAgICAgX3RoaXMucHJvcHMud2lsbEVudGVyLFxuICAgICAgLy8gJEZsb3dGaXhNZVxuICAgICAgX3RoaXMucHJvcHMud2lsbExlYXZlLCBfdGhpcy5zdGF0ZS5tZXJnZWRQcm9wc1N0eWxlcywgZGVzdFN0eWxlcywgX3RoaXMuc3RhdGUuY3VycmVudFN0eWxlcywgX3RoaXMuc3RhdGUuY3VycmVudFZlbG9jaXRpZXMsIF90aGlzLnN0YXRlLmxhc3RJZGVhbFN0eWxlcywgX3RoaXMuc3RhdGUubGFzdElkZWFsVmVsb2NpdGllcyk7XG5cbiAgICAgIHZhciBuZXdNZXJnZWRQcm9wc1N0eWxlcyA9IF9tZXJnZUFuZFN5bmMzWzBdO1xuICAgICAgdmFyIG5ld0N1cnJlbnRTdHlsZXMgPSBfbWVyZ2VBbmRTeW5jM1sxXTtcbiAgICAgIHZhciBuZXdDdXJyZW50VmVsb2NpdGllcyA9IF9tZXJnZUFuZFN5bmMzWzJdO1xuICAgICAgdmFyIG5ld0xhc3RJZGVhbFN0eWxlcyA9IF9tZXJnZUFuZFN5bmMzWzNdO1xuICAgICAgdmFyIG5ld0xhc3RJZGVhbFZlbG9jaXRpZXMgPSBfbWVyZ2VBbmRTeW5jM1s0XTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuZXdNZXJnZWRQcm9wc1N0eWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgbmV3TWVyZ2VkUHJvcHNTdHlsZSA9IG5ld01lcmdlZFByb3BzU3R5bGVzW2ldLnN0eWxlO1xuICAgICAgICB2YXIgbmV3Q3VycmVudFN0eWxlID0ge307XG4gICAgICAgIHZhciBuZXdDdXJyZW50VmVsb2NpdHkgPSB7fTtcbiAgICAgICAgdmFyIG5ld0xhc3RJZGVhbFN0eWxlID0ge307XG4gICAgICAgIHZhciBuZXdMYXN0SWRlYWxWZWxvY2l0eSA9IHt9O1xuXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBuZXdNZXJnZWRQcm9wc1N0eWxlKSB7XG4gICAgICAgICAgaWYgKCFuZXdNZXJnZWRQcm9wc1N0eWxlLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBzdHlsZVZhbHVlID0gbmV3TWVyZ2VkUHJvcHNTdHlsZVtrZXldO1xuICAgICAgICAgIGlmICh0eXBlb2Ygc3R5bGVWYWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIG5ld0N1cnJlbnRTdHlsZVtrZXldID0gc3R5bGVWYWx1ZTtcbiAgICAgICAgICAgIG5ld0N1cnJlbnRWZWxvY2l0eVtrZXldID0gMDtcbiAgICAgICAgICAgIG5ld0xhc3RJZGVhbFN0eWxlW2tleV0gPSBzdHlsZVZhbHVlO1xuICAgICAgICAgICAgbmV3TGFzdElkZWFsVmVsb2NpdHlba2V5XSA9IDA7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBuZXdMYXN0SWRlYWxTdHlsZVZhbHVlID0gbmV3TGFzdElkZWFsU3R5bGVzW2ldW2tleV07XG4gICAgICAgICAgICB2YXIgbmV3TGFzdElkZWFsVmVsb2NpdHlWYWx1ZSA9IG5ld0xhc3RJZGVhbFZlbG9jaXRpZXNbaV1ba2V5XTtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgZnJhbWVzVG9DYXRjaFVwOyBqKyspIHtcbiAgICAgICAgICAgICAgdmFyIF9zdGVwcGVyID0gX3N0ZXBwZXI0WydkZWZhdWx0J10obXNQZXJGcmFtZSAvIDEwMDAsIG5ld0xhc3RJZGVhbFN0eWxlVmFsdWUsIG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWUsIHN0eWxlVmFsdWUudmFsLCBzdHlsZVZhbHVlLnN0aWZmbmVzcywgc3R5bGVWYWx1ZS5kYW1waW5nLCBzdHlsZVZhbHVlLnByZWNpc2lvbik7XG5cbiAgICAgICAgICAgICAgbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSA9IF9zdGVwcGVyWzBdO1xuICAgICAgICAgICAgICBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlID0gX3N0ZXBwZXJbMV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBfc3RlcHBlcjIgPSBfc3RlcHBlcjRbJ2RlZmF1bHQnXShtc1BlckZyYW1lIC8gMTAwMCwgbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSwgbmV3TGFzdElkZWFsVmVsb2NpdHlWYWx1ZSwgc3R5bGVWYWx1ZS52YWwsIHN0eWxlVmFsdWUuc3RpZmZuZXNzLCBzdHlsZVZhbHVlLmRhbXBpbmcsIHN0eWxlVmFsdWUucHJlY2lzaW9uKTtcblxuICAgICAgICAgICAgdmFyIG5leHRJZGVhbFggPSBfc3RlcHBlcjJbMF07XG4gICAgICAgICAgICB2YXIgbmV4dElkZWFsViA9IF9zdGVwcGVyMlsxXTtcblxuICAgICAgICAgICAgbmV3Q3VycmVudFN0eWxlW2tleV0gPSBuZXdMYXN0SWRlYWxTdHlsZVZhbHVlICsgKG5leHRJZGVhbFggLSBuZXdMYXN0SWRlYWxTdHlsZVZhbHVlKSAqIGN1cnJlbnRGcmFtZUNvbXBsZXRpb247XG4gICAgICAgICAgICBuZXdDdXJyZW50VmVsb2NpdHlba2V5XSA9IG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWUgKyAobmV4dElkZWFsViAtIG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWUpICogY3VycmVudEZyYW1lQ29tcGxldGlvbjtcbiAgICAgICAgICAgIG5ld0xhc3RJZGVhbFN0eWxlW2tleV0gPSBuZXdMYXN0SWRlYWxTdHlsZVZhbHVlO1xuICAgICAgICAgICAgbmV3TGFzdElkZWFsVmVsb2NpdHlba2V5XSA9IG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbmV3TGFzdElkZWFsU3R5bGVzW2ldID0gbmV3TGFzdElkZWFsU3R5bGU7XG4gICAgICAgIG5ld0xhc3RJZGVhbFZlbG9jaXRpZXNbaV0gPSBuZXdMYXN0SWRlYWxWZWxvY2l0eTtcbiAgICAgICAgbmV3Q3VycmVudFN0eWxlc1tpXSA9IG5ld0N1cnJlbnRTdHlsZTtcbiAgICAgICAgbmV3Q3VycmVudFZlbG9jaXRpZXNbaV0gPSBuZXdDdXJyZW50VmVsb2NpdHk7XG4gICAgICB9XG5cbiAgICAgIF90aGlzLmFuaW1hdGlvbklEID0gbnVsbDtcbiAgICAgIC8vIHRoZSBhbW91bnQgd2UncmUgbG9vcGVkIG92ZXIgYWJvdmVcbiAgICAgIF90aGlzLmFjY3VtdWxhdGVkVGltZSAtPSBmcmFtZXNUb0NhdGNoVXAgKiBtc1BlckZyYW1lO1xuXG4gICAgICBfdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGN1cnJlbnRTdHlsZXM6IG5ld0N1cnJlbnRTdHlsZXMsXG4gICAgICAgIGN1cnJlbnRWZWxvY2l0aWVzOiBuZXdDdXJyZW50VmVsb2NpdGllcyxcbiAgICAgICAgbGFzdElkZWFsU3R5bGVzOiBuZXdMYXN0SWRlYWxTdHlsZXMsXG4gICAgICAgIGxhc3RJZGVhbFZlbG9jaXRpZXM6IG5ld0xhc3RJZGVhbFZlbG9jaXRpZXMsXG4gICAgICAgIG1lcmdlZFByb3BzU3R5bGVzOiBuZXdNZXJnZWRQcm9wc1N0eWxlc1xuICAgICAgfSk7XG5cbiAgICAgIF90aGlzLnVucmVhZFByb3BTdHlsZXMgPSBudWxsO1xuXG4gICAgICBfdGhpcy5zdGFydEFuaW1hdGlvbklmTmVjZXNzYXJ5KCk7XG4gICAgfSk7XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMucHJldlRpbWUgPSBfcGVyZm9ybWFuY2VOb3cyWydkZWZhdWx0J10oKTtcbiAgICB0aGlzLnN0YXJ0QW5pbWF0aW9uSWZOZWNlc3NhcnkoKTtcbiAgfSxcblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbiBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKHByb3BzKSB7XG4gICAgaWYgKHRoaXMudW5yZWFkUHJvcFN0eWxlcykge1xuICAgICAgLy8gcHJldmlvdXMgcHJvcHMgaGF2ZW4ndCBoYWQgdGhlIGNoYW5jZSB0byBiZSBzZXQgeWV0OyBzZXQgdGhlbSBoZXJlXG4gICAgICB0aGlzLmNsZWFyVW5yZWFkUHJvcFN0eWxlKHRoaXMudW5yZWFkUHJvcFN0eWxlcyk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBwcm9wcy5zdHlsZXMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIC8vICRGbG93Rml4TWVcbiAgICAgIHRoaXMudW5yZWFkUHJvcFN0eWxlcyA9IHByb3BzLnN0eWxlcyhyZWh5ZHJhdGVTdHlsZXModGhpcy5zdGF0ZS5tZXJnZWRQcm9wc1N0eWxlcywgdGhpcy51bnJlYWRQcm9wU3R5bGVzLCB0aGlzLnN0YXRlLmxhc3RJZGVhbFN0eWxlcykpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnVucmVhZFByb3BTdHlsZXMgPSBwcm9wcy5zdHlsZXM7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuYW5pbWF0aW9uSUQgPT0gbnVsbCkge1xuICAgICAgdGhpcy5wcmV2VGltZSA9IF9wZXJmb3JtYW5jZU5vdzJbJ2RlZmF1bHQnXSgpO1xuICAgICAgdGhpcy5zdGFydEFuaW1hdGlvbklmTmVjZXNzYXJ5KCk7XG4gICAgfVxuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbiBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICBpZiAodGhpcy5hbmltYXRpb25JRCAhPSBudWxsKSB7XG4gICAgICBfcmFmMlsnZGVmYXVsdCddLmNhbmNlbCh0aGlzLmFuaW1hdGlvbklEKTtcbiAgICAgIHRoaXMuYW5pbWF0aW9uSUQgPSBudWxsO1xuICAgIH1cbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICB2YXIgaHlkcmF0ZWRTdHlsZXMgPSByZWh5ZHJhdGVTdHlsZXModGhpcy5zdGF0ZS5tZXJnZWRQcm9wc1N0eWxlcywgdGhpcy51bnJlYWRQcm9wU3R5bGVzLCB0aGlzLnN0YXRlLmN1cnJlbnRTdHlsZXMpO1xuICAgIHZhciByZW5kZXJlZENoaWxkcmVuID0gdGhpcy5wcm9wcy5jaGlsZHJlbihoeWRyYXRlZFN0eWxlcyk7XG4gICAgcmV0dXJuIHJlbmRlcmVkQ2hpbGRyZW4gJiYgX3JlYWN0MlsnZGVmYXVsdCddLkNoaWxkcmVuLm9ubHkocmVuZGVyZWRDaGlsZHJlbik7XG4gIH1cbn0pO1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBUcmFuc2l0aW9uTW90aW9uO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG5cbi8vIGxpc3Qgb2Ygc3R5bGVzLCBlYWNoIGNvbnRhaW5pbmcgaW50ZXJwb2xhdGluZyB2YWx1ZXMuIFBhcnQgb2Ygd2hhdCdzIHBhc3NlZFxuLy8gdG8gY2hpbGRyZW4gZnVuY3Rpb24uIE5vdGljZSB0aGF0IHRoaXMgaXNcbi8vIEFycmF5PEFjdHVhbEludGVycG9sYXRpbmdTdHlsZU9iamVjdD4sIHdpdGhvdXQgdGhlIHdyYXBwZXIgdGhhdCBpcyB7a2V5OiAuLi4sXG4vLyBkYXRhOiAuLi4gc3R5bGU6IEFjdHVhbEludGVycG9sYXRpbmdTdHlsZU9iamVjdH0uIE9ubHkgbWVyZ2VkUHJvcHNTdHlsZXNcbi8vIGNvbnRhaW5zIHRoZSBrZXkgJiBkYXRhIGluZm8gKHNvIHRoYXQgd2Ugb25seSBoYXZlIGEgc2luZ2xlIHNvdXJjZSBvZiB0cnV0aFxuLy8gZm9yIHRoZXNlLCBhbmQgdG8gc2F2ZSBzcGFjZSkuIENoZWNrIHRoZSBjb21tZW50IGZvciBgcmVoeWRyYXRlU3R5bGVzYCB0b1xuLy8gc2VlIGhvdyB3ZSByZWdlbmVyYXRlIHRoZSBlbnRpcmV0eSBvZiB3aGF0J3MgcGFzc2VkIHRvIGNoaWxkcmVuIGZ1bmN0aW9uXG5cbi8vIHRoZSBhcnJheSB0aGF0IGtlZXBzIHRyYWNrIG9mIGN1cnJlbnRseSByZW5kZXJlZCBzdHVmZiEgSW5jbHVkaW5nIHN0dWZmXG4vLyB0aGF0IHlvdSd2ZSB1bm1vdW50ZWQgYnV0IHRoYXQncyBzdGlsbCBhbmltYXRpbmcuIFRoaXMgaXMgd2hlcmUgaXQgbGl2ZXMiLCJcblxuLy8gY3VycmVudGx5IHVzZWQgdG8gaW5pdGlhdGUgdGhlIHZlbG9jaXR5IHN0eWxlIG9iamVjdCB0byAwXG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzWydkZWZhdWx0J10gPSBtYXBUb1plcm87XG5cbmZ1bmN0aW9uIG1hcFRvWmVybyhvYmopIHtcbiAgdmFyIHJldCA9IHt9O1xuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICByZXRba2V5XSA9IDA7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIlxuXG4vLyBjb3JlIGtleXMgbWVyZ2luZyBhbGdvcml0aG0uIElmIHByZXZpb3VzIHJlbmRlcidzIGtleXMgYXJlIFthLCBiXSwgYW5kIHRoZVxuLy8gbmV4dCByZW5kZXIncyBbYywgYiwgZF0sIHdoYXQncyB0aGUgZmluYWwgbWVyZ2VkIGtleXMgYW5kIG9yZGVyaW5nP1xuXG4vLyAtIGMgYW5kIGEgbXVzdCBib3RoIGJlIGJlZm9yZSBiXG4vLyAtIGIgYmVmb3JlIGRcbi8vIC0gb3JkZXJpbmcgYmV0d2VlbiBhIGFuZCBjIGFtYmlndW91c1xuXG4vLyB0aGlzIHJlZHVjZXMgdG8gbWVyZ2luZyB0d28gcGFydGlhbGx5IG9yZGVyZWQgbGlzdHMgKGUuZy4gbGlzdHMgd2hlcmUgbm90XG4vLyBldmVyeSBpdGVtIGhhcyBhIGRlZmluaXRlIG9yZGVyaW5nLCBsaWtlIGNvbXBhcmluZyBhIGFuZCBjIGFib3ZlKS4gRm9yIHRoZVxuLy8gYW1iaWd1b3VzIG9yZGVyaW5nIHdlIGRldGVybWluaXN0aWNhbGx5IGNob29zZSB0byBwbGFjZSB0aGUgbmV4dCByZW5kZXInc1xuLy8gaXRlbSBhZnRlciB0aGUgcHJldmlvdXMnOyBzbyBjIGFmdGVyIGFcblxuLy8gdGhpcyBpcyBjYWxsZWQgYSB0b3BvbG9naWNhbCBzb3J0aW5nLiBFeGNlcHQgdGhlIGV4aXN0aW5nIGFsZ29yaXRobXMgZG9uJ3Rcbi8vIHdvcmsgd2VsbCB3aXRoIGpzIGJjIG9mIHRoZSBhbW91bnQgb2YgYWxsb2NhdGlvbiwgYW5kIGlzbid0IG9wdGltaXplZCBmb3Igb3VyXG4vLyBjdXJyZW50IHVzZS1jYXNlIGJjIHRoZSBydW50aW1lIGlzIGxpbmVhciBpbiB0ZXJtcyBvZiBlZGdlcyAoc2VlIHdpa2kgZm9yXG4vLyBtZWFuaW5nKSwgd2hpY2ggaXMgaHVnZSB3aGVuIHR3byBsaXN0cyBoYXZlIG1hbnkgY29tbW9uIGVsZW1lbnRzXG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzWydkZWZhdWx0J10gPSBtZXJnZURpZmY7XG5cbmZ1bmN0aW9uIG1lcmdlRGlmZihwcmV2LCBuZXh0LCBvblJlbW92ZSkge1xuICAvLyBib29ra2VlcGluZyBmb3IgZWFzaWVyIGFjY2VzcyBvZiBhIGtleSdzIGluZGV4IGJlbG93LiBUaGlzIGlzIDIgYWxsb2NhdGlvbnMgK1xuICAvLyBwb3RlbnRpYWxseSB0cmlnZ2VyaW5nIGNocm9tZSBoYXNoIG1hcCBtb2RlIGZvciBvYmpzIChzbyBpdCBtaWdodCBiZSBmYXN0ZXJcblxuICB2YXIgcHJldktleUluZGV4ID0ge307XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcHJldi5sZW5ndGg7IGkrKykge1xuICAgIHByZXZLZXlJbmRleFtwcmV2W2ldLmtleV0gPSBpO1xuICB9XG4gIHZhciBuZXh0S2V5SW5kZXggPSB7fTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBuZXh0Lmxlbmd0aDsgaSsrKSB7XG4gICAgbmV4dEtleUluZGV4W25leHRbaV0ua2V5XSA9IGk7XG4gIH1cblxuICAvLyBmaXJzdCwgYW4gb3Zlcmx5IGVsYWJvcmF0ZSB3YXkgb2YgbWVyZ2luZyBwcmV2IGFuZCBuZXh0LCBlbGltaW5hdGluZ1xuICAvLyBkdXBsaWNhdGVzIChpbiB0ZXJtcyBvZiBrZXlzKS4gSWYgdGhlcmUncyBkdXBlLCBrZWVwIHRoZSBpdGVtIGluIG5leHQpLlxuICAvLyBUaGlzIHdheSBvZiB3cml0aW5nIGl0IHNhdmVzIGFsbG9jYXRpb25zXG4gIHZhciByZXQgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBuZXh0Lmxlbmd0aDsgaSsrKSB7XG4gICAgcmV0W2ldID0gbmV4dFtpXTtcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHByZXYubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoIW5leHRLZXlJbmRleC5oYXNPd25Qcm9wZXJ0eShwcmV2W2ldLmtleSkpIHtcbiAgICAgIC8vIHRoaXMgaXMgY2FsbGVkIG15IFRNJ3MgYG1lcmdlQW5kU3luY2AsIHdoaWNoIGNhbGxzIHdpbGxMZWF2ZS4gV2UgZG9uJ3RcbiAgICAgIC8vIG1lcmdlIGluIGtleXMgdGhhdCB0aGUgdXNlciBkZXNpcmVzIHRvIGtpbGxcbiAgICAgIHZhciBmaWxsID0gb25SZW1vdmUoaSwgcHJldltpXSk7XG4gICAgICBpZiAoZmlsbCAhPSBudWxsKSB7XG4gICAgICAgIHJldC5wdXNoKGZpbGwpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIG5vdyBhbGwgdGhlIGl0ZW1zIGFsbCBwcmVzZW50LiBDb3JlIHNvcnRpbmcgbG9naWMgdG8gaGF2ZSB0aGUgcmlnaHQgb3JkZXJcbiAgcmV0dXJuIHJldC5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgdmFyIG5leHRPcmRlckEgPSBuZXh0S2V5SW5kZXhbYS5rZXldO1xuICAgIHZhciBuZXh0T3JkZXJCID0gbmV4dEtleUluZGV4W2Iua2V5XTtcbiAgICB2YXIgcHJldk9yZGVyQSA9IHByZXZLZXlJbmRleFthLmtleV07XG4gICAgdmFyIHByZXZPcmRlckIgPSBwcmV2S2V5SW5kZXhbYi5rZXldO1xuXG4gICAgaWYgKG5leHRPcmRlckEgIT0gbnVsbCAmJiBuZXh0T3JkZXJCICE9IG51bGwpIHtcbiAgICAgIC8vIGJvdGgga2V5cyBpbiBuZXh0XG4gICAgICByZXR1cm4gbmV4dEtleUluZGV4W2Eua2V5XSAtIG5leHRLZXlJbmRleFtiLmtleV07XG4gICAgfSBlbHNlIGlmIChwcmV2T3JkZXJBICE9IG51bGwgJiYgcHJldk9yZGVyQiAhPSBudWxsKSB7XG4gICAgICAvLyBib3RoIGtleXMgaW4gcHJldlxuICAgICAgcmV0dXJuIHByZXZLZXlJbmRleFthLmtleV0gLSBwcmV2S2V5SW5kZXhbYi5rZXldO1xuICAgIH0gZWxzZSBpZiAobmV4dE9yZGVyQSAhPSBudWxsKSB7XG4gICAgICAvLyBrZXkgYSBpbiBuZXh0LCBrZXkgYiBpbiBwcmV2XG5cbiAgICAgIC8vIGhvdyB0byBkZXRlcm1pbmUgdGhlIG9yZGVyIGJldHdlZW4gYSBhbmQgYj8gV2UgZmluZCBhIFwicGl2b3RcIiAodGVybVxuICAgICAgLy8gYWJ1c2UpLCBhIGtleSBwcmVzZW50IGluIGJvdGggcHJldiBhbmQgbmV4dCwgdGhhdCBpcyBzYW5kd2ljaGVkIGJldHdlZW5cbiAgICAgIC8vIGEgYW5kIGIuIEluIHRoZSBjb250ZXh0IG9mIG91ciBhYm92ZSBleGFtcGxlLCBpZiB3ZSdyZSBjb21wYXJpbmcgYSBhbmRcbiAgICAgIC8vIGQsIGIncyAodGhlIG9ubHkpIHBpdm90XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5leHQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHBpdm90ID0gbmV4dFtpXS5rZXk7XG4gICAgICAgIGlmICghcHJldktleUluZGV4Lmhhc093blByb3BlcnR5KHBpdm90KSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5leHRPcmRlckEgPCBuZXh0S2V5SW5kZXhbcGl2b3RdICYmIHByZXZPcmRlckIgPiBwcmV2S2V5SW5kZXhbcGl2b3RdKSB7XG4gICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9IGVsc2UgaWYgKG5leHRPcmRlckEgPiBuZXh0S2V5SW5kZXhbcGl2b3RdICYmIHByZXZPcmRlckIgPCBwcmV2S2V5SW5kZXhbcGl2b3RdKSB7XG4gICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIHBsdWdnYWJsZS4gZGVmYXVsdCB0bzogbmV4dCBiaWdnZXIgdGhhbiBwcmV2XG4gICAgICByZXR1cm4gMTtcbiAgICB9XG4gICAgLy8gcHJldk9yZGVyQSwgbmV4dE9yZGVyQlxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmV4dC5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHBpdm90ID0gbmV4dFtpXS5rZXk7XG4gICAgICBpZiAoIXByZXZLZXlJbmRleC5oYXNPd25Qcm9wZXJ0eShwaXZvdCkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAobmV4dE9yZGVyQiA8IG5leHRLZXlJbmRleFtwaXZvdF0gJiYgcHJldk9yZGVyQSA+IHByZXZLZXlJbmRleFtwaXZvdF0pIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgICB9IGVsc2UgaWYgKG5leHRPcmRlckIgPiBuZXh0S2V5SW5kZXhbcGl2b3RdICYmIHByZXZPcmRlckEgPCBwcmV2S2V5SW5kZXhbcGl2b3RdKSB7XG4gICAgICAgIHJldHVybiAtMTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gcGx1Z2dhYmxlLiBkZWZhdWx0IHRvOiBuZXh0IGJpZ2dlciB0aGFuIHByZXZcbiAgICByZXR1cm4gLTE7XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcbi8vIHRvIGxvb3AgdGhyb3VnaCBhbmQgZmluZCBhIGtleSdzIGluZGV4IGVhY2ggdGltZSksIGJ1dCBJIG5vIGxvbmdlciBjYXJlIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHtcbiAgbm9Xb2JibGU6IHsgc3RpZmZuZXNzOiAxNzAsIGRhbXBpbmc6IDI2IH0sIC8vIHRoZSBkZWZhdWx0LCBpZiBub3RoaW5nIHByb3ZpZGVkXG4gIGdlbnRsZTogeyBzdGlmZm5lc3M6IDEyMCwgZGFtcGluZzogMTQgfSxcbiAgd29iYmx5OiB7IHN0aWZmbmVzczogMTgwLCBkYW1waW5nOiAxMiB9LFxuICBzdGlmZjogeyBzdGlmZm5lc3M6IDIxMCwgZGFtcGluZzogMjAgfVxufTtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1tcImRlZmF1bHRcIl07IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmUob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmpbJ2RlZmF1bHQnXSA6IG9iajsgfVxuXG52YXIgX01vdGlvbiA9IHJlcXVpcmUoJy4vTW90aW9uJyk7XG5cbmV4cG9ydHMuTW90aW9uID0gX2ludGVyb3BSZXF1aXJlKF9Nb3Rpb24pO1xuXG52YXIgX1N0YWdnZXJlZE1vdGlvbiA9IHJlcXVpcmUoJy4vU3RhZ2dlcmVkTW90aW9uJyk7XG5cbmV4cG9ydHMuU3RhZ2dlcmVkTW90aW9uID0gX2ludGVyb3BSZXF1aXJlKF9TdGFnZ2VyZWRNb3Rpb24pO1xuXG52YXIgX1RyYW5zaXRpb25Nb3Rpb24gPSByZXF1aXJlKCcuL1RyYW5zaXRpb25Nb3Rpb24nKTtcblxuZXhwb3J0cy5UcmFuc2l0aW9uTW90aW9uID0gX2ludGVyb3BSZXF1aXJlKF9UcmFuc2l0aW9uTW90aW9uKTtcblxudmFyIF9zcHJpbmcgPSByZXF1aXJlKCcuL3NwcmluZycpO1xuXG5leHBvcnRzLnNwcmluZyA9IF9pbnRlcm9wUmVxdWlyZShfc3ByaW5nKTtcblxudmFyIF9wcmVzZXRzID0gcmVxdWlyZSgnLi9wcmVzZXRzJyk7XG5cbmV4cG9ydHMucHJlc2V0cyA9IF9pbnRlcm9wUmVxdWlyZShfcHJlc2V0cyk7XG5cbi8vIGRlcHJlY2F0ZWQsIGR1bW15IHdhcm5pbmcgZnVuY3Rpb25cblxudmFyIF9yZW9yZGVyS2V5cyA9IHJlcXVpcmUoJy4vcmVvcmRlcktleXMnKTtcblxuZXhwb3J0cy5yZW9yZGVyS2V5cyA9IF9pbnRlcm9wUmVxdWlyZShfcmVvcmRlcktleXMpOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IHJlb3JkZXJLZXlzO1xuXG52YXIgaGFzV2FybmVkID0gZmFsc2U7XG5cbmZ1bmN0aW9uIHJlb3JkZXJLZXlzKCkge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcpIHtcbiAgICBpZiAoIWhhc1dhcm5lZCkge1xuICAgICAgaGFzV2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ2ByZW9yZGVyS2V5c2AgaGFzIGJlZW4gcmVtb3ZlZCwgc2luY2UgaXQgaXMgbm8gbG9uZ2VyIG5lZWRlZCBmb3IgVHJhbnNpdGlvbk1vdGlvblxcJ3MgbmV3IHN0eWxlcyBhcnJheSBBUEkuJyk7XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIlxuXG4vLyB1c2FnZSBhc3N1bXB0aW9uOiBjdXJyZW50U3R5bGUgdmFsdWVzIGhhdmUgYWxyZWFkeSBiZWVuIHJlbmRlcmVkIGJ1dCBpdCBzYXlzXG4vLyBub3RoaW5nIG9mIHdoZXRoZXIgY3VycmVudFN0eWxlIGlzIHN0YWxlIChzZWUgdW5yZWFkUHJvcFN0eWxlKVxuJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1snZGVmYXVsdCddID0gc2hvdWxkU3RvcEFuaW1hdGlvbjtcblxuZnVuY3Rpb24gc2hvdWxkU3RvcEFuaW1hdGlvbihjdXJyZW50U3R5bGUsIHN0eWxlLCBjdXJyZW50VmVsb2NpdHkpIHtcbiAgZm9yICh2YXIga2V5IGluIHN0eWxlKSB7XG4gICAgaWYgKCFzdHlsZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAoY3VycmVudFZlbG9jaXR5W2tleV0gIT09IDApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB2YXIgc3R5bGVWYWx1ZSA9IHR5cGVvZiBzdHlsZVtrZXldID09PSAnbnVtYmVyJyA/IHN0eWxlW2tleV0gOiBzdHlsZVtrZXldLnZhbDtcbiAgICAvLyBzdGVwcGVyIHdpbGwgaGF2ZSBhbHJlYWR5IHRha2VuIGNhcmUgb2Ygcm91bmRpbmcgcHJlY2lzaW9uIGVycm9ycywgc29cbiAgICAvLyB3b24ndCBoYXZlIHN1Y2ggdGhpbmcgYXMgMC45OTk5ICE9PT0gMVxuICAgIGlmIChjdXJyZW50U3R5bGVba2V5XSAhPT0gc3R5bGVWYWx1ZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IHNwcmluZztcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX3ByZXNldHMgPSByZXF1aXJlKCcuL3ByZXNldHMnKTtcblxudmFyIF9wcmVzZXRzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3ByZXNldHMpO1xuXG52YXIgZGVmYXVsdENvbmZpZyA9IF9leHRlbmRzKHt9LCBfcHJlc2V0czJbJ2RlZmF1bHQnXS5ub1dvYmJsZSwge1xuICBwcmVjaXNpb246IDAuMDFcbn0pO1xuXG5mdW5jdGlvbiBzcHJpbmcodmFsLCBjb25maWcpIHtcbiAgcmV0dXJuIF9leHRlbmRzKHt9LCBkZWZhdWx0Q29uZmlnLCBjb25maWcsIHsgdmFsOiB2YWwgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIlxuXG4vLyBzdGVwcGVyIGlzIHVzZWQgYSBsb3QuIFNhdmVzIGFsbG9jYXRpb24gdG8gcmV0dXJuIHRoZSBzYW1lIGFycmF5IHdyYXBwZXIuXG4vLyBUaGlzIGlzIGZpbmUgYW5kIGRhbmdlci1mcmVlIGFnYWluc3QgbXV0YXRpb25zIGJlY2F1c2UgdGhlIGNhbGxzaXRlXG4vLyBpbW1lZGlhdGVseSBkZXN0cnVjdHVyZXMgaXQgYW5kIGdldHMgdGhlIG51bWJlcnMgaW5zaWRlIHdpdGhvdXQgcGFzc2luZyB0aGVcblwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBzdGVwcGVyO1xuXG52YXIgcmV1c2VkVHVwbGUgPSBbXTtcblxuZnVuY3Rpb24gc3RlcHBlcihzZWNvbmRQZXJGcmFtZSwgeCwgdiwgZGVzdFgsIGssIGIsIHByZWNpc2lvbikge1xuICAvLyBTcHJpbmcgc3RpZmZuZXNzLCBpbiBrZyAvIHNeMlxuXG4gIC8vIGZvciBhbmltYXRpb25zLCBkZXN0WCBpcyByZWFsbHkgc3ByaW5nIGxlbmd0aCAoc3ByaW5nIGF0IHJlc3QpLiBpbml0aWFsXG4gIC8vIHBvc2l0aW9uIGlzIGNvbnNpZGVyZWQgYXMgdGhlIHN0cmV0Y2hlZC9jb21wcmVzc2VkIHBvc2l0aW9uIG9mIGEgc3ByaW5nXG4gIHZhciBGc3ByaW5nID0gLWsgKiAoeCAtIGRlc3RYKTtcblxuICAvLyBEYW1waW5nLCBpbiBrZyAvIHNcbiAgdmFyIEZkYW1wZXIgPSAtYiAqIHY7XG5cbiAgLy8gdXN1YWxseSB3ZSBwdXQgbWFzcyBoZXJlLCBidXQgZm9yIGFuaW1hdGlvbiBwdXJwb3Nlcywgc3BlY2lmeWluZyBtYXNzIGlzIGFcbiAgLy8gYml0IHJlZHVuZGFudC4geW91IGNvdWxkIHNpbXBseSBhZGp1c3QgayBhbmQgYiBhY2NvcmRpbmdseVxuICAvLyBsZXQgYSA9IChGc3ByaW5nICsgRmRhbXBlcikgLyBtYXNzO1xuICB2YXIgYSA9IEZzcHJpbmcgKyBGZGFtcGVyO1xuXG4gIHZhciBuZXdWID0gdiArIGEgKiBzZWNvbmRQZXJGcmFtZTtcbiAgdmFyIG5ld1ggPSB4ICsgbmV3ViAqIHNlY29uZFBlckZyYW1lO1xuXG4gIGlmIChNYXRoLmFicyhuZXdWKSA8IHByZWNpc2lvbiAmJiBNYXRoLmFicyhuZXdYIC0gZGVzdFgpIDwgcHJlY2lzaW9uKSB7XG4gICAgcmV1c2VkVHVwbGVbMF0gPSBkZXN0WDtcbiAgICByZXVzZWRUdXBsZVsxXSA9IDA7XG4gICAgcmV0dXJuIHJldXNlZFR1cGxlO1xuICB9XG5cbiAgcmV1c2VkVHVwbGVbMF0gPSBuZXdYO1xuICByZXVzZWRUdXBsZVsxXSA9IG5ld1Y7XG4gIHJldHVybiByZXVzZWRUdXBsZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzW1wiZGVmYXVsdFwiXTtcbi8vIGFycmF5IHJlZmVyZW5jZSBhcm91bmQuIiwiXG4vLyB0dXJuIHt4OiB7dmFsOiAxLCBzdGlmZm5lc3M6IDEsIGRhbXBpbmc6IDJ9LCB5OiAyfSBnZW5lcmF0ZWQgYnlcbi8vIGB7eDogc3ByaW5nKDEsIHtzdGlmZm5lc3M6IDEsIGRhbXBpbmc6IDJ9KSwgeTogMn1gIGludG8ge3g6IDEsIHk6IDJ9XG5cbid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IHN0cmlwU3R5bGU7XG5cbmZ1bmN0aW9uIHN0cmlwU3R5bGUoc3R5bGUpIHtcbiAgdmFyIHJldCA9IHt9O1xuICBmb3IgKHZhciBrZXkgaW4gc3R5bGUpIHtcbiAgICBpZiAoIXN0eWxlLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICByZXRba2V5XSA9IHR5cGVvZiBzdHlsZVtrZXldID09PSAnbnVtYmVyJyA/IHN0eWxlW2tleV0gOiBzdHlsZVtrZXldLnZhbDtcbiAgfVxuICByZXR1cm4gcmV0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIvKmVzbGludC1kaXNhYmxlIHJlYWN0L3Byb3AtdHlwZXMgKi9cbid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXMob2JqLCBrZXlzKSB7IHZhciB0YXJnZXQgPSB7fTsgZm9yICh2YXIgaSBpbiBvYmopIHsgaWYgKGtleXMuaW5kZXhPZihpKSA+PSAwKSBjb250aW51ZTsgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBpKSkgY29udGludWU7IHRhcmdldFtpXSA9IG9ialtpXTsgfSByZXR1cm4gdGFyZ2V0OyB9XG5cbnZhciBfcmVhY3QgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snUmVhY3QnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1JlYWN0J10gOiBudWxsKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfd2FybmluZyA9IHJlcXVpcmUoJ3dhcm5pbmcnKTtcblxudmFyIF93YXJuaW5nMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3dhcm5pbmcpO1xuXG52YXIgX3JlYWN0UHJvcFR5cGVzTGliTW91bnRhYmxlID0gcmVxdWlyZSgncmVhY3QtcHJvcC10eXBlcy9saWIvbW91bnRhYmxlJyk7XG5cbnZhciBfcmVhY3RQcm9wVHlwZXNMaWJNb3VudGFibGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3RQcm9wVHlwZXNMaWJNb3VudGFibGUpO1xuXG52YXIgX3JlYWN0UHJvcFR5cGVzTGliRWxlbWVudFR5cGUgPSByZXF1aXJlKCdyZWFjdC1wcm9wLXR5cGVzL2xpYi9lbGVtZW50VHlwZScpO1xuXG52YXIgX3JlYWN0UHJvcFR5cGVzTGliRWxlbWVudFR5cGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3RQcm9wVHlwZXNMaWJFbGVtZW50VHlwZSk7XG5cbnZhciBfUG9ydGFsID0gcmVxdWlyZSgnLi9Qb3J0YWwnKTtcblxudmFyIF9Qb3J0YWwyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfUG9ydGFsKTtcblxudmFyIF9Nb2RhbE1hbmFnZXIgPSByZXF1aXJlKCcuL01vZGFsTWFuYWdlcicpO1xuXG52YXIgX01vZGFsTWFuYWdlcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9Nb2RhbE1hbmFnZXIpO1xuXG52YXIgX3V0aWxzT3duZXJEb2N1bWVudCA9IHJlcXVpcmUoJy4vdXRpbHMvb3duZXJEb2N1bWVudCcpO1xuXG52YXIgX3V0aWxzT3duZXJEb2N1bWVudDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF91dGlsc093bmVyRG9jdW1lbnQpO1xuXG52YXIgX3V0aWxzQWRkRXZlbnRMaXN0ZW5lciA9IHJlcXVpcmUoJy4vdXRpbHMvYWRkRXZlbnRMaXN0ZW5lcicpO1xuXG52YXIgX3V0aWxzQWRkRXZlbnRMaXN0ZW5lcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF91dGlsc0FkZEV2ZW50TGlzdGVuZXIpO1xuXG52YXIgX3V0aWxzQWRkRm9jdXNMaXN0ZW5lciA9IHJlcXVpcmUoJy4vdXRpbHMvYWRkRm9jdXNMaXN0ZW5lcicpO1xuXG52YXIgX3V0aWxzQWRkRm9jdXNMaXN0ZW5lcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF91dGlsc0FkZEZvY3VzTGlzdGVuZXIpO1xuXG52YXIgX2RvbUhlbHBlcnNVdGlsSW5ET00gPSByZXF1aXJlKCdkb20taGVscGVycy91dGlsL2luRE9NJyk7XG5cbnZhciBfZG9tSGVscGVyc1V0aWxJbkRPTTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9kb21IZWxwZXJzVXRpbEluRE9NKTtcblxudmFyIF9kb21IZWxwZXJzQWN0aXZlRWxlbWVudCA9IHJlcXVpcmUoJ2RvbS1oZWxwZXJzL2FjdGl2ZUVsZW1lbnQnKTtcblxudmFyIF9kb21IZWxwZXJzQWN0aXZlRWxlbWVudDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9kb21IZWxwZXJzQWN0aXZlRWxlbWVudCk7XG5cbnZhciBfZG9tSGVscGVyc1F1ZXJ5Q29udGFpbnMgPSByZXF1aXJlKCdkb20taGVscGVycy9xdWVyeS9jb250YWlucycpO1xuXG52YXIgX2RvbUhlbHBlcnNRdWVyeUNvbnRhaW5zMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2RvbUhlbHBlcnNRdWVyeUNvbnRhaW5zKTtcblxudmFyIF91dGlsc0dldENvbnRhaW5lciA9IHJlcXVpcmUoJy4vdXRpbHMvZ2V0Q29udGFpbmVyJyk7XG5cbnZhciBfdXRpbHNHZXRDb250YWluZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdXRpbHNHZXRDb250YWluZXIpO1xuXG52YXIgbW9kYWxNYW5hZ2VyID0gbmV3IF9Nb2RhbE1hbmFnZXIyWydkZWZhdWx0J10oKTtcblxuLyoqXG4gKiBMb3ZlIHRoZW0gb3IgaGF0ZSB0aGVtLCBgPE1vZGFsLz5gIHByb3ZpZGVzIGEgc29saWQgZm91bmRhdGlvbiBmb3IgY3JlYXRpbmcgZGlhbG9ncywgbGlnaHRib3hlcywgb3Igd2hhdGV2ZXIgZWxzZS5cbiAqIFRoZSBNb2RhbCBjb21wb25lbnQgcmVuZGVycyBpdHMgYGNoaWxkcmVuYCBub2RlIGluIGZyb250IG9mIGEgYmFja2Ryb3AgY29tcG9uZW50LlxuICpcbiAqIFRoZSBNb2RhbCBvZmZlcnMgYSBmZXcgaGVscGZ1bCBmZWF0dXJlcyBvdmVyIHVzaW5nIGp1c3QgYSBgPFBvcnRhbC8+YCBjb21wb25lbnQgYW5kIHNvbWUgc3R5bGVzOlxuICpcbiAqIC0gTWFuYWdlcyBkaWFsb2cgc3RhY2tpbmcgd2hlbiBvbmUtYXQtYS10aW1lIGp1c3QgaXNuJ3QgZW5vdWdoLlxuICogLSBDcmVhdGVzIGEgYmFja2Ryb3AsIGZvciBkaXNhYmxpbmcgaW50ZXJhY3Rpb24gYmVsb3cgdGhlIG1vZGFsLlxuICogLSBJdCBwcm9wZXJseSBtYW5hZ2VzIGZvY3VzOyBtb3ZpbmcgdG8gdGhlIG1vZGFsIGNvbnRlbnQsIGFuZCBrZWVwaW5nIGl0IHRoZXJlIHVudGlsIHRoZSBtb2RhbCBpcyBjbG9zZWQuXG4gKiAtIEl0IGRpc2FibGVzIHNjcm9sbGluZyBvZiB0aGUgcGFnZSBjb250ZW50IHdoaWxlIG9wZW4uXG4gKiAtIEFkZHMgdGhlIGFwcHJvcHJpYXRlIEFSSUEgcm9sZXMgYXJlIGF1dG9tYXRpY2FsbHkuXG4gKiAtIEVhc2lseSBwbHVnZ2FibGUgYW5pbWF0aW9ucyB2aWEgYSBgPFRyYW5zaXRpb24vPmAgY29tcG9uZW50LlxuICpcbiAqIE5vdGUgdGhhdCwgaW4gdGhlIHNhbWUgd2F5IHRoZSBiYWNrZHJvcCBlbGVtZW50IHByZXZlbnRzIHVzZXJzIGZyb20gY2xpY2tpbmcgb3IgaW50ZXJhY3RpbmdcbiAqIHdpdGggdGhlIHBhZ2UgY29udGVudCB1bmRlcm5lYXRoIHRoZSBNb2RhbCwgU2NyZWVuIHJlYWRlcnMgYWxzbyBuZWVkIHRvIGJlIHNpZ25hbGVkIHRvIG5vdCB0b1xuICogaW50ZXJhY3Qgd2l0aCBwYWdlIGNvbnRlbnQgd2hpbGUgdGhlIE1vZGFsIGlzIG9wZW4uIFRvIGRvIHRoaXMsIHdlIHVzZSBhIGNvbW1vbiB0ZWNobmlxdWUgb2YgYXBwbHlpbmdcbiAqIHRoZSBgYXJpYS1oaWRkZW49J3RydWUnYCBhdHRyaWJ1dGUgdG8gdGhlIG5vbi1Nb2RhbCBlbGVtZW50cyBpbiB0aGUgTW9kYWwgYGNvbnRhaW5lcmAuIFRoaXMgbWVhbnMgdGhhdCBmb3JcbiAqIGEgTW9kYWwgdG8gYmUgdHJ1bHkgbW9kYWwsIGl0IHNob3VsZCBoYXZlIGEgYGNvbnRhaW5lcmAgdGhhdCBpcyBfb3V0c2lkZV8geW91ciBhcHAnc1xuICogUmVhY3QgaGllcmFyY2h5IChzdWNoIGFzIHRoZSBkZWZhdWx0OiBkb2N1bWVudC5ib2R5KS5cbiAqL1xudmFyIE1vZGFsID0gX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdNb2RhbCcsXG5cbiAgcHJvcFR5cGVzOiBfZXh0ZW5kcyh7fSwgX1BvcnRhbDJbJ2RlZmF1bHQnXS5wcm9wVHlwZXMsIHtcblxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgdmlzaWJpbGl0eSBvZiB0aGUgTW9kYWxcbiAgICAgKi9cbiAgICBzaG93OiBfcmVhY3QyWydkZWZhdWx0J10uUHJvcFR5cGVzLmJvb2wsXG5cbiAgICAvKipcbiAgICAgKiBBIE5vZGUsIENvbXBvbmVudCBpbnN0YW5jZSwgb3IgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGVpdGhlci4gVGhlIE1vZGFsIGlzIGFwcGVuZGVkIHRvIGl0J3MgY29udGFpbmVyIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBGb3IgdGhlIHNha2Ugb2YgYXNzaXN0aXZlIHRlY2hub2xvZ2llcywgdGhlIGNvbnRhaW5lciBzaG91bGQgdXN1YWxseSBiZSB0aGUgZG9jdW1lbnQgYm9keSwgc28gdGhhdCB0aGUgcmVzdCBvZiB0aGVcbiAgICAgKiBwYWdlIGNvbnRlbnQgY2FuIGJlIHBsYWNlZCBiZWhpbmQgYSB2aXJ0dWFsIGJhY2tkcm9wIGFzIHdlbGwgYXMgYSB2aXN1YWwgb25lLlxuICAgICAqL1xuICAgIGNvbnRhaW5lcjogX3JlYWN0MlsnZGVmYXVsdCddLlByb3BUeXBlcy5vbmVPZlR5cGUoW19yZWFjdFByb3BUeXBlc0xpYk1vdW50YWJsZTJbJ2RlZmF1bHQnXSwgX3JlYWN0MlsnZGVmYXVsdCddLlByb3BUeXBlcy5mdW5jXSksXG5cbiAgICAvKipcbiAgICAgKiBBIGNhbGxiYWNrIGZpcmVkIHdoZW4gdGhlIE1vZGFsIGlzIG9wZW5pbmcuXG4gICAgICovXG4gICAgb25TaG93OiBfcmVhY3QyWydkZWZhdWx0J10uUHJvcFR5cGVzLmZ1bmMsXG5cbiAgICAvKipcbiAgICAgKiBBIGNhbGxiYWNrIGZpcmVkIHdoZW4gZWl0aGVyIHRoZSBiYWNrZHJvcCBpcyBjbGlja2VkLCBvciB0aGUgZXNjYXBlIGtleSBpcyBwcmVzc2VkLlxuICAgICAqXG4gICAgICogVGhlIGBvbkhpZGVgIGNhbGxiYWNrIG9ubHkgc2lnbmFscyBpbnRlbnQgZnJvbSB0aGUgTW9kYWwsXG4gICAgICogeW91IG11c3QgYWN0dWFsbHkgc2V0IHRoZSBgc2hvd2AgcHJvcCB0byBgZmFsc2VgIGZvciB0aGUgTW9kYWwgdG8gY2xvc2UuXG4gICAgICovXG4gICAgb25IaWRlOiBfcmVhY3QyWydkZWZhdWx0J10uUHJvcFR5cGVzLmZ1bmMsXG5cbiAgICAvKipcbiAgICAgKiBJbmNsdWRlIGEgYmFja2Ryb3AgY29tcG9uZW50LlxuICAgICAqL1xuICAgIGJhY2tkcm9wOiBfcmVhY3QyWydkZWZhdWx0J10uUHJvcFR5cGVzLm9uZU9mVHlwZShbX3JlYWN0MlsnZGVmYXVsdCddLlByb3BUeXBlcy5ib29sLCBfcmVhY3QyWydkZWZhdWx0J10uUHJvcFR5cGVzLm9uZU9mKFsnc3RhdGljJ10pXSksXG5cbiAgICAvKipcbiAgICAgKiBBIGNhbGxiYWNrIGZpcmVkIHdoZW4gdGhlIGVzY2FwZSBrZXksIGlmIHNwZWNpZmllZCBpbiBga2V5Ym9hcmRgLCBpcyBwcmVzc2VkLlxuICAgICAqL1xuICAgIG9uRXNjYXBlS2V5VXA6IF9yZWFjdDJbJ2RlZmF1bHQnXS5Qcm9wVHlwZXMuZnVuYyxcblxuICAgIC8qKlxuICAgICAqIEEgY2FsbGJhY2sgZmlyZWQgd2hlbiB0aGUgYmFja2Ryb3AsIGlmIHNwZWNpZmllZCwgaXMgY2xpY2tlZC5cbiAgICAgKi9cbiAgICBvbkJhY2tkcm9wQ2xpY2s6IF9yZWFjdDJbJ2RlZmF1bHQnXS5Qcm9wVHlwZXMuZnVuYyxcblxuICAgIC8qKlxuICAgICAqIEEgc3R5bGUgb2JqZWN0IGZvciB0aGUgYmFja2Ryb3AgY29tcG9uZW50LlxuICAgICAqL1xuICAgIGJhY2tkcm9wU3R5bGU6IF9yZWFjdDJbJ2RlZmF1bHQnXS5Qcm9wVHlwZXMub2JqZWN0LFxuXG4gICAgLyoqXG4gICAgICogQSBjc3MgY2xhc3Mgb3IgY2xhc3NlcyBmb3IgdGhlIGJhY2tkcm9wIGNvbXBvbmVudC5cbiAgICAgKi9cbiAgICBiYWNrZHJvcENsYXNzTmFtZTogX3JlYWN0MlsnZGVmYXVsdCddLlByb3BUeXBlcy5zdHJpbmcsXG5cbiAgICAvKipcbiAgICAgKiBBIGNzcyBjbGFzcyBvciBzZXQgb2YgY2xhc3NlcyBhcHBsaWVkIHRvIHRoZSBtb2RhbCBjb250YWluZXIgd2hlbiB0aGUgbW9kYWwgaXMgb3BlbixcbiAgICAgKiBhbmQgcmVtb3ZlZCB3aGVuIGl0IGlzIGNsb3NlZC5cbiAgICAgKi9cbiAgICBjb250YWluZXJDbGFzc05hbWU6IF9yZWFjdDJbJ2RlZmF1bHQnXS5Qcm9wVHlwZXMuc3RyaW5nLFxuXG4gICAgLyoqXG4gICAgICogQ2xvc2UgdGhlIG1vZGFsIHdoZW4gZXNjYXBlIGtleSBpcyBwcmVzc2VkXG4gICAgICovXG4gICAga2V5Ym9hcmQ6IF9yZWFjdDJbJ2RlZmF1bHQnXS5Qcm9wVHlwZXMuYm9vbCxcblxuICAgIC8qKlxuICAgICAqIEEgYDxUcmFuc2l0aW9uLz5gIGNvbXBvbmVudCB0byB1c2UgZm9yIHRoZSBkaWFsb2cgYW5kIGJhY2tkcm9wIGNvbXBvbmVudHMuXG4gICAgICovXG4gICAgdHJhbnNpdGlvbjogX3JlYWN0UHJvcFR5cGVzTGliRWxlbWVudFR5cGUyWydkZWZhdWx0J10sXG5cbiAgICAvKipcbiAgICAgKiBUaGUgYHRpbWVvdXRgIG9mIHRoZSBkaWFsb2cgdHJhbnNpdGlvbiBpZiBzcGVjaWZpZWQuIFRoaXMgbnVtYmVyIGlzIHVzZWQgdG8gZW5zdXJlIHRoYXRcbiAgICAgKiB0cmFuc2l0aW9uIGNhbGxiYWNrcyBhcmUgYWx3YXlzIGZpcmVkLCBldmVuIGlmIGJyb3dzZXIgdHJhbnNpdGlvbiBldmVudHMgYXJlIGNhbmNlbGVkLlxuICAgICAqXG4gICAgICogU2VlIHRoZSBUcmFuc2l0aW9uIGB0aW1lb3V0YCBwcm9wIGZvciBtb3JlIGluZm9tYXRpb24uXG4gICAgICovXG4gICAgZGlhbG9nVHJhbnNpdGlvblRpbWVvdXQ6IF9yZWFjdDJbJ2RlZmF1bHQnXS5Qcm9wVHlwZXMubnVtYmVyLFxuXG4gICAgLyoqXG4gICAgICogVGhlIGB0aW1lb3V0YCBvZiB0aGUgYmFja2Ryb3AgdHJhbnNpdGlvbiBpZiBzcGVjaWZpZWQuIFRoaXMgbnVtYmVyIGlzIHVzZWQgdG9cbiAgICAgKiBlbnN1cmUgdGhhdCB0cmFuc2l0aW9uIGNhbGxiYWNrcyBhcmUgYWx3YXlzIGZpcmVkLCBldmVuIGlmIGJyb3dzZXIgdHJhbnNpdGlvbiBldmVudHMgYXJlIGNhbmNlbGVkLlxuICAgICAqXG4gICAgICogU2VlIHRoZSBUcmFuc2l0aW9uIGB0aW1lb3V0YCBwcm9wIGZvciBtb3JlIGluZm9tYXRpb24uXG4gICAgICovXG4gICAgYmFja2Ryb3BUcmFuc2l0aW9uVGltZW91dDogX3JlYWN0MlsnZGVmYXVsdCddLlByb3BUeXBlcy5udW1iZXIsXG5cbiAgICAvKipcbiAgICAgKiBXaGVuIGB0cnVlYCBUaGUgbW9kYWwgd2lsbCBhdXRvbWF0aWNhbGx5IHNoaWZ0IGZvY3VzIHRvIGl0c2VsZiB3aGVuIGl0IG9wZW5zLCBhbmRcbiAgICAgKiByZXBsYWNlIGl0IHRvIHRoZSBsYXN0IGZvY3VzZWQgZWxlbWVudCB3aGVuIGl0IGNsb3Nlcy4gVGhpcyBhbHNvXG4gICAgICogd29ya3MgY29ycmVjdGx5IHdpdGggYW55IE1vZGFsIGNoaWxkcmVuIHRoYXQgaGF2ZSB0aGUgYGF1dG9Gb2N1c2AgcHJvcC5cbiAgICAgKlxuICAgICAqIEdlbmVyYWxseSB0aGlzIHNob3VsZCBuZXZlciBiZSBzZXQgdG8gYGZhbHNlYCBhcyBpdCBtYWtlcyB0aGUgTW9kYWwgbGVzc1xuICAgICAqIGFjY2Vzc2libGUgdG8gYXNzaXN0aXZlIHRlY2hub2xvZ2llcywgbGlrZSBzY3JlZW4gcmVhZGVycy5cbiAgICAgKi9cbiAgICBhdXRvRm9jdXM6IF9yZWFjdDJbJ2RlZmF1bHQnXS5Qcm9wVHlwZXMuYm9vbCxcblxuICAgIC8qKlxuICAgICAqIFdoZW4gYHRydWVgIFRoZSBtb2RhbCB3aWxsIHByZXZlbnQgZm9jdXMgZnJvbSBsZWF2aW5nIHRoZSBNb2RhbCB3aGlsZSBvcGVuLlxuICAgICAqXG4gICAgICogR2VuZXJhbGx5IHRoaXMgc2hvdWxkIG5ldmVyIGJlIHNldCB0byBgZmFsc2VgIGFzIGl0IG1ha2VzIHRoZSBNb2RhbCBsZXNzXG4gICAgICogYWNjZXNzaWJsZSB0byBhc3Npc3RpdmUgdGVjaG5vbG9naWVzLCBsaWtlIHNjcmVlbiByZWFkZXJzLlxuICAgICAqL1xuICAgIGVuZm9yY2VGb2N1czogX3JlYWN0MlsnZGVmYXVsdCddLlByb3BUeXBlcy5ib29sLFxuXG4gICAgLyoqXG4gICAgICogQ2FsbGJhY2sgZmlyZWQgYmVmb3JlIHRoZSBNb2RhbCB0cmFuc2l0aW9ucyBpblxuICAgICAqL1xuICAgIG9uRW50ZXI6IF9yZWFjdDJbJ2RlZmF1bHQnXS5Qcm9wVHlwZXMuZnVuYyxcblxuICAgIC8qKlxuICAgICAqIENhbGxiYWNrIGZpcmVkIGFzIHRoZSBNb2RhbCBiZWdpbnMgdG8gdHJhbnNpdGlvbiBpblxuICAgICAqL1xuICAgIG9uRW50ZXJpbmc6IF9yZWFjdDJbJ2RlZmF1bHQnXS5Qcm9wVHlwZXMuZnVuYyxcblxuICAgIC8qKlxuICAgICAqIENhbGxiYWNrIGZpcmVkIGFmdGVyIHRoZSBNb2RhbCBmaW5pc2hlcyB0cmFuc2l0aW9uaW5nIGluXG4gICAgICovXG4gICAgb25FbnRlcmVkOiBfcmVhY3QyWydkZWZhdWx0J10uUHJvcFR5cGVzLmZ1bmMsXG5cbiAgICAvKipcbiAgICAgKiBDYWxsYmFjayBmaXJlZCByaWdodCBiZWZvcmUgdGhlIE1vZGFsIHRyYW5zaXRpb25zIG91dFxuICAgICAqL1xuICAgIG9uRXhpdDogX3JlYWN0MlsnZGVmYXVsdCddLlByb3BUeXBlcy5mdW5jLFxuXG4gICAgLyoqXG4gICAgICogQ2FsbGJhY2sgZmlyZWQgYXMgdGhlIE1vZGFsIGJlZ2lucyB0byB0cmFuc2l0aW9uIG91dFxuICAgICAqL1xuICAgIG9uRXhpdGluZzogX3JlYWN0MlsnZGVmYXVsdCddLlByb3BUeXBlcy5mdW5jLFxuXG4gICAgLyoqXG4gICAgICogQ2FsbGJhY2sgZmlyZWQgYWZ0ZXIgdGhlIE1vZGFsIGZpbmlzaGVzIHRyYW5zaXRpb25pbmcgb3V0XG4gICAgICovXG4gICAgb25FeGl0ZWQ6IF9yZWFjdDJbJ2RlZmF1bHQnXS5Qcm9wVHlwZXMuZnVuY1xuXG4gIH0pLFxuXG4gIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24gZ2V0RGVmYXVsdFByb3BzKCkge1xuICAgIHZhciBub29wID0gZnVuY3Rpb24gbm9vcCgpIHt9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHNob3c6IGZhbHNlLFxuICAgICAgYmFja2Ryb3A6IHRydWUsXG4gICAgICBrZXlib2FyZDogdHJ1ZSxcbiAgICAgIGF1dG9Gb2N1czogdHJ1ZSxcbiAgICAgIGVuZm9yY2VGb2N1czogdHJ1ZSxcbiAgICAgIG9uSGlkZTogbm9vcFxuICAgIH07XG4gIH0sXG5cbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgcmV0dXJuIHsgZXhpdGVkOiAhdGhpcy5wcm9wcy5zaG93IH07XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgdmFyIF9wcm9wcyA9IHRoaXMucHJvcHM7XG4gICAgdmFyIGNoaWxkcmVuID0gX3Byb3BzLmNoaWxkcmVuO1xuICAgIHZhciBUcmFuc2l0aW9uID0gX3Byb3BzLnRyYW5zaXRpb247XG4gICAgdmFyIGJhY2tkcm9wID0gX3Byb3BzLmJhY2tkcm9wO1xuICAgIHZhciBkaWFsb2dUcmFuc2l0aW9uVGltZW91dCA9IF9wcm9wcy5kaWFsb2dUcmFuc2l0aW9uVGltZW91dDtcblxuICAgIHZhciBwcm9wcyA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllcyhfcHJvcHMsIFsnY2hpbGRyZW4nLCAndHJhbnNpdGlvbicsICdiYWNrZHJvcCcsICdkaWFsb2dUcmFuc2l0aW9uVGltZW91dCddKTtcblxuICAgIHZhciBvbkV4aXQgPSBwcm9wcy5vbkV4aXQ7XG4gICAgdmFyIG9uRXhpdGluZyA9IHByb3BzLm9uRXhpdGluZztcbiAgICB2YXIgb25FbnRlciA9IHByb3BzLm9uRW50ZXI7XG4gICAgdmFyIG9uRW50ZXJpbmcgPSBwcm9wcy5vbkVudGVyaW5nO1xuICAgIHZhciBvbkVudGVyZWQgPSBwcm9wcy5vbkVudGVyZWQ7XG5cbiAgICB2YXIgc2hvdyA9ICEhcHJvcHMuc2hvdztcbiAgICB2YXIgZGlhbG9nID0gX3JlYWN0MlsnZGVmYXVsdCddLkNoaWxkcmVuLm9ubHkodGhpcy5wcm9wcy5jaGlsZHJlbik7XG5cbiAgICB2YXIgbW91bnRNb2RhbCA9IHNob3cgfHwgVHJhbnNpdGlvbiAmJiAhdGhpcy5zdGF0ZS5leGl0ZWQ7XG5cbiAgICBpZiAoIW1vdW50TW9kYWwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHZhciBfZGlhbG9nJHByb3BzID0gZGlhbG9nLnByb3BzO1xuICAgIHZhciByb2xlID0gX2RpYWxvZyRwcm9wcy5yb2xlO1xuICAgIHZhciB0YWJJbmRleCA9IF9kaWFsb2ckcHJvcHMudGFiSW5kZXg7XG5cbiAgICBpZiAocm9sZSA9PT0gdW5kZWZpbmVkIHx8IHRhYkluZGV4ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGRpYWxvZyA9IF9yZWFjdC5jbG9uZUVsZW1lbnQoZGlhbG9nLCB7XG4gICAgICAgIHJvbGU6IHJvbGUgPT09IHVuZGVmaW5lZCA/ICdkb2N1bWVudCcgOiByb2xlLFxuICAgICAgICB0YWJJbmRleDogdGFiSW5kZXggPT0gbnVsbCA/ICctMScgOiB0YWJJbmRleFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKFRyYW5zaXRpb24pIHtcbiAgICAgIGRpYWxvZyA9IF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KFxuICAgICAgICBUcmFuc2l0aW9uLFxuICAgICAgICB7XG4gICAgICAgICAgdHJhbnNpdGlvbkFwcGVhcjogdHJ1ZSxcbiAgICAgICAgICB1bm1vdW50T25FeGl0OiB0cnVlLFxuICAgICAgICAgICdpbic6IHNob3csXG4gICAgICAgICAgdGltZW91dDogZGlhbG9nVHJhbnNpdGlvblRpbWVvdXQsXG4gICAgICAgICAgb25FeGl0OiBvbkV4aXQsXG4gICAgICAgICAgb25FeGl0aW5nOiBvbkV4aXRpbmcsXG4gICAgICAgICAgb25FeGl0ZWQ6IHRoaXMuaGFuZGxlSGlkZGVuLFxuICAgICAgICAgIG9uRW50ZXI6IG9uRW50ZXIsXG4gICAgICAgICAgb25FbnRlcmluZzogb25FbnRlcmluZyxcbiAgICAgICAgICBvbkVudGVyZWQ6IG9uRW50ZXJlZFxuICAgICAgICB9LFxuICAgICAgICBkaWFsb2dcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KFxuICAgICAgX1BvcnRhbDJbJ2RlZmF1bHQnXSxcbiAgICAgIHtcbiAgICAgICAgcmVmOiB0aGlzLnNldE1vdW50Tm9kZSxcbiAgICAgICAgY29udGFpbmVyOiBwcm9wcy5jb250YWluZXJcbiAgICAgIH0sXG4gICAgICBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ2RpdicsXG4gICAgICAgIHtcbiAgICAgICAgICByZWY6ICdtb2RhbCcsXG4gICAgICAgICAgcm9sZTogcHJvcHMucm9sZSB8fCAnZGlhbG9nJyxcbiAgICAgICAgICBzdHlsZTogcHJvcHMuc3R5bGUsXG4gICAgICAgICAgY2xhc3NOYW1lOiBwcm9wcy5jbGFzc05hbWVcbiAgICAgICAgfSxcbiAgICAgICAgYmFja2Ryb3AgJiYgdGhpcy5yZW5kZXJCYWNrZHJvcCgpLFxuICAgICAgICBkaWFsb2dcbiAgICAgIClcbiAgICApO1xuICB9LFxuXG4gIHJlbmRlckJhY2tkcm9wOiBmdW5jdGlvbiByZW5kZXJCYWNrZHJvcCgpIHtcbiAgICB2YXIgX3Byb3BzMiA9IHRoaXMucHJvcHM7XG4gICAgdmFyIFRyYW5zaXRpb24gPSBfcHJvcHMyLnRyYW5zaXRpb247XG4gICAgdmFyIGJhY2tkcm9wVHJhbnNpdGlvblRpbWVvdXQgPSBfcHJvcHMyLmJhY2tkcm9wVHJhbnNpdGlvblRpbWVvdXQ7XG5cbiAgICB2YXIgYmFja2Ryb3AgPSBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudCgnZGl2JywgeyByZWY6ICdiYWNrZHJvcCcsXG4gICAgICBzdHlsZTogdGhpcy5wcm9wcy5iYWNrZHJvcFN0eWxlLFxuICAgICAgY2xhc3NOYW1lOiB0aGlzLnByb3BzLmJhY2tkcm9wQ2xhc3NOYW1lLFxuICAgICAgb25DbGljazogdGhpcy5oYW5kbGVCYWNrZHJvcENsaWNrXG4gICAgfSk7XG5cbiAgICBpZiAoVHJhbnNpdGlvbikge1xuICAgICAgYmFja2Ryb3AgPSBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChcbiAgICAgICAgVHJhbnNpdGlvbixcbiAgICAgICAgeyB0cmFuc2l0aW9uQXBwZWFyOiB0cnVlLFxuICAgICAgICAgICdpbic6IHRoaXMucHJvcHMuc2hvdyxcbiAgICAgICAgICB0aW1lb3V0OiBiYWNrZHJvcFRyYW5zaXRpb25UaW1lb3V0XG4gICAgICAgIH0sXG4gICAgICAgIGJhY2tkcm9wXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBiYWNrZHJvcDtcbiAgfSxcblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbiBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xuICAgIGlmIChuZXh0UHJvcHMuc2hvdykge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IGV4aXRlZDogZmFsc2UgfSk7XG4gICAgfSBlbHNlIGlmICghbmV4dFByb3BzLnRyYW5zaXRpb24pIHtcbiAgICAgIC8vIE90aGVyd2lzZSBsZXQgaGFuZGxlSGlkZGVuIHRha2UgY2FyZSBvZiBtYXJraW5nIGV4aXRlZC5cbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBleGl0ZWQ6IHRydWUgfSk7XG4gICAgfVxuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxVcGRhdGU6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxVcGRhdGUobmV4dFByb3BzKSB7XG4gICAgaWYgKG5leHRQcm9wcy5zaG93KSB7XG4gICAgICB0aGlzLmNoZWNrRm9yRm9jdXMoKTtcbiAgICB9XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIGlmICh0aGlzLnByb3BzLnNob3cpIHtcbiAgICAgIHRoaXMub25TaG93KCk7XG4gICAgfVxuICB9LFxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZTogZnVuY3Rpb24gY29tcG9uZW50RGlkVXBkYXRlKHByZXZQcm9wcykge1xuICAgIHZhciB0cmFuc2l0aW9uID0gdGhpcy5wcm9wcy50cmFuc2l0aW9uO1xuXG4gICAgaWYgKHByZXZQcm9wcy5zaG93ICYmICF0aGlzLnByb3BzLnNob3cgJiYgIXRyYW5zaXRpb24pIHtcbiAgICAgIC8vIE90aGVyd2lzZSBoYW5kbGVIaWRkZW4gd2lsbCBjYWxsIHRoaXMuXG4gICAgICB0aGlzLm9uSGlkZSgpO1xuICAgIH0gZWxzZSBpZiAoIXByZXZQcm9wcy5zaG93ICYmIHRoaXMucHJvcHMuc2hvdykge1xuICAgICAgdGhpcy5vblNob3coKTtcbiAgICB9XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHZhciBfcHJvcHMzID0gdGhpcy5wcm9wcztcbiAgICB2YXIgc2hvdyA9IF9wcm9wczMuc2hvdztcbiAgICB2YXIgdHJhbnNpdGlvbiA9IF9wcm9wczMudHJhbnNpdGlvbjtcblxuICAgIGlmIChzaG93IHx8IHRyYW5zaXRpb24gJiYgIXRoaXMuc3RhdGUuZXhpdGVkKSB7XG4gICAgICB0aGlzLm9uSGlkZSgpO1xuICAgIH1cbiAgfSxcblxuICBvblNob3c6IGZ1bmN0aW9uIG9uU2hvdygpIHtcbiAgICB2YXIgZG9jID0gX3V0aWxzT3duZXJEb2N1bWVudDJbJ2RlZmF1bHQnXSh0aGlzKTtcbiAgICB2YXIgY29udGFpbmVyID0gX3V0aWxzR2V0Q29udGFpbmVyMlsnZGVmYXVsdCddKHRoaXMucHJvcHMuY29udGFpbmVyLCBkb2MuYm9keSk7XG5cbiAgICBtb2RhbE1hbmFnZXIuYWRkKHRoaXMsIGNvbnRhaW5lciwgdGhpcy5wcm9wcy5jb250YWluZXJDbGFzc05hbWUpO1xuXG4gICAgdGhpcy5fb25Eb2N1bWVudEtleXVwTGlzdGVuZXIgPSBfdXRpbHNBZGRFdmVudExpc3RlbmVyMlsnZGVmYXVsdCddKGRvYywgJ2tleXVwJywgdGhpcy5oYW5kbGVEb2N1bWVudEtleVVwKTtcblxuICAgIHRoaXMuX29uRm9jdXNpbkxpc3RlbmVyID0gX3V0aWxzQWRkRm9jdXNMaXN0ZW5lcjJbJ2RlZmF1bHQnXSh0aGlzLmVuZm9yY2VGb2N1cyk7XG5cbiAgICB0aGlzLmZvY3VzKCk7XG5cbiAgICBpZiAodGhpcy5wcm9wcy5vblNob3cpIHtcbiAgICAgIHRoaXMucHJvcHMub25TaG93KCk7XG4gICAgfVxuICB9LFxuXG4gIG9uSGlkZTogZnVuY3Rpb24gb25IaWRlKCkge1xuICAgIG1vZGFsTWFuYWdlci5yZW1vdmUodGhpcyk7XG5cbiAgICB0aGlzLl9vbkRvY3VtZW50S2V5dXBMaXN0ZW5lci5yZW1vdmUoKTtcblxuICAgIHRoaXMuX29uRm9jdXNpbkxpc3RlbmVyLnJlbW92ZSgpO1xuXG4gICAgdGhpcy5yZXN0b3JlTGFzdEZvY3VzKCk7XG4gIH0sXG5cbiAgc2V0TW91bnROb2RlOiBmdW5jdGlvbiBzZXRNb3VudE5vZGUocmVmKSB7XG4gICAgdGhpcy5tb3VudE5vZGUgPSByZWYgPyByZWYuZ2V0TW91bnROb2RlKCkgOiByZWY7XG4gIH0sXG5cbiAgaGFuZGxlSGlkZGVuOiBmdW5jdGlvbiBoYW5kbGVIaWRkZW4oKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGV4aXRlZDogdHJ1ZSB9KTtcbiAgICB0aGlzLm9uSGlkZSgpO1xuXG4gICAgaWYgKHRoaXMucHJvcHMub25FeGl0ZWQpIHtcbiAgICAgIHZhciBfcHJvcHM0O1xuXG4gICAgICAoX3Byb3BzNCA9IHRoaXMucHJvcHMpLm9uRXhpdGVkLmFwcGx5KF9wcm9wczQsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9LFxuXG4gIGhhbmRsZUJhY2tkcm9wQ2xpY2s6IGZ1bmN0aW9uIGhhbmRsZUJhY2tkcm9wQ2xpY2soZSkge1xuICAgIGlmIChlLnRhcmdldCAhPT0gZS5jdXJyZW50VGFyZ2V0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMub25CYWNrZHJvcENsaWNrKSB7XG4gICAgICB0aGlzLnByb3BzLm9uQmFja2Ryb3BDbGljayhlKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy5iYWNrZHJvcCA9PT0gdHJ1ZSkge1xuICAgICAgdGhpcy5wcm9wcy5vbkhpZGUoKTtcbiAgICB9XG4gIH0sXG5cbiAgaGFuZGxlRG9jdW1lbnRLZXlVcDogZnVuY3Rpb24gaGFuZGxlRG9jdW1lbnRLZXlVcChlKSB7XG4gICAgaWYgKHRoaXMucHJvcHMua2V5Ym9hcmQgJiYgZS5rZXlDb2RlID09PSAyNyAmJiB0aGlzLmlzVG9wTW9kYWwoKSkge1xuICAgICAgaWYgKHRoaXMucHJvcHMub25Fc2NhcGVLZXlVcCkge1xuICAgICAgICB0aGlzLnByb3BzLm9uRXNjYXBlS2V5VXAoZSk7XG4gICAgICB9XG4gICAgICB0aGlzLnByb3BzLm9uSGlkZSgpO1xuICAgIH1cbiAgfSxcblxuICBjaGVja0ZvckZvY3VzOiBmdW5jdGlvbiBjaGVja0ZvckZvY3VzKCkge1xuICAgIGlmIChfZG9tSGVscGVyc1V0aWxJbkRPTTJbJ2RlZmF1bHQnXSkge1xuICAgICAgdGhpcy5sYXN0Rm9jdXMgPSBfZG9tSGVscGVyc0FjdGl2ZUVsZW1lbnQyWydkZWZhdWx0J10oKTtcbiAgICB9XG4gIH0sXG5cbiAgZm9jdXM6IGZ1bmN0aW9uIGZvY3VzKCkge1xuICAgIHZhciBhdXRvRm9jdXMgPSB0aGlzLnByb3BzLmF1dG9Gb2N1cztcbiAgICB2YXIgbW9kYWxDb250ZW50ID0gdGhpcy5nZXREaWFsb2dFbGVtZW50KCk7XG4gICAgdmFyIGN1cnJlbnQgPSBfZG9tSGVscGVyc0FjdGl2ZUVsZW1lbnQyWydkZWZhdWx0J10oX3V0aWxzT3duZXJEb2N1bWVudDJbJ2RlZmF1bHQnXSh0aGlzKSk7XG4gICAgdmFyIGZvY3VzSW5Nb2RhbCA9IGN1cnJlbnQgJiYgX2RvbUhlbHBlcnNRdWVyeUNvbnRhaW5zMlsnZGVmYXVsdCddKG1vZGFsQ29udGVudCwgY3VycmVudCk7XG5cbiAgICBpZiAobW9kYWxDb250ZW50ICYmIGF1dG9Gb2N1cyAmJiAhZm9jdXNJbk1vZGFsKSB7XG4gICAgICB0aGlzLmxhc3RGb2N1cyA9IGN1cnJlbnQ7XG5cbiAgICAgIGlmICghbW9kYWxDb250ZW50Lmhhc0F0dHJpYnV0ZSgndGFiSW5kZXgnKSkge1xuICAgICAgICBtb2RhbENvbnRlbnQuc2V0QXR0cmlidXRlKCd0YWJJbmRleCcsIC0xKTtcbiAgICAgICAgX3dhcm5pbmcyWydkZWZhdWx0J10oZmFsc2UsICdUaGUgbW9kYWwgY29udGVudCBub2RlIGRvZXMgbm90IGFjY2VwdCBmb2N1cy4gJyArICdGb3IgdGhlIGJlbmVmaXQgb2YgYXNzaXN0aXZlIHRlY2hub2xvZ2llcywgdGhlIHRhYkluZGV4IG9mIHRoZSBub2RlIGlzIGJlaW5nIHNldCB0byBcIi0xXCIuJyk7XG4gICAgICB9XG5cbiAgICAgIG1vZGFsQ29udGVudC5mb2N1cygpO1xuICAgIH1cbiAgfSxcblxuICByZXN0b3JlTGFzdEZvY3VzOiBmdW5jdGlvbiByZXN0b3JlTGFzdEZvY3VzKCkge1xuICAgIC8vIFN1cHBvcnQ6IDw9SUUxMSBkb2Vzbid0IHN1cHBvcnQgYGZvY3VzKClgIG9uIHN2ZyBlbGVtZW50cyAoUkI6ICM5MTcpXG4gICAgaWYgKHRoaXMubGFzdEZvY3VzICYmIHRoaXMubGFzdEZvY3VzLmZvY3VzKSB7XG4gICAgICB0aGlzLmxhc3RGb2N1cy5mb2N1cygpO1xuICAgICAgdGhpcy5sYXN0Rm9jdXMgPSBudWxsO1xuICAgIH1cbiAgfSxcblxuICBlbmZvcmNlRm9jdXM6IGZ1bmN0aW9uIGVuZm9yY2VGb2N1cygpIHtcbiAgICB2YXIgZW5mb3JjZUZvY3VzID0gdGhpcy5wcm9wcy5lbmZvcmNlRm9jdXM7XG5cbiAgICBpZiAoIWVuZm9yY2VGb2N1cyB8fCAhdGhpcy5pc01vdW50ZWQoKSB8fCAhdGhpcy5pc1RvcE1vZGFsKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgYWN0aXZlID0gX2RvbUhlbHBlcnNBY3RpdmVFbGVtZW50MlsnZGVmYXVsdCddKF91dGlsc093bmVyRG9jdW1lbnQyWydkZWZhdWx0J10odGhpcykpO1xuICAgIHZhciBtb2RhbCA9IHRoaXMuZ2V0RGlhbG9nRWxlbWVudCgpO1xuXG4gICAgaWYgKG1vZGFsICYmIG1vZGFsICE9PSBhY3RpdmUgJiYgIV9kb21IZWxwZXJzUXVlcnlDb250YWluczJbJ2RlZmF1bHQnXShtb2RhbCwgYWN0aXZlKSkge1xuICAgICAgbW9kYWwuZm9jdXMoKTtcbiAgICB9XG4gIH0sXG5cbiAgLy9pbnN0ZWFkIG9mIGEgcmVmLCB3aGljaCBtaWdodCBjb25mbGljdCB3aXRoIG9uZSB0aGUgcGFyZW50IGFwcGxpZWQuXG4gIGdldERpYWxvZ0VsZW1lbnQ6IGZ1bmN0aW9uIGdldERpYWxvZ0VsZW1lbnQoKSB7XG4gICAgdmFyIG5vZGUgPSB0aGlzLnJlZnMubW9kYWw7XG4gICAgcmV0dXJuIG5vZGUgJiYgbm9kZS5sYXN0Q2hpbGQ7XG4gIH0sXG5cbiAgaXNUb3BNb2RhbDogZnVuY3Rpb24gaXNUb3BNb2RhbCgpIHtcbiAgICByZXR1cm4gbW9kYWxNYW5hZ2VyLmlzVG9wTW9kYWwodGhpcyk7XG4gIH1cblxufSk7XG5cbk1vZGFsLm1hbmFnZXIgPSBtb2RhbE1hbmFnZXI7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IE1vZGFsO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uJyk7IH0gfVxuXG52YXIgX2RvbUhlbHBlcnNTdHlsZSA9IHJlcXVpcmUoJ2RvbS1oZWxwZXJzL3N0eWxlJyk7XG5cbnZhciBfZG9tSGVscGVyc1N0eWxlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2RvbUhlbHBlcnNTdHlsZSk7XG5cbnZhciBfZG9tSGVscGVyc0NsYXNzID0gcmVxdWlyZSgnZG9tLWhlbHBlcnMvY2xhc3MnKTtcblxudmFyIF9kb21IZWxwZXJzQ2xhc3MyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZG9tSGVscGVyc0NsYXNzKTtcblxudmFyIF9kb21IZWxwZXJzVXRpbFNjcm9sbGJhclNpemUgPSByZXF1aXJlKCdkb20taGVscGVycy91dGlsL3Njcm9sbGJhclNpemUnKTtcblxudmFyIF9kb21IZWxwZXJzVXRpbFNjcm9sbGJhclNpemUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZG9tSGVscGVyc1V0aWxTY3JvbGxiYXJTaXplKTtcblxudmFyIF91dGlsc0lzT3ZlcmZsb3dpbmcgPSByZXF1aXJlKCcuL3V0aWxzL2lzT3ZlcmZsb3dpbmcnKTtcblxudmFyIF91dGlsc0lzT3ZlcmZsb3dpbmcyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdXRpbHNJc092ZXJmbG93aW5nKTtcblxudmFyIF91dGlsc01hbmFnZUFyaWFIaWRkZW4gPSByZXF1aXJlKCcuL3V0aWxzL21hbmFnZUFyaWFIaWRkZW4nKTtcblxuZnVuY3Rpb24gZmluZEluZGV4T2YoYXJyLCBjYikge1xuICB2YXIgaWR4ID0gLTE7XG4gIGFyci5zb21lKGZ1bmN0aW9uIChkLCBpKSB7XG4gICAgaWYgKGNiKGQsIGkpKSB7XG4gICAgICBpZHggPSBpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGlkeDtcbn1cblxuZnVuY3Rpb24gZmluZENvbnRhaW5lcihkYXRhLCBtb2RhbCkge1xuICByZXR1cm4gZmluZEluZGV4T2YoZGF0YSwgZnVuY3Rpb24gKGQpIHtcbiAgICByZXR1cm4gZC5tb2RhbHMuaW5kZXhPZihtb2RhbCkgIT09IC0xO1xuICB9KTtcbn1cblxuLyoqXG4gKiBQcm9wZXIgc3RhdGUgbWFuYWdtZW50IGZvciBjb250YWluZXJzIGFuZCB0aGUgbW9kYWxzIGluIHRob3NlIGNvbnRhaW5lcnMuXG4gKlxuICogQGludGVybmFsIFVzZWQgYnkgdGhlIE1vZGFsIHRvIGVuc3VyZSBwcm9wZXIgc3R5bGluZyBvZiBjb250YWluZXJzLlxuICovXG5cbnZhciBNb2RhbE1hbmFnZXIgPSAoZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBNb2RhbE1hbmFnZXIoKSB7XG4gICAgdmFyIGhpZGVTaWJsaW5nTm9kZXMgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgfHwgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyB0cnVlIDogYXJndW1lbnRzWzBdO1xuXG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIE1vZGFsTWFuYWdlcik7XG5cbiAgICB0aGlzLmhpZGVTaWJsaW5nTm9kZXMgPSBoaWRlU2libGluZ05vZGVzO1xuICAgIHRoaXMubW9kYWxzID0gW107XG4gICAgdGhpcy5jb250YWluZXJzID0gW107XG4gICAgdGhpcy5kYXRhID0gW107XG4gIH1cblxuICBNb2RhbE1hbmFnZXIucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIGFkZChtb2RhbCwgY29udGFpbmVyLCBjbGFzc05hbWUpIHtcbiAgICB2YXIgbW9kYWxJZHggPSB0aGlzLm1vZGFscy5pbmRleE9mKG1vZGFsKTtcbiAgICB2YXIgY29udGFpbmVySWR4ID0gdGhpcy5jb250YWluZXJzLmluZGV4T2YoY29udGFpbmVyKTtcblxuICAgIGlmIChtb2RhbElkeCAhPT0gLTEpIHtcbiAgICAgIHJldHVybiBtb2RhbElkeDtcbiAgICB9XG5cbiAgICBtb2RhbElkeCA9IHRoaXMubW9kYWxzLmxlbmd0aDtcbiAgICB0aGlzLm1vZGFscy5wdXNoKG1vZGFsKTtcblxuICAgIGlmICh0aGlzLmhpZGVTaWJsaW5nTm9kZXMpIHtcbiAgICAgIF91dGlsc01hbmFnZUFyaWFIaWRkZW4uaGlkZVNpYmxpbmdzKGNvbnRhaW5lciwgbW9kYWwubW91bnROb2RlKTtcbiAgICB9XG5cbiAgICBpZiAoY29udGFpbmVySWR4ICE9PSAtMSkge1xuICAgICAgdGhpcy5kYXRhW2NvbnRhaW5lcklkeF0ubW9kYWxzLnB1c2gobW9kYWwpO1xuICAgICAgcmV0dXJuIG1vZGFsSWR4O1xuICAgIH1cblxuICAgIHZhciBkYXRhID0ge1xuICAgICAgbW9kYWxzOiBbbW9kYWxdLFxuICAgICAgLy9yaWdodCBub3cgb25seSB0aGUgZmlyc3QgbW9kYWwgb2YgYSBjb250YWluZXIgd2lsbCBoYXZlIGl0cyBjbGFzc2VzIGFwcGxpZWRcbiAgICAgIGNsYXNzZXM6IGNsYXNzTmFtZSA/IGNsYXNzTmFtZS5zcGxpdCgvXFxzKy8pIDogW10sXG4gICAgICAvL3dlIGFyZSBvbmx5IGludGVyZXN0ZWQgaW4gdGhlIGFjdHVhbCBgc3R5bGVgIGhlcmUgYmVjYXN1ZSB3ZSB3aWxsIG92ZXJyaWRlIGl0XG4gICAgICBzdHlsZToge1xuICAgICAgICBvdmVyZmxvdzogY29udGFpbmVyLnN0eWxlLm92ZXJmbG93LFxuICAgICAgICBwYWRkaW5nUmlnaHQ6IGNvbnRhaW5lci5zdHlsZS5wYWRkaW5nUmlnaHRcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIHN0eWxlID0geyBvdmVyZmxvdzogJ2hpZGRlbicgfTtcblxuICAgIGRhdGEub3ZlcmZsb3dpbmcgPSBfdXRpbHNJc092ZXJmbG93aW5nMlsnZGVmYXVsdCddKGNvbnRhaW5lcik7XG5cbiAgICBpZiAoZGF0YS5vdmVyZmxvd2luZykge1xuICAgICAgLy8gdXNlIGNvbXB1dGVkIHN0eWxlLCBoZXJlIHRvIGdldCB0aGUgcmVhbCBwYWRkaW5nXG4gICAgICAvLyB0byBhZGQgb3VyIHNjcm9sbGJhciB3aWR0aFxuICAgICAgc3R5bGUucGFkZGluZ1JpZ2h0ID0gcGFyc2VJbnQoX2RvbUhlbHBlcnNTdHlsZTJbJ2RlZmF1bHQnXShjb250YWluZXIsICdwYWRkaW5nUmlnaHQnKSB8fCAwLCAxMCkgKyBfZG9tSGVscGVyc1V0aWxTY3JvbGxiYXJTaXplMlsnZGVmYXVsdCddKCkgKyAncHgnO1xuICAgIH1cblxuICAgIF9kb21IZWxwZXJzU3R5bGUyWydkZWZhdWx0J10oY29udGFpbmVyLCBzdHlsZSk7XG5cbiAgICBkYXRhLmNsYXNzZXMuZm9yRWFjaChfZG9tSGVscGVyc0NsYXNzMlsnZGVmYXVsdCddLmFkZENsYXNzLmJpbmQobnVsbCwgY29udGFpbmVyKSk7XG5cbiAgICB0aGlzLmNvbnRhaW5lcnMucHVzaChjb250YWluZXIpO1xuICAgIHRoaXMuZGF0YS5wdXNoKGRhdGEpO1xuXG4gICAgcmV0dXJuIG1vZGFsSWR4O1xuICB9O1xuXG4gIE1vZGFsTWFuYWdlci5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gcmVtb3ZlKG1vZGFsKSB7XG4gICAgdmFyIG1vZGFsSWR4ID0gdGhpcy5tb2RhbHMuaW5kZXhPZihtb2RhbCk7XG5cbiAgICBpZiAobW9kYWxJZHggPT09IC0xKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGNvbnRhaW5lcklkeCA9IGZpbmRDb250YWluZXIodGhpcy5kYXRhLCBtb2RhbCk7XG4gICAgdmFyIGRhdGEgPSB0aGlzLmRhdGFbY29udGFpbmVySWR4XTtcbiAgICB2YXIgY29udGFpbmVyID0gdGhpcy5jb250YWluZXJzW2NvbnRhaW5lcklkeF07XG5cbiAgICBkYXRhLm1vZGFscy5zcGxpY2UoZGF0YS5tb2RhbHMuaW5kZXhPZihtb2RhbCksIDEpO1xuXG4gICAgdGhpcy5tb2RhbHMuc3BsaWNlKG1vZGFsSWR4LCAxKTtcblxuICAgIC8vIGlmIHRoYXQgd2FzIHRoZSBsYXN0IG1vZGFsIGluIGEgY29udGFpbmVyLFxuICAgIC8vIGNsZWFuIHVwIHRoZSBjb250YWluZXIgc3R5bGluaGcuXG4gICAgaWYgKGRhdGEubW9kYWxzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgT2JqZWN0LmtleXMoZGF0YS5zdHlsZSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIHJldHVybiBjb250YWluZXIuc3R5bGVba2V5XSA9IGRhdGEuc3R5bGVba2V5XTtcbiAgICAgIH0pO1xuXG4gICAgICBkYXRhLmNsYXNzZXMuZm9yRWFjaChfZG9tSGVscGVyc0NsYXNzMlsnZGVmYXVsdCddLnJlbW92ZUNsYXNzLmJpbmQobnVsbCwgY29udGFpbmVyKSk7XG5cbiAgICAgIGlmICh0aGlzLmhpZGVTaWJsaW5nTm9kZXMpIHtcbiAgICAgICAgX3V0aWxzTWFuYWdlQXJpYUhpZGRlbi5zaG93U2libGluZ3MoY29udGFpbmVyLCBtb2RhbC5tb3VudE5vZGUpO1xuICAgICAgfVxuICAgICAgdGhpcy5jb250YWluZXJzLnNwbGljZShjb250YWluZXJJZHgsIDEpO1xuICAgICAgdGhpcy5kYXRhLnNwbGljZShjb250YWluZXJJZHgsIDEpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5oaWRlU2libGluZ05vZGVzKSB7XG4gICAgICAvL290aGVyd2lzZSBtYWtlIHN1cmUgdGhlIG5leHQgdG9wIG1vZGFsIGlzIHZpc2libGUgdG8gYSBTUlxuICAgICAgX3V0aWxzTWFuYWdlQXJpYUhpZGRlbi5hcmlhSGlkZGVuKGZhbHNlLCBkYXRhLm1vZGFsc1tkYXRhLm1vZGFscy5sZW5ndGggLSAxXS5tb3VudE5vZGUpO1xuICAgIH1cbiAgfTtcblxuICBNb2RhbE1hbmFnZXIucHJvdG90eXBlLmlzVG9wTW9kYWwgPSBmdW5jdGlvbiBpc1RvcE1vZGFsKG1vZGFsKSB7XG4gICAgcmV0dXJuICEhdGhpcy5tb2RhbHMubGVuZ3RoICYmIHRoaXMubW9kYWxzW3RoaXMubW9kYWxzLmxlbmd0aCAtIDFdID09PSBtb2RhbDtcbiAgfTtcblxuICByZXR1cm4gTW9kYWxNYW5hZ2VyO1xufSkoKTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gTW9kYWxNYW5hZ2VyO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfcmVhY3QgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snUmVhY3QnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1JlYWN0J10gOiBudWxsKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfcmVhY3REb20gPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snUmVhY3RET00nXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1JlYWN0RE9NJ10gOiBudWxsKTtcblxudmFyIF9yZWFjdERvbTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdERvbSk7XG5cbnZhciBfcmVhY3RQcm9wVHlwZXNMaWJNb3VudGFibGUgPSByZXF1aXJlKCdyZWFjdC1wcm9wLXR5cGVzL2xpYi9tb3VudGFibGUnKTtcblxudmFyIF9yZWFjdFByb3BUeXBlc0xpYk1vdW50YWJsZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdFByb3BUeXBlc0xpYk1vdW50YWJsZSk7XG5cbnZhciBfdXRpbHNPd25lckRvY3VtZW50ID0gcmVxdWlyZSgnLi91dGlscy9vd25lckRvY3VtZW50Jyk7XG5cbnZhciBfdXRpbHNPd25lckRvY3VtZW50MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3V0aWxzT3duZXJEb2N1bWVudCk7XG5cbnZhciBfdXRpbHNHZXRDb250YWluZXIgPSByZXF1aXJlKCcuL3V0aWxzL2dldENvbnRhaW5lcicpO1xuXG52YXIgX3V0aWxzR2V0Q29udGFpbmVyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3V0aWxzR2V0Q29udGFpbmVyKTtcblxuLyoqXG4gKiBUaGUgYDxQb3J0YWwvPmAgY29tcG9uZW50IHJlbmRlcnMgaXRzIGNoaWxkcmVuIGludG8gYSBuZXcgXCJzdWJ0cmVlXCIgb3V0c2lkZSBvZiBjdXJyZW50IGNvbXBvbmVudCBoaWVyYXJjaHkuXG4gKiBZb3UgY2FuIHRoaW5rIG9mIGl0IGFzIGEgZGVjbGFyYXRpdmUgYGFwcGVuZENoaWxkKClgLCBvciBqUXVlcnkncyBgJC5mbi5hcHBlbmRUbygpYC5cbiAqIFRoZSBjaGlsZHJlbiBvZiBgPFBvcnRhbC8+YCBjb21wb25lbnQgd2lsbCBiZSBhcHBlbmRlZCB0byB0aGUgYGNvbnRhaW5lcmAgc3BlY2lmaWVkLlxuICovXG52YXIgUG9ydGFsID0gX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUNsYXNzKHtcblxuICBkaXNwbGF5TmFtZTogJ1BvcnRhbCcsXG5cbiAgcHJvcFR5cGVzOiB7XG4gICAgLyoqXG4gICAgICogQSBOb2RlLCBDb21wb25lbnQgaW5zdGFuY2UsIG9yIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBlaXRoZXIuIFRoZSBgY29udGFpbmVyYCB3aWxsIGhhdmUgdGhlIFBvcnRhbCBjaGlsZHJlblxuICAgICAqIGFwcGVuZGVkIHRvIGl0LlxuICAgICAqL1xuICAgIGNvbnRhaW5lcjogX3JlYWN0MlsnZGVmYXVsdCddLlByb3BUeXBlcy5vbmVPZlR5cGUoW19yZWFjdFByb3BUeXBlc0xpYk1vdW50YWJsZTJbJ2RlZmF1bHQnXSwgX3JlYWN0MlsnZGVmYXVsdCddLlByb3BUeXBlcy5mdW5jXSlcbiAgfSxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5fcmVuZGVyT3ZlcmxheSgpO1xuICB9LFxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZTogZnVuY3Rpb24gY29tcG9uZW50RGlkVXBkYXRlKCkge1xuICAgIHRoaXMuX3JlbmRlck92ZXJsYXkoKTtcbiAgfSxcblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbiBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xuICAgIGlmICh0aGlzLl9vdmVybGF5VGFyZ2V0ICYmIG5leHRQcm9wcy5jb250YWluZXIgIT09IHRoaXMucHJvcHMuY29udGFpbmVyKSB7XG4gICAgICB0aGlzLl9wb3J0YWxDb250YWluZXJOb2RlLnJlbW92ZUNoaWxkKHRoaXMuX292ZXJsYXlUYXJnZXQpO1xuICAgICAgdGhpcy5fcG9ydGFsQ29udGFpbmVyTm9kZSA9IF91dGlsc0dldENvbnRhaW5lcjJbJ2RlZmF1bHQnXShuZXh0UHJvcHMuY29udGFpbmVyLCBfdXRpbHNPd25lckRvY3VtZW50MlsnZGVmYXVsdCddKHRoaXMpLmJvZHkpO1xuICAgICAgdGhpcy5fcG9ydGFsQ29udGFpbmVyTm9kZS5hcHBlbmRDaGlsZCh0aGlzLl9vdmVybGF5VGFyZ2V0KTtcbiAgICB9XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHRoaXMuX3VucmVuZGVyT3ZlcmxheSgpO1xuICAgIHRoaXMuX3VubW91bnRPdmVybGF5VGFyZ2V0KCk7XG4gIH0sXG5cbiAgX21vdW50T3ZlcmxheVRhcmdldDogZnVuY3Rpb24gX21vdW50T3ZlcmxheVRhcmdldCgpIHtcbiAgICBpZiAoIXRoaXMuX292ZXJsYXlUYXJnZXQpIHtcbiAgICAgIHRoaXMuX292ZXJsYXlUYXJnZXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIHRoaXMuX3BvcnRhbENvbnRhaW5lck5vZGUgPSBfdXRpbHNHZXRDb250YWluZXIyWydkZWZhdWx0J10odGhpcy5wcm9wcy5jb250YWluZXIsIF91dGlsc093bmVyRG9jdW1lbnQyWydkZWZhdWx0J10odGhpcykuYm9keSk7XG4gICAgICB0aGlzLl9wb3J0YWxDb250YWluZXJOb2RlLmFwcGVuZENoaWxkKHRoaXMuX292ZXJsYXlUYXJnZXQpO1xuICAgIH1cbiAgfSxcblxuICBfdW5tb3VudE92ZXJsYXlUYXJnZXQ6IGZ1bmN0aW9uIF91bm1vdW50T3ZlcmxheVRhcmdldCgpIHtcbiAgICBpZiAodGhpcy5fb3ZlcmxheVRhcmdldCkge1xuICAgICAgdGhpcy5fcG9ydGFsQ29udGFpbmVyTm9kZS5yZW1vdmVDaGlsZCh0aGlzLl9vdmVybGF5VGFyZ2V0KTtcbiAgICAgIHRoaXMuX292ZXJsYXlUYXJnZXQgPSBudWxsO1xuICAgIH1cbiAgICB0aGlzLl9wb3J0YWxDb250YWluZXJOb2RlID0gbnVsbDtcbiAgfSxcblxuICBfcmVuZGVyT3ZlcmxheTogZnVuY3Rpb24gX3JlbmRlck92ZXJsYXkoKSB7XG5cbiAgICB2YXIgb3ZlcmxheSA9ICF0aGlzLnByb3BzLmNoaWxkcmVuID8gbnVsbCA6IF9yZWFjdDJbJ2RlZmF1bHQnXS5DaGlsZHJlbi5vbmx5KHRoaXMucHJvcHMuY2hpbGRyZW4pO1xuXG4gICAgLy8gU2F2ZSByZWZlcmVuY2UgZm9yIGZ1dHVyZSBhY2Nlc3MuXG4gICAgaWYgKG92ZXJsYXkgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuX21vdW50T3ZlcmxheVRhcmdldCgpO1xuICAgICAgdGhpcy5fb3ZlcmxheUluc3RhbmNlID0gX3JlYWN0RG9tMlsnZGVmYXVsdCddLnVuc3RhYmxlX3JlbmRlclN1YnRyZWVJbnRvQ29udGFpbmVyKHRoaXMsIG92ZXJsYXksIHRoaXMuX292ZXJsYXlUYXJnZXQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBVbnJlbmRlciBpZiB0aGUgY29tcG9uZW50IGlzIG51bGwgZm9yIHRyYW5zaXRpb25zIHRvIG51bGxcbiAgICAgIHRoaXMuX3VucmVuZGVyT3ZlcmxheSgpO1xuICAgICAgdGhpcy5fdW5tb3VudE92ZXJsYXlUYXJnZXQoKTtcbiAgICB9XG4gIH0sXG5cbiAgX3VucmVuZGVyT3ZlcmxheTogZnVuY3Rpb24gX3VucmVuZGVyT3ZlcmxheSgpIHtcbiAgICBpZiAodGhpcy5fb3ZlcmxheVRhcmdldCkge1xuICAgICAgX3JlYWN0RG9tMlsnZGVmYXVsdCddLnVubW91bnRDb21wb25lbnRBdE5vZGUodGhpcy5fb3ZlcmxheVRhcmdldCk7XG4gICAgICB0aGlzLl9vdmVybGF5SW5zdGFuY2UgPSBudWxsO1xuICAgIH1cbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfSxcblxuICBnZXRNb3VudE5vZGU6IGZ1bmN0aW9uIGdldE1vdW50Tm9kZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fb3ZlcmxheVRhcmdldDtcbiAgfSxcblxuICBnZXRPdmVybGF5RE9NTm9kZTogZnVuY3Rpb24gZ2V0T3ZlcmxheURPTU5vZGUoKSB7XG4gICAgaWYgKCF0aGlzLmlzTW91bnRlZCgpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2dldE92ZXJsYXlET01Ob2RlKCk6IEEgY29tcG9uZW50IG11c3QgYmUgbW91bnRlZCB0byBoYXZlIGEgRE9NIG5vZGUuJyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX292ZXJsYXlJbnN0YW5jZSkge1xuICAgICAgaWYgKHRoaXMuX292ZXJsYXlJbnN0YW5jZS5nZXRXcmFwcGVkRE9NTm9kZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fb3ZlcmxheUluc3RhbmNlLmdldFdyYXBwZWRET01Ob2RlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gX3JlYWN0RG9tMlsnZGVmYXVsdCddLmZpbmRET01Ob2RlKHRoaXMuX292ZXJsYXlJbnN0YW5jZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxufSk7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IFBvcnRhbDtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX2RvbUhlbHBlcnNFdmVudHNPbiA9IHJlcXVpcmUoJ2RvbS1oZWxwZXJzL2V2ZW50cy9vbicpO1xuXG52YXIgX2RvbUhlbHBlcnNFdmVudHNPbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9kb21IZWxwZXJzRXZlbnRzT24pO1xuXG52YXIgX2RvbUhlbHBlcnNFdmVudHNPZmYgPSByZXF1aXJlKCdkb20taGVscGVycy9ldmVudHMvb2ZmJyk7XG5cbnZhciBfZG9tSGVscGVyc0V2ZW50c09mZjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9kb21IZWxwZXJzRXZlbnRzT2ZmKTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gZnVuY3Rpb24gKG5vZGUsIGV2ZW50LCBoYW5kbGVyKSB7XG4gIF9kb21IZWxwZXJzRXZlbnRzT24yWydkZWZhdWx0J10obm9kZSwgZXZlbnQsIGhhbmRsZXIpO1xuICByZXR1cm4ge1xuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgX2RvbUhlbHBlcnNFdmVudHNPZmYyWydkZWZhdWx0J10obm9kZSwgZXZlbnQsIGhhbmRsZXIpO1xuICAgIH1cbiAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIi8qKlxuICogRmlyZWZveCBkb2Vzbid0IGhhdmUgYSBmb2N1c2luIGV2ZW50IHNvIHVzaW5nIGNhcHR1cmUgaXMgZWFzaWVzdCB3YXkgdG8gZ2V0IGJ1YmJsaW5nXG4gKiBJRTggY2FuJ3QgZG8gYWRkRXZlbnRMaXN0ZW5lciwgYnV0IGRvZXMgaGF2ZSBvbmZvY3VzaW4sIHNvIHdlIHVzZSB0aGF0IGluIGllOFxuICpcbiAqIFdlIG9ubHkgYWxsb3cgb25lIExpc3RlbmVyIGF0IGEgdGltZSB0byBhdm9pZCBzdGFjayBvdmVyZmxvd3NcbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1snZGVmYXVsdCddID0gYWRkRm9jdXNMaXN0ZW5lcjtcblxuZnVuY3Rpb24gYWRkRm9jdXNMaXN0ZW5lcihoYW5kbGVyKSB7XG4gIHZhciB1c2VGb2N1c2luID0gIWRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXI7XG4gIHZhciByZW1vdmUgPSB1bmRlZmluZWQ7XG5cbiAgaWYgKHVzZUZvY3VzaW4pIHtcbiAgICBkb2N1bWVudC5hdHRhY2hFdmVudCgnb25mb2N1c2luJywgaGFuZGxlcik7XG4gICAgcmVtb3ZlID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGRvY3VtZW50LmRldGFjaEV2ZW50KCdvbmZvY3VzaW4nLCBoYW5kbGVyKTtcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgaGFuZGxlciwgdHJ1ZSk7XG4gICAgcmVtb3ZlID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgaGFuZGxlciwgdHJ1ZSk7XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB7IHJlbW92ZTogcmVtb3ZlIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IGdldENvbnRhaW5lcjtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX3JlYWN0RG9tID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1JlYWN0RE9NJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydSZWFjdERPTSddIDogbnVsbCk7XG5cbnZhciBfcmVhY3REb20yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3REb20pO1xuXG5mdW5jdGlvbiBnZXRDb250YWluZXIoY29udGFpbmVyLCBkZWZhdWx0Q29udGFpbmVyKSB7XG4gIGNvbnRhaW5lciA9IHR5cGVvZiBjb250YWluZXIgPT09ICdmdW5jdGlvbicgPyBjb250YWluZXIoKSA6IGNvbnRhaW5lcjtcbiAgcmV0dXJuIF9yZWFjdERvbTJbJ2RlZmF1bHQnXS5maW5kRE9NTm9kZShjb250YWluZXIpIHx8IGRlZmF1bHRDb250YWluZXI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IGlzT3ZlcmZsb3dpbmc7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9kb21IZWxwZXJzUXVlcnlJc1dpbmRvdyA9IHJlcXVpcmUoJ2RvbS1oZWxwZXJzL3F1ZXJ5L2lzV2luZG93Jyk7XG5cbnZhciBfZG9tSGVscGVyc1F1ZXJ5SXNXaW5kb3cyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZG9tSGVscGVyc1F1ZXJ5SXNXaW5kb3cpO1xuXG52YXIgX2RvbUhlbHBlcnNPd25lckRvY3VtZW50ID0gcmVxdWlyZSgnZG9tLWhlbHBlcnMvb3duZXJEb2N1bWVudCcpO1xuXG52YXIgX2RvbUhlbHBlcnNPd25lckRvY3VtZW50MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2RvbUhlbHBlcnNPd25lckRvY3VtZW50KTtcblxuZnVuY3Rpb24gaXNCb2R5KG5vZGUpIHtcbiAgcmV0dXJuIG5vZGUgJiYgbm9kZS50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdib2R5Jztcbn1cblxuZnVuY3Rpb24gYm9keUlzT3ZlcmZsb3dpbmcobm9kZSkge1xuICB2YXIgZG9jID0gX2RvbUhlbHBlcnNPd25lckRvY3VtZW50MlsnZGVmYXVsdCddKG5vZGUpO1xuICB2YXIgd2luID0gX2RvbUhlbHBlcnNRdWVyeUlzV2luZG93MlsnZGVmYXVsdCddKGRvYyk7XG4gIHZhciBmdWxsV2lkdGggPSB3aW4uaW5uZXJXaWR0aDtcblxuICAvLyBTdXBwb3J0OiBpZTgsIG5vIGlubmVyV2lkdGhcbiAgaWYgKCFmdWxsV2lkdGgpIHtcbiAgICB2YXIgZG9jdW1lbnRFbGVtZW50UmVjdCA9IGRvYy5kb2N1bWVudEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgZnVsbFdpZHRoID0gZG9jdW1lbnRFbGVtZW50UmVjdC5yaWdodCAtIE1hdGguYWJzKGRvY3VtZW50RWxlbWVudFJlY3QubGVmdCk7XG4gIH1cblxuICByZXR1cm4gZG9jLmJvZHkuY2xpZW50V2lkdGggPCBmdWxsV2lkdGg7XG59XG5cbmZ1bmN0aW9uIGlzT3ZlcmZsb3dpbmcoY29udGFpbmVyKSB7XG4gIHZhciB3aW4gPSBfZG9tSGVscGVyc1F1ZXJ5SXNXaW5kb3cyWydkZWZhdWx0J10oY29udGFpbmVyKTtcblxuICByZXR1cm4gd2luIHx8IGlzQm9keShjb250YWluZXIpID8gYm9keUlzT3ZlcmZsb3dpbmcoY29udGFpbmVyKSA6IGNvbnRhaW5lci5zY3JvbGxIZWlnaHQgPiBjb250YWluZXIuY2xpZW50SGVpZ2h0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLmFyaWFIaWRkZW4gPSBhcmlhSGlkZGVuO1xuZXhwb3J0cy5oaWRlU2libGluZ3MgPSBoaWRlU2libGluZ3M7XG5leHBvcnRzLnNob3dTaWJsaW5ncyA9IHNob3dTaWJsaW5ncztcblxudmFyIEJMQUNLTElTVCA9IFsndGVtcGxhdGUnLCAnc2NyaXB0JywgJ3N0eWxlJ107XG5cbnZhciBpc0hpZGFibGUgPSBmdW5jdGlvbiBpc0hpZGFibGUoX3JlZikge1xuICB2YXIgbm9kZVR5cGUgPSBfcmVmLm5vZGVUeXBlO1xuICB2YXIgdGFnTmFtZSA9IF9yZWYudGFnTmFtZTtcbiAgcmV0dXJuIG5vZGVUeXBlID09PSAxICYmIEJMQUNLTElTVC5pbmRleE9mKHRhZ05hbWUudG9Mb3dlckNhc2UoKSkgPT09IC0xO1xufTtcblxudmFyIHNpYmxpbmdzID0gZnVuY3Rpb24gc2libGluZ3MoY29udGFpbmVyLCBtb3VudCwgY2IpIHtcbiAgbW91bnQgPSBbXS5jb25jYXQobW91bnQpO1xuXG4gIFtdLmZvckVhY2guY2FsbChjb250YWluZXIuY2hpbGRyZW4sIGZ1bmN0aW9uIChub2RlKSB7XG4gICAgaWYgKG1vdW50LmluZGV4T2Yobm9kZSkgPT09IC0xICYmIGlzSGlkYWJsZShub2RlKSkge1xuICAgICAgY2Iobm9kZSk7XG4gICAgfVxuICB9KTtcbn07XG5cbmZ1bmN0aW9uIGFyaWFIaWRkZW4oc2hvdywgbm9kZSkge1xuICBpZiAoIW5vZGUpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKHNob3cpIHtcbiAgICBub2RlLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICB9IGVsc2Uge1xuICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWhpZGRlbicpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGhpZGVTaWJsaW5ncyhjb250YWluZXIsIG1vdW50Tm9kZSkge1xuICBzaWJsaW5ncyhjb250YWluZXIsIG1vdW50Tm9kZSwgZnVuY3Rpb24gKG5vZGUpIHtcbiAgICByZXR1cm4gYXJpYUhpZGRlbih0cnVlLCBub2RlKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHNob3dTaWJsaW5ncyhjb250YWluZXIsIG1vdW50Tm9kZSkge1xuICBzaWJsaW5ncyhjb250YWluZXIsIG1vdW50Tm9kZSwgZnVuY3Rpb24gKG5vZGUpIHtcbiAgICByZXR1cm4gYXJpYUhpZGRlbihmYWxzZSwgbm9kZSk7XG4gIH0pO1xufSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX3JlYWN0RG9tID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1JlYWN0RE9NJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydSZWFjdERPTSddIDogbnVsbCk7XG5cbnZhciBfcmVhY3REb20yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3REb20pO1xuXG52YXIgX2RvbUhlbHBlcnNPd25lckRvY3VtZW50ID0gcmVxdWlyZSgnZG9tLWhlbHBlcnMvb3duZXJEb2N1bWVudCcpO1xuXG52YXIgX2RvbUhlbHBlcnNPd25lckRvY3VtZW50MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2RvbUhlbHBlcnNPd25lckRvY3VtZW50KTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gZnVuY3Rpb24gKGNvbXBvbmVudE9yRWxlbWVudCkge1xuICByZXR1cm4gX2RvbUhlbHBlcnNPd25lckRvY3VtZW50MlsnZGVmYXVsdCddKF9yZWFjdERvbTJbJ2RlZmF1bHQnXS5maW5kRE9NTm9kZShjb21wb25lbnRPckVsZW1lbnQpKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuZXJyTXNnID0gZXJyTXNnO1xuZXhwb3J0cy5jcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlciA9IGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyO1xuXG5mdW5jdGlvbiBlcnJNc2cocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBtc2dDb250aW51YXRpb24pIHtcbiAgcmV0dXJuICdJbnZhbGlkIHByb3AgXFwnJyArIHByb3BOYW1lICsgJ1xcJyBvZiB2YWx1ZSBcXCcnICsgcHJvcHNbcHJvcE5hbWVdICsgJ1xcJycgKyAoJyBzdXBwbGllZCB0byBcXCcnICsgY29tcG9uZW50TmFtZSArICdcXCcnICsgbXNnQ29udGludWF0aW9uKTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgY2hhaW4tYWJsZSBpc1JlcXVpcmVkIHZhbGlkYXRvclxuICpcbiAqIExhcmdlbHkgY29waWVkIGRpcmVjdGx5IGZyb206XG4gKiAgaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlYWN0L2Jsb2IvMC4xMS1zdGFibGUvc3JjL2NvcmUvUmVhY3RQcm9wVHlwZXMuanMjTDk0XG4gKi9cblxuZnVuY3Rpb24gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpIHtcbiAgZnVuY3Rpb24gY2hlY2tUeXBlKGlzUmVxdWlyZWQsIHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSkge1xuICAgIGNvbXBvbmVudE5hbWUgPSBjb21wb25lbnROYW1lIHx8ICc8PGFub255bW91cz4+JztcbiAgICBpZiAocHJvcHNbcHJvcE5hbWVdID09IG51bGwpIHtcbiAgICAgIGlmIChpc1JlcXVpcmVkKSB7XG4gICAgICAgIHJldHVybiBuZXcgRXJyb3IoJ1JlcXVpcmVkIHByb3AgXFwnJyArIHByb3BOYW1lICsgJ1xcJyB3YXMgbm90IHNwZWNpZmllZCBpbiBcXCcnICsgY29tcG9uZW50TmFtZSArICdcXCcuJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBjaGFpbmVkQ2hlY2tUeXBlID0gY2hlY2tUeXBlLmJpbmQobnVsbCwgZmFsc2UpO1xuICBjaGFpbmVkQ2hlY2tUeXBlLmlzUmVxdWlyZWQgPSBjaGVja1R5cGUuYmluZChudWxsLCB0cnVlKTtcblxuICByZXR1cm4gY2hhaW5lZENoZWNrVHlwZTtcbn0iLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9yZWFjdCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydSZWFjdCddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnUmVhY3QnXSA6IG51bGwpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIF9jb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xuXG4vKipcbiAqIENoZWNrcyB3aGV0aGVyIGEgcHJvcCBwcm92aWRlcyBhIHR5cGUgb2YgZWxlbWVudC5cbiAqXG4gKiBUaGUgdHlwZSBvZiBlbGVtZW50IGNhbiBiZSBwcm92aWRlZCBpbiB0d28gZm9ybXM6XG4gKiAtIHRhZyBuYW1lIChzdHJpbmcpXG4gKiAtIGEgcmV0dXJuIHZhbHVlIG9mIFJlYWN0LmNyZWF0ZUNsYXNzKC4uLilcbiAqXG4gKiBAcGFyYW0gcHJvcHNcbiAqIEBwYXJhbSBwcm9wTmFtZVxuICogQHBhcmFtIGNvbXBvbmVudE5hbWVcbiAqIEByZXR1cm5zIHtFcnJvcnx1bmRlZmluZWR9XG4gKi9cblxuZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lKSB7XG4gIHZhciBlcnJCZWdpbm5pbmcgPSBfY29tbW9uLmVyck1zZyhwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsICcuIEV4cGVjdGVkIGFuIEVsZW1lbnQgYHR5cGVgJyk7XG5cbiAgaWYgKHR5cGVvZiBwcm9wc1twcm9wTmFtZV0gIT09ICdmdW5jdGlvbicpIHtcbiAgICBpZiAoX3JlYWN0MlsnZGVmYXVsdCddLmlzVmFsaWRFbGVtZW50KHByb3BzW3Byb3BOYW1lXSkpIHtcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoZXJyQmVnaW5uaW5nICsgJywgbm90IGFuIGFjdHVhbCBFbGVtZW50Jyk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBwcm9wc1twcm9wTmFtZV0gIT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gbmV3IEVycm9yKGVyckJlZ2lubmluZyArICcgc3VjaCBhcyBhIHRhZyBuYW1lIG9yIHJldHVybiB2YWx1ZSBvZiBSZWFjdC5jcmVhdGVDbGFzcyguLi4pJyk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IF9jb21tb24uY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2NvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG5cbi8qKlxuICogQ2hlY2tzIHdoZXRoZXIgYSBwcm9wIHByb3ZpZGVzIGEgRE9NIGVsZW1lbnRcbiAqXG4gKiBUaGUgZWxlbWVudCBjYW4gYmUgcHJvdmlkZWQgaW4gdHdvIGZvcm1zOlxuICogLSBEaXJlY3RseSBwYXNzZWRcbiAqIC0gT3IgcGFzc2VkIGFuIG9iamVjdCB0aGF0IGhhcyBhIGByZW5kZXJgIG1ldGhvZFxuICpcbiAqIEBwYXJhbSBwcm9wc1xuICogQHBhcmFtIHByb3BOYW1lXG4gKiBAcGFyYW0gY29tcG9uZW50TmFtZVxuICogQHJldHVybnMge0Vycm9yfHVuZGVmaW5lZH1cbiAqL1xuXG5mdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUpIHtcbiAgaWYgKHR5cGVvZiBwcm9wc1twcm9wTmFtZV0gIT09ICdvYmplY3QnIHx8IHR5cGVvZiBwcm9wc1twcm9wTmFtZV0ucmVuZGVyICE9PSAnZnVuY3Rpb24nICYmIHByb3BzW3Byb3BOYW1lXS5ub2RlVHlwZSAhPT0gMSkge1xuICAgIHJldHVybiBuZXcgRXJyb3IoX2NvbW1vbi5lcnJNc2cocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCAnLCBleHBlY3RlZCBhIERPTSBlbGVtZW50IG9yIGFuIG9iamVjdCB0aGF0IGhhcyBhIGByZW5kZXJgIG1ldGhvZCcpKTtcbiAgfVxufVxuXG5leHBvcnRzWydkZWZhdWx0J10gPSBfY29tbW9uLmNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIi8qIVxuICogXG4gKiAgUmVhY3QgU2ltcGxldGFicyAtIEp1c3QgYSBzaW1wbGUgdGFicyBjb21wb25lbnQgYnVpbHQgd2l0aCBSZWFjdFxuICogIEB2ZXJzaW9uIHYwLjcuMFxuICogIEBsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9wZWRyb25hdWNrL3JlYWN0LXNpbXBsZXRhYnNcbiAqICBAbGljZW5zZSBNSVRcbiAqICBAYXV0aG9yIFBlZHJvIE5hdWNrIChodHRwczovL2dpdGh1Yi5jb20vcGVkcm9uYXVjaylcbiAqIFxuICovXG4oZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydSZWFjdCddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnUmVhY3QnXSA6IG51bGwpKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtcInJlYWN0XCJdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIlJlYWN0U2ltcGxlVGFic1wiXSA9IGZhY3RvcnkoKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1JlYWN0J10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydSZWFjdCddIDogbnVsbCkpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIlJlYWN0U2ltcGxlVGFic1wiXSA9IGZhY3Rvcnkocm9vdFtcIlJlYWN0XCJdKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfMV9fKSB7XG5yZXR1cm4gLyoqKioqKi8gKGZ1bmN0aW9uKG1vZHVsZXMpIHsgLy8gd2VicGFja0Jvb3RzdHJhcFxuLyoqKioqKi8gXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4vKioqKioqLyBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuLyoqKioqKi8gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuLyoqKioqKi8gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuLyoqKioqKi8gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4vKioqKioqLyBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuLyoqKioqKi8gXHRcdFx0ZXhwb3J0czoge30sXG4vKioqKioqLyBcdFx0XHRpZDogbW9kdWxlSWQsXG4vKioqKioqLyBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4vKioqKioqLyBcdFx0fTtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4vKioqKioqLyBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbi8qKioqKiovIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbi8qKioqKiovIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4vKioqKioqLyBcdH1cbi8qKioqKiovXG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8qKioqKiovIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG4vKioqKioqLyB9KVxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKiovIChbXG4vKiAwICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQvKiogQGpzeCBSZWFjdC5ET00gKi8ndXNlIHN0cmljdCc7XG5cblx0dmFyIFJlYWN0ID0gX193ZWJwYWNrX3JlcXVpcmVfXygxKTtcblx0dmFyIGNsYXNzTmFtZXMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDIpO1xuXG5cdGlmICh0cnVlKSB7XG5cdCAgX193ZWJwYWNrX3JlcXVpcmVfXygzKTtcblx0fVxuXG5cdHZhciBUYWJzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHQgIGRpc3BsYXlOYW1lOiAnVGFicycsXG5cdCAgcHJvcFR5cGVzOiB7XG5cdCAgICBjbGFzc05hbWU6IFJlYWN0LlByb3BUeXBlcy5vbmVPZlR5cGUoW1xuXHQgICAgICBSZWFjdC5Qcm9wVHlwZXMuYXJyYXksXG5cdCAgICAgIFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdCAgICAgIFJlYWN0LlByb3BUeXBlcy5vYmplY3Rcblx0ICAgIF0pLFxuXHQgICAgdGFiQWN0aXZlOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuXHQgICAgb25Nb3VudDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG5cdCAgICBvbkJlZm9yZUNoYW5nZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG5cdCAgICBvbkFmdGVyQ2hhbmdlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcblx0ICAgIGNoaWxkcmVuOiBSZWFjdC5Qcm9wVHlwZXMub25lT2ZUeXBlKFtcblx0ICAgICAgUmVhY3QuUHJvcFR5cGVzLmFycmF5LFxuXHQgICAgICBSZWFjdC5Qcm9wVHlwZXMuZWxlbWVudFxuXHQgICAgXSkuaXNSZXF1aXJlZFxuXHQgIH0sXG5cdCAgZ2V0RGVmYXVsdFByb3BzOmZ1bmN0aW9uICgpIHtcblx0ICAgIHJldHVybiB7IHRhYkFjdGl2ZTogMSB9O1xuXHQgIH0sXG5cdCAgZ2V0SW5pdGlhbFN0YXRlOmZ1bmN0aW9uICgpIHtcblx0ICAgIHJldHVybiB7XG5cdCAgICAgIHRhYkFjdGl2ZTogdGhpcy5wcm9wcy50YWJBY3RpdmVcblx0ICAgIH07XG5cdCAgfSxcblx0ICBjb21wb25lbnREaWRNb3VudDpmdW5jdGlvbigpIHtcblx0ICAgIHZhciBpbmRleCA9IHRoaXMuc3RhdGUudGFiQWN0aXZlO1xuXHQgICAgdmFyICRzZWxlY3RlZFBhbmVsID0gdGhpcy5yZWZzWyd0YWItcGFuZWwnXTtcblx0ICAgIHZhciAkc2VsZWN0ZWRNZW51ID0gdGhpcy5yZWZzWyhcInRhYi1tZW51LVwiICsgaW5kZXgpXTtcblxuXHQgICAgaWYgKHRoaXMucHJvcHMub25Nb3VudCkge1xuXHQgICAgICB0aGlzLnByb3BzLm9uTW91bnQoaW5kZXgsICRzZWxlY3RlZFBhbmVsLCAkc2VsZWN0ZWRNZW51KTtcblx0ICAgIH1cblx0ICB9LFxuXHQgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHM6IGZ1bmN0aW9uKG5ld1Byb3BzKXtcblx0ICAgIGlmKG5ld1Byb3BzLnRhYkFjdGl2ZSAmJiBuZXdQcm9wcy50YWJBY3RpdmUgIT09IHRoaXMucHJvcHMudGFiQWN0aXZlKXtcblx0ICAgICAgdGhpcy5zZXRTdGF0ZSh7dGFiQWN0aXZlOiBuZXdQcm9wcy50YWJBY3RpdmV9KTtcblx0ICAgIH1cblx0ICB9LFxuXHQgIHJlbmRlcjpmdW5jdGlvbiAoKSB7XG5cdCAgICB2YXIgY2xhc3NOYW1lID0gY2xhc3NOYW1lcygndGFicycsIHRoaXMucHJvcHMuY2xhc3NOYW1lKTtcblx0ICAgIHJldHVybiAoXG5cdCAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogY2xhc3NOYW1lfSwgXG5cdCAgICAgICAgdGhpcy5fZ2V0TWVudUl0ZW1zKCksIFxuXHQgICAgICAgIHRoaXMuX2dldFNlbGVjdGVkUGFuZWwoKVxuXHQgICAgICApXG5cdCAgICApO1xuXHQgIH0sXG5cdCAgc2V0QWN0aXZlOmZ1bmN0aW9uKGluZGV4LCBlKSB7XG5cdCAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0ICAgIHZhciBvbkFmdGVyQ2hhbmdlID0gdGhpcy5wcm9wcy5vbkFmdGVyQ2hhbmdlO1xuXHQgICAgdmFyIG9uQmVmb3JlQ2hhbmdlID0gdGhpcy5wcm9wcy5vbkJlZm9yZUNoYW5nZTtcblx0ICAgIHZhciAkc2VsZWN0ZWRQYW5lbCA9IHRoaXMucmVmc1sndGFiLXBhbmVsJ107XG5cdCAgICB2YXIgJHNlbGVjdGVkVGFiTWVudSA9IHRoaXMucmVmc1soXCJ0YWItbWVudS1cIiArIGluZGV4KV07XG5cblx0ICAgIGlmIChvbkJlZm9yZUNoYW5nZSkge1xuXHQgICAgICB2YXIgY2FuY2VsID0gb25CZWZvcmVDaGFuZ2UoaW5kZXgsICRzZWxlY3RlZFBhbmVsLCAkc2VsZWN0ZWRUYWJNZW51KTtcblx0ICAgICAgaWYoY2FuY2VsID09PSBmYWxzZSl7IHJldHVybiB9XG5cdCAgICB9XG5cblx0ICAgIHRoaXMuc2V0U3RhdGUoeyB0YWJBY3RpdmU6IGluZGV4IH0sIGZ1bmN0aW9uKCkgIHtcblx0ICAgICAgaWYgKG9uQWZ0ZXJDaGFuZ2UpIHtcblx0ICAgICAgICBvbkFmdGVyQ2hhbmdlKGluZGV4LCAkc2VsZWN0ZWRQYW5lbCwgJHNlbGVjdGVkVGFiTWVudSk7XG5cdCAgICAgIH1cblx0ICAgIH0pO1xuXHQgIH0sXG5cdCAgX2dldE1lbnVJdGVtczpmdW5jdGlvbiAoKSB7XG5cdCAgICBpZiAoIXRoaXMucHJvcHMuY2hpbGRyZW4pIHtcblx0ICAgICAgdGhyb3cgbmV3IEVycm9yKCdUYWJzIG11c3QgY29udGFpbiBhdCBsZWFzdCBvbmUgVGFicy5QYW5lbCcpO1xuXHQgICAgfVxuXG5cdCAgICBpZiAoIUFycmF5LmlzQXJyYXkodGhpcy5wcm9wcy5jaGlsZHJlbikpIHtcblx0ICAgICAgdGhpcy5wcm9wcy5jaGlsZHJlbiA9IFt0aGlzLnByb3BzLmNoaWxkcmVuXTtcblx0ICAgIH1cblxuXHQgICAgdmFyICRtZW51SXRlbXMgPSB0aGlzLnByb3BzLmNoaWxkcmVuXG5cdCAgICAgIC5tYXAoZnVuY3Rpb24oJHBhbmVsKSAge3JldHVybiB0eXBlb2YgJHBhbmVsID09PSAnZnVuY3Rpb24nID8gJHBhbmVsKCkgOiAkcGFuZWw7fSlcblx0ICAgICAgLmZpbHRlcihmdW5jdGlvbigkcGFuZWwpICB7cmV0dXJuICRwYW5lbDt9KVxuXHQgICAgICAubWFwKGZ1bmN0aW9uKCRwYW5lbCwgaW5kZXgpICB7XG5cdCAgICAgICAgdmFyIHJlZiA9IChcInRhYi1tZW51LVwiICsgKGluZGV4ICsgMSkpO1xuXHQgICAgICAgIHZhciB0aXRsZSA9ICRwYW5lbC5wcm9wcy50aXRsZTtcblx0ICAgICAgICB2YXIgY2xhc3NlcyA9IGNsYXNzTmFtZXMoXG5cdCAgICAgICAgICAndGFicy1tZW51LWl0ZW0nLFxuXHQgICAgICAgICAgdGhpcy5zdGF0ZS50YWJBY3RpdmUgPT09IChpbmRleCArIDEpICYmICdpcy1hY3RpdmUnXG5cdCAgICAgICAgKTtcblxuXHQgICAgICAgIHJldHVybiAoXG5cdCAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGlcIiwge3JlZjogcmVmLCBrZXk6IGluZGV4LCBjbGFzc05hbWU6IGNsYXNzZXN9LCBcblx0ICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwge29uQ2xpY2s6IHRoaXMuc2V0QWN0aXZlLmJpbmQodGhpcywgaW5kZXggKyAxKX0sIFxuXHQgICAgICAgICAgICAgIHRpdGxlXG5cdCAgICAgICAgICAgIClcblx0ICAgICAgICAgIClcblx0ICAgICAgICApO1xuXHQgICAgICB9LmJpbmQodGhpcykpO1xuXG5cdCAgICByZXR1cm4gKFxuXHQgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibmF2XCIsIHtjbGFzc05hbWU6IFwidGFicy1uYXZpZ2F0aW9uXCJ9LCBcblx0ICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidWxcIiwge2NsYXNzTmFtZTogXCJ0YWJzLW1lbnVcIn0sICRtZW51SXRlbXMpXG5cdCAgICAgIClcblx0ICAgICk7XG5cdCAgfSxcblx0ICBfZ2V0U2VsZWN0ZWRQYW5lbDpmdW5jdGlvbiAoKSB7XG5cdCAgICB2YXIgaW5kZXggPSB0aGlzLnN0YXRlLnRhYkFjdGl2ZSAtIDE7XG5cdCAgICB2YXIgJHBhbmVsID0gdGhpcy5wcm9wcy5jaGlsZHJlbltpbmRleF07XG5cblx0ICAgIHJldHVybiAoXG5cdCAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhcnRpY2xlXCIsIHtyZWY6IFwidGFiLXBhbmVsXCIsIGNsYXNzTmFtZTogXCJ0YWItcGFuZWxcIn0sIFxuXHQgICAgICAgICRwYW5lbFxuXHQgICAgICApXG5cdCAgICApO1xuXHQgIH1cblx0fSk7XG5cblx0VGFicy5QYW5lbCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ICBkaXNwbGF5TmFtZTogJ1BhbmVsJyxcblx0ICBwcm9wVHlwZXM6IHtcblx0ICAgIHRpdGxlOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG5cdCAgICBjaGlsZHJlbjogUmVhY3QuUHJvcFR5cGVzLm9uZU9mVHlwZShbXG5cdCAgICAgIFJlYWN0LlByb3BUeXBlcy5hcnJheSxcblx0ICAgICAgUmVhY3QuUHJvcFR5cGVzLmVsZW1lbnRcblx0ICAgIF0pLmlzUmVxdWlyZWRcblx0ICB9LFxuXHQgIHJlbmRlcjpmdW5jdGlvbiAoKSB7XG5cdCAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCB0aGlzLnByb3BzLmNoaWxkcmVuKTtcblx0ICB9XG5cdH0pO1xuXG5cdG1vZHVsZS5leHBvcnRzID0gVGFicztcblxuXG4vKioqLyB9LFxuLyogMSAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzFfXztcblxuLyoqKi8gfSxcbi8qIDIgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdC8qKiBAanN4IFJlYWN0LkRPTSAqL2Z1bmN0aW9uIGNsYXNzTmFtZXMoKSB7XG5cdFx0dmFyIGNsYXNzZXMgPSAnJztcblx0XHR2YXIgYXJnO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGFyZyA9IGFyZ3VtZW50c1tpXTtcblx0XHRcdGlmICghYXJnKSB7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoJ3N0cmluZycgPT09IHR5cGVvZiBhcmcgfHwgJ251bWJlcicgPT09IHR5cGVvZiBhcmcpIHtcblx0XHRcdFx0Y2xhc3NlcyArPSAnICcgKyBhcmc7XG5cdFx0XHR9IGVsc2UgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhcmcpID09PSAnW29iamVjdCBBcnJheV0nKSB7XG5cdFx0XHRcdGNsYXNzZXMgKz0gJyAnICsgY2xhc3NOYW1lcy5hcHBseShudWxsLCBhcmcpO1xuXHRcdFx0fSBlbHNlIGlmICgnb2JqZWN0JyA9PT0gdHlwZW9mIGFyZykge1xuXHRcdFx0XHRmb3IgKHZhciBrZXkgaW4gYXJnKSB7XG5cdFx0XHRcdFx0aWYgKCFhcmcuaGFzT3duUHJvcGVydHkoa2V5KSB8fCAhYXJnW2tleV0pIHtcblx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjbGFzc2VzICs9ICcgJyArIGtleTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gY2xhc3Nlcy5zdWJzdHIoMSk7XG5cdH1cblxuXHQvLyBzYWZlbHkgZXhwb3J0IGNsYXNzTmFtZXMgaW4gY2FzZSB0aGUgc2NyaXB0IGlzIGluY2x1ZGVkIGRpcmVjdGx5IG9uIGEgcGFnZVxuXHRpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGNsYXNzTmFtZXM7XG5cdH1cblxuXG4vKioqLyB9LFxuLyogMyAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0Ly8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuLyoqKi8gfVxuLyoqKioqKi8gXSlcbn0pO1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxNC0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFNpbWlsYXIgdG8gaW52YXJpYW50IGJ1dCBvbmx5IGxvZ3MgYSB3YXJuaW5nIGlmIHRoZSBjb25kaXRpb24gaXMgbm90IG1ldC5cbiAqIFRoaXMgY2FuIGJlIHVzZWQgdG8gbG9nIGlzc3VlcyBpbiBkZXZlbG9wbWVudCBlbnZpcm9ubWVudHMgaW4gY3JpdGljYWxcbiAqIHBhdGhzLiBSZW1vdmluZyB0aGUgbG9nZ2luZyBjb2RlIGZvciBwcm9kdWN0aW9uIGVudmlyb25tZW50cyB3aWxsIGtlZXAgdGhlXG4gKiBzYW1lIGxvZ2ljIGFuZCBmb2xsb3cgdGhlIHNhbWUgY29kZSBwYXRocy5cbiAqL1xuXG52YXIgd2FybmluZyA9IGZ1bmN0aW9uKCkge307XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHdhcm5pbmcgPSBmdW5jdGlvbihjb25kaXRpb24sIGZvcm1hdCwgYXJncykge1xuICAgIHZhciBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIGFyZ3MgPSBuZXcgQXJyYXkobGVuID4gMiA/IGxlbiAtIDIgOiAwKTtcbiAgICBmb3IgKHZhciBrZXkgPSAyOyBrZXkgPCBsZW47IGtleSsrKSB7XG4gICAgICBhcmdzW2tleSAtIDJdID0gYXJndW1lbnRzW2tleV07XG4gICAgfVxuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnYHdhcm5pbmcoY29uZGl0aW9uLCBmb3JtYXQsIC4uLmFyZ3MpYCByZXF1aXJlcyBhIHdhcm5pbmcgJyArXG4gICAgICAgICdtZXNzYWdlIGFyZ3VtZW50J1xuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAoZm9ybWF0Lmxlbmd0aCA8IDEwIHx8ICgvXltzXFxXXSokLykudGVzdChmb3JtYXQpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdUaGUgd2FybmluZyBmb3JtYXQgc2hvdWxkIGJlIGFibGUgdG8gdW5pcXVlbHkgaWRlbnRpZnkgdGhpcyAnICtcbiAgICAgICAgJ3dhcm5pbmcuIFBsZWFzZSwgdXNlIGEgbW9yZSBkZXNjcmlwdGl2ZSBmb3JtYXQgdGhhbjogJyArIGZvcm1hdFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAoIWNvbmRpdGlvbikge1xuICAgICAgdmFyIGFyZ0luZGV4ID0gMDtcbiAgICAgIHZhciBtZXNzYWdlID0gJ1dhcm5pbmc6ICcgK1xuICAgICAgICBmb3JtYXQucmVwbGFjZSgvJXMvZywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIGFyZ3NbYXJnSW5kZXgrK107XG4gICAgICAgIH0pO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBjb25zb2xlLmVycm9yKG1lc3NhZ2UpO1xuICAgICAgfVxuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gVGhpcyBlcnJvciB3YXMgdGhyb3duIGFzIGEgY29udmVuaWVuY2Ugc28gdGhhdCB5b3UgY2FuIHVzZSB0aGlzIHN0YWNrXG4gICAgICAgIC8vIHRvIGZpbmQgdGhlIGNhbGxzaXRlIHRoYXQgY2F1c2VkIHRoaXMgd2FybmluZyB0byBmaXJlLlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgICB9IGNhdGNoKHgpIHt9XG4gICAgfVxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHdhcm5pbmc7XG4iLCJpbXBvcnQge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuXG5jb25zdCBBbGxlbGVGaWx0ZXJzVmlldyA9ICh7c3BlY2llcywgaGlkZGVuQWxsZWxlcz1bXSwgZGlzYWJsZWRBbGxlbGVzID0gW10sIG9uRmlsdGVyQ2hhbmdlfSkgPT4ge1xuICBsZXQgaGlkZGVuR2VuZXMgPSBuZXcgU2V0LFxuICAgICAgZ2VuZUlucHV0cyA9IFtdO1xuXG4gIGZvciAoY29uc3QgYWxsZWxlIG9mIGhpZGRlbkFsbGVsZXMpIHtcbiAgICBjb25zdCBnZW5lID0gQmlvTG9naWNhLkdlbmV0aWNzLmdldEdlbmVPZkFsbGVsZShzcGVjaWVzLCBhbGxlbGUpO1xuICAgIGlmIChnZW5lKVxuICAgICAgaGlkZGVuR2VuZXMuYWRkKGdlbmUubmFtZSk7XG4gIH1cblxuICBmb3IgKGNvbnN0IGdlbmUgaW4gc3BlY2llcy5nZW5lTGlzdCkge1xuICAgIGlmICghaGlkZGVuR2VuZXMuaGFzKGdlbmUpKSB7XG4gICAgICBjb25zdCBhbGxlbGVzID0gc3BlY2llcy5nZW5lTGlzdFtnZW5lXS5hbGxlbGVzLFxuICAgICAgICAgICAgYWxsZWxlSXRlbXMgPSBhbGxlbGVzLm1hcChhbGxlbGUgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBuYW1lID0gc3BlY2llcy5hbGxlbGVMYWJlbE1hcFthbGxlbGVdLFxuICAgICAgICAgICAgICAgICAgICBjaGVja2VkID0gIShkaXNhYmxlZEFsbGVsZXMuaW5kZXhPZihhbGxlbGUpID49IDApO1xuICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxsYWJlbCBrZXk9e25hbWV9PlxuICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGtleT17bmFtZX0gdmFsdWU9e2FsbGVsZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgXCJtYXJnaW5MZWZ0XCI6IFwiOHB4XCIgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdENoZWNrZWQ9e2NoZWNrZWR9IG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9Lz5cbiAgICAgICAgICAgICAgICAgIHtuYW1lfVxuICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9KTtcbiAgICAgIGdlbmVJbnB1dHMucHVzaChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnZW5lLWFsbGVsZS1saXN0XCIga2V5PXtnZW5lfT57YWxsZWxlSXRlbXN9PC9kaXY+XG4gICAgICApO1xuICAgIH1cbiAgfVxuIFxuICBmdW5jdGlvbiBoYW5kbGVDaGFuZ2UoZXZ0KSB7XG4gICAgY29uc3QgZWx0ID0gZXZ0LnRhcmdldCxcbiAgICAgICAgICBhbGxlbGUgPSBlbHQgJiYgZWx0LnZhbHVlLFxuICAgICAgICAgIGlzQ2hlY2tlZCA9IGVsdCAmJiBlbHQuY2hlY2tlZDtcbiAgICBpZiAob25GaWx0ZXJDaGFuZ2UgJiYgYWxsZWxlKVxuICAgICAgb25GaWx0ZXJDaGFuZ2UoZXZ0LCBhbGxlbGUsIGlzQ2hlY2tlZCk7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBhbGxlbGUtZmlsdGVyc1wiXG4gICAgICAgICAgc3R5bGU9e3sgXCJtYXJnaW5Ub3BcIjogXCI1cHhcIiwgXCJtYXJnaW5Cb3R0b21cIjogXCI1cHhcIiB9fT5cbiAgICAgIHsgZ2VuZUlucHV0cyB9XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5BbGxlbGVGaWx0ZXJzVmlldy5wcm9wVHlwZXMgPSB7XG4gIHNwZWNpZXM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgaGlkZGVuQWxsZWxlczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnN0cmluZyksXG4gIGRpc2FibGVkQWxsZWxlczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnN0cmluZyksXG4gIG9uRmlsdGVyQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG59O1xuXG5leHBvcnQgZGVmYXVsdCBBbGxlbGVGaWx0ZXJzVmlldztcbiIsImltcG9ydCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5cbmNvbnN0IEFsbGVsZVZpZXcgPSAoe2FsbGVsZSwgd2lkdGg9MjEsIHRhcmdldCwgY29sb3IsIHNoYXBlLCBob3ZlcmluZ30pID0+IHtcbiAgbGV0IHJhZGl1cyA9IHdpZHRoLzIsXG4gICAgICBzdHJva2UgPSB0YXJnZXQgPyBcIiMwMDAwMDBcIiA6IFwibm9uZVwiLFxuICAgICAgZmlsbCA9IGFsbGVsZSA/IGNvbG9yIDogXCJ3aGl0ZVwiLFxuICAgICAgc3Ryb2tlV2lkdGggPSBob3ZlcmluZyA/IDMgOiAxLFxuICAgICAgc3Ryb2tlRGFzaGFycmF5PSBhbGxlbGUgPyBcIjBcIiA6IFwiMVwiLFxuICAgICAgc3ZnU2hhcGUgPSBudWxsO1xuXG4gIGlmIChzaGFwZSA9PT0gXCJjaXJjbGVcIikge1xuICAgIHN2Z1NoYXBlID0gPGNpcmNsZSByPXtyYWRpdXN9IGN5PXtyYWRpdXMrMX0gY3g9e3JhZGl1cysxfSBzdHJva2VXaWR0aD17c3Ryb2tlV2lkdGh9IHN0cm9rZT17c3Ryb2tlfSBzdHJva2VEYXNoYXJyYXk9e3N0cm9rZURhc2hhcnJheX0gZmlsbD17ZmlsbH0vPjtcbiAgfSBlbHNlIHtcbiAgICBzdmdTaGFwZSA9IDxyZWN0IHdpZHRoPXsocmFkaXVzKjIpfSBoZWlnaHQ9eyhyYWRpdXMqMil9IHg9XCIxXCIgeT1cIjFcIiBzdHJva2VXaWR0aD17c3Ryb2tlV2lkdGh9IHN0cm9rZT17c3Ryb2tlfSBzdHJva2VEYXNoYXJyYXk9e3N0cm9rZURhc2hhcnJheX0gZmlsbD17ZmlsbH0vPjtcbiAgfVxuXG5cbiAgcmV0dXJuIChcbiAgICA8c3ZnIHdpZHRoPXt3aWR0aCsyfSBoZWlnaHQ9e3dpZHRoKzJ9IHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cbiAgICAgIDxnPlxuICAgICAgICB7IHN2Z1NoYXBlIH1cbiAgICAgICAgPHRleHQgeD17cmFkaXVzKzF9IHk9e3JhZGl1cys3fSB0ZXh0QW5jaG9yPVwibWlkZGxlXCIgZmlsbD1cIndoaXRlXCI+e2FsbGVsZX08L3RleHQ+XG4gICAgICA8L2c+XG4gICAgPC9zdmc+XG4gICk7XG59O1xuXG5BbGxlbGVWaWV3LnByb3BUeXBlcyA9IHtcbiAgYWxsZWxlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICB3aWR0aDogUHJvcFR5cGVzLm51bWJlcixcbiAgdGFyZ2V0OiBQcm9wVHlwZXMuYm9vbCxcbiAgY29sb3I6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHNoYXBlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBob3ZlcmluZzogUHJvcFR5cGVzLmJvb2xcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEFsbGVsZVZpZXc7XG4iLCJpbXBvcnQge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtNb3Rpb24sIHNwcmluZ30gZnJvbSAncmVhY3QtbW90aW9uJztcbmltcG9ydCBHYW1ldGVWaWV3IGZyb20gJy4vZ2FtZXRlJztcblxuLyoqXG4gKiBTdGF0ZWxlc3MgZnVuY3Rpb25hbCBSZWFjdCBjb21wb25lbnQgZm9yIGRpc3BsYXlpbmcgYSBCaW9sb2dpY2EgZ2FtZXRlIHRoYXQgYW5pbWF0ZXNcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZ2FtZXRlIC0gQmlvbG9naWNhIGdhbWV0ZSAobWFwIG9mIGNocm9tb3NvbWUgbmFtZXMgdG8gY2hyb21vc29tZXMpXG4gKiBAcGFyYW0ge251bWJlcn0gaWQgLSB0aGUgdW5pcXVlIGlkIG9mIHRoaXMgZ2FtZXRlXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBoaWRkZW5BbGxlbGVzIC0gaW5kaXZpZHVhbCBhbGxlbGVzIG9mIGdlbmVzIGZvciB3aGljaCBhbGwgYWxsZWxlcyBzaG91bGQgYmUgaGlkZGVuXG4gKiBAcGFyYW0ge09iamVjdH0gW2luaXRpYWxEaXNwbGF5XSAtIGluaXRpYWwgZGlzcGxheSBwYXJhbWV0ZXJzIHVzZWQgdG8gcmVwcmVzZW50IHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBbaW5pdGlhbERpc3BsYXkueF0gLSBpbml0aWFsIGxvY2F0aW9uIChsZWZ0KSBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gW2luaXRpYWxEaXNwbGF5LnldIC0gaW5pdGlhbCBsb2NhdGlvbiAodG9wKSBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gW2luaXRpYWxEaXNwbGF5LnNpemU9MzBdIC0gaW5pdGlhbCBzaXplICh3aWR0aCAmIGhlaWdodCkgb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IFtpbml0aWFsRGlzcGxheS5yb3RhdGlvbj0wXSAtIGluaXRpYWwgcm90YXRpb24gb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IFtpbml0aWFsRGlzcGxheS5vcGFjaXR5PTFdIC0gaW5pdGlhbCBvcGFjaXR5IG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBkaXNwbGF5IC0gZmluYWwgZGlzcGxheSBwYXJhbWV0ZXJzIHVzZWQgdG8gcmVwcmVzZW50IHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBkaXNwbGF5LnggLSBmaW5hbCBsb2NhdGlvbiAobGVmdCkgb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IGRpc3BsYXkueSAtIGZpbmFsIGxvY2F0aW9uICh0b3ApIG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBbZGlzcGxheS5zaXplPTMwXSAtIGZpbmFsIHNpemUgKHdpZHRoICYgaGVpZ2h0KSBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gW2Rpc3BsYXkucm90YXRpb249MF0gLSBmaW5hbCByb3RhdGlvbiBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gW2Rpc3BsYXkub3BhY2l0eT0xXSAtIGZpbmFsIG9wYWNpdHkgb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IFthbmltU3RpZmZuZXNzPTEwMF0gLSBzcHJpbmcgc3RpZmZuZXNzIHVzZWQgdG8gY29udHJvbCBhbmltYXRpb24gc3BlZWRcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzU2VsZWN0ZWQ9ZmFsc2VdIC0gd2hldGhlciB0aGUgZ2FtZXRlIHNob3VsZCBoYXZlIHRoZSAnc2VsZWN0ZWQnIGNsYXNzIGFwcGxpZWRcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzRGlzYWJsZWQ9ZmFsc2VdIC0gd2hldGhlciB0aGUgZ2FtZXRlIHNob3VsZCBoYXZlIHRoZSAnZGlzYWJsZWQnIGNsYXNzIGFwcGxpZWRcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IFtvbkNsaWNrKGV2dCwgaWQsIHJlY3QpXSAtIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBnYW1ldGUgaXMgY2xpY2tlZFxuICogQHBhcmFtIHtmdW5jdGlvbn0gW29uUmVjdCgpXSAtIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBhbmltYXRpb24gaXMgYXQgcmVzdFxuICpcbiAqIE5vdGU6IEFzIHRoaW5ncyBzdGFuZCBjdXJyZW50bHksIHRoZXJlIGlzIF9ub18gcGFydGljdWxhciByZXByZXNlbnRhdGlvbiBvZiB0aGUgZ2FtZXRlIGRlZmluZWRcbiAqIGJ5IHRoaXMgdmlldy4gVGhlIGNsaWVudCBjYW4gc3R5bGUgdGhlIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBnYW1ldGUgYnkgc3R5bGluZyB0aGVcbiAqICcuZ2VuaWJsb2Nrcy5nYW1ldGUnIGNsYXNzIGluIENTUywgZS5nLiBieSBhc3NpZ25pbmcgYSBiYWNrZ3JvdW5kLWltYWdlLlxuICovXG5jb25zdCBBbmltYXRlZEdhbWV0ZVZpZXcgPSAoe2lkLCBpbml0aWFsRGlzcGxheSwgZGlzcGxheSwgYW5pbVN0aWZmbmVzcz0xMDAsIG9uUmVzdCwgLi4ub3RoZXJzfSkgPT4ge1xuXG4gIGNvbnN0IGdyb3VwID0gaWQgJSA0LFxuICAgICAgICByb3RhdGlvbkZvckdyb3VwID0gZ3JvdXAgKiA5MCxcbiAgICAgICAgaW5pdGlhbCA9IGluaXRpYWxEaXNwbGF5IHx8IGRpc3BsYXksXG4gICAgICAgIGluaXRpYWxTaXplID0gaW5pdGlhbC5zaXplIHx8IDMwLFxuICAgICAgICBpbml0aWFsUm90YXRpb24gPSBpbml0aWFsLnJvdGF0aW9uICE9IG51bGwgPyBpbml0aWFsLnJvdGF0aW9uIDogcm90YXRpb25Gb3JHcm91cCxcbiAgICAgICAgaW5pdGlhbE9wYWNpdHkgPSBpbml0aWFsLm9wYWNpdHkgIT0gbnVsbCA/IGluaXRpYWwub3BhY2l0eSA6IDEuMCxcbiAgICAgICAgZmluYWxTaXplID0gZGlzcGxheS5zaXplIHx8IDMwLFxuICAgICAgICBmaW5hbFJvdGF0aW9uID0gZGlzcGxheS5yb3RhdGlvbiAhPSBudWxsID8gZGlzcGxheS5yb3RhdGlvbiA6IHJvdGF0aW9uRm9yR3JvdXAsXG4gICAgICAgIGZpbmFsT3BhY2l0eSA9IGRpc3BsYXkub3BhY2l0eSAhPSBudWxsID8gZGlzcGxheS5vcGFjaXR5IDogMS4wLFxuICAgICAgICBzcHJpbmdDb25maWcgPSB7IHN0aWZmbmVzczogYW5pbVN0aWZmbmVzcyB9O1xuICByZXR1cm4gKFxuICAgIDxNb3Rpb24gY2xhc3NOYW1lPSdnZW5pYmxvY2tzIGFuaW1hdGVkLWdhbWV0ZSdcbiAgICAgICAgICBkZWZhdWx0U3R5bGU9e3tcbiAgICAgICAgICAgIHg6IGluaXRpYWwueCwgeTogaW5pdGlhbC55LCBzaXplOiBpbml0aWFsU2l6ZSxcbiAgICAgICAgICAgIHJvdGF0aW9uOiBpbml0aWFsUm90YXRpb24sIG9wYWNpdHk6IGluaXRpYWxPcGFjaXR5XG4gICAgICAgICAgfX1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgeDogc3ByaW5nKGRpc3BsYXkueCwgc3ByaW5nQ29uZmlnKSxcbiAgICAgICAgICAgIHk6IHNwcmluZyhkaXNwbGF5LnksIHNwcmluZ0NvbmZpZyksXG4gICAgICAgICAgICBzaXplOiBzcHJpbmcoZmluYWxTaXplLCBzcHJpbmdDb25maWcpLFxuICAgICAgICAgICAgcm90YXRpb246IHNwcmluZyhmaW5hbFJvdGF0aW9uLCBzcHJpbmdDb25maWcpLFxuICAgICAgICAgICAgb3BhY2l0eTogc3ByaW5nKGZpbmFsT3BhY2l0eSwgc3ByaW5nQ29uZmlnKVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25SZXN0PXtvblJlc3R9ID5cbiAgICAgIHtcbiAgICAgICAgaW50ZXJwb2xhdGVkU3R5bGUgPT5cbiAgICAgICAgICA8R2FtZXRlVmlldyBpZD17aWR9IGRpc3BsYXk9e2ludGVycG9sYXRlZFN0eWxlfSB7Li4ub3RoZXJzfSAvPlxuICAgICAgfVxuICAgIDwvTW90aW9uPlxuICApO1xufTtcblxuQW5pbWF0ZWRHYW1ldGVWaWV3LnByb3BUeXBlcyA9IHtcbiAgZ2FtZXRlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGlkOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIGhpZGRlbkFsbGVsZXM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zdHJpbmcpLFxuICBpbml0aWFsRGlzcGxheTogUHJvcFR5cGVzLnNoYXBlKHsgLy8gaW5pdGlhbCBkaXNwbGF5IHByb3BlcnRpZXNcbiAgICB4OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsIC8vIGxvY2F0aW9uIChsZWZ0KSBvZiBnYW1ldGUgaW1hZ2VcbiAgICB5OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsIC8vIGxvY2F0aW9uICh0b3ApIG9mIGdhbWV0ZSBpbWFnZVxuICAgIHNpemU6IFByb3BUeXBlcy5udW1iZXIsICAgICAgICAgLy8gc2l6ZSBvZiBnYW1ldGUgaW1hZ2UgKGRlZmF1bHQ6IDMwKVxuICAgIHJvdGF0aW9uOiBQcm9wVHlwZXMubnVtYmVyLCAgICAgLy8gcm90YXRpb24gKGRlZykgb2YgZ2FtZXRlIGltYWdlIChkZWZhdWx0OiAwfDkwfDE4MHwyNzApXG4gICAgb3BhY2l0eTogUHJvcFR5cGVzLm51bWJlciAgICAgICAvLyBvcGFjaXR5IG9mIGdhbWV0ZSBpbWFnZSAoZGVmYXVsdDogMS4wKVxuICB9KSxcbiAgZGlzcGxheTogUHJvcFR5cGVzLnNoYXBlKHsgICAgICAgIC8vIGZpbmFsIGRpc3BsYXkgcHJvcGVydGllc1xuICAgIHg6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCwgLy8gbG9jYXRpb24gKGxlZnQpIG9mIGdhbWV0ZSBpbWFnZVxuICAgIHk6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCwgLy8gbG9jYXRpb24gKHRvcCkgb2YgZ2FtZXRlIGltYWdlXG4gICAgc2l6ZTogUHJvcFR5cGVzLm51bWJlciwgICAgICAgICAvLyBzaXplIG9mIGdhbWV0ZSBpbWFnZSAoZGVmYXVsdDogMzApXG4gICAgcm90YXRpb246IFByb3BUeXBlcy5udW1iZXIsICAgICAvLyByb3RhdGlvbiAoZGVnKSBvZiBnYW1ldGUgaW1hZ2UgKGRlZmF1bHQ6IDB8OTB8MTgwfDI3MClcbiAgICBvcGFjaXR5OiBQcm9wVHlwZXMubnVtYmVyICAgICAgIC8vIG9wYWNpdHkgb2YgZ2FtZXRlIGltYWdlIChkZWZhdWx0OiAxLjApXG4gIH0pLmlzUmVxdWlyZWQsXG4gIGFuaW1TdGlmZm5lc3M6IFByb3BUeXBlcy5udW1iZXIsICAvLyBzdGlmZm5lc3Mgb2Ygc3ByaW5nIGZvciBhbmltYXRpb24gKGRlZmF1bHQ6IDEwMClcbiAgaXNTZWxlY3RlZDogUHJvcFR5cGVzLmJvb2wsXG4gIGlzRGlzYWJsZWQ6IFByb3BUeXBlcy5ib29sLFxuICBvbkNsaWNrOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25SZXN0OiBQcm9wVHlwZXMuZnVuY1xufTtcblxuZXhwb3J0IGRlZmF1bHQgQW5pbWF0ZWRHYW1ldGVWaWV3O1xuIiwiaW1wb3J0IHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7TW90aW9uLCBzcHJpbmd9IGZyb20gJ3JlYWN0LW1vdGlvbic7XG5pbXBvcnQgT3JnYW5pc21WaWV3IGZyb20gJy4vb3JnYW5pc20nO1xuXG5jb25zdCBBbmltYXRlZE9yZ2FuaXNtVmlldyA9ICh7b3JnLCBpZCwgd2lkdGg9MjAwLCBzdHlsZT17fSwgaW5pdGlhbE9wYWNpdHk9MS4wLCBvcGFjaXR5PTEuMCwgc3RpZmZuZXNzPTYwLCBvblJlc3QsIG9uQ2xpY2sgfSkgPT4ge1xuICBjb25zdCBvcGFjaXR5U3RhcnQgPSBpbml0aWFsT3BhY2l0eSAhPT0gdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgICAgICA/IGluaXRpYWxPcGFjaXR5XG4gICAgICAgICAgICAgICAgICAgICAgICA6IChvcGFjaXR5ICE9PSB1bmRlZmluZWQgPyBvcGFjaXR5IDogMS4wKTtcbiAgbGV0ICAgb3BhY2l0eUVuZCA9IG9wYWNpdHkgIT09IHVuZGVmaW5lZCA/IG9wYWNpdHkgOiBvcGFjaXR5U3RhcnQ7XG5cbiAgaWYgKG9wYWNpdHlFbmQgIT09IG9wYWNpdHlTdGFydClcbiAgICBvcGFjaXR5RW5kID0gc3ByaW5nKG9wYWNpdHlFbmQsIHsgc3RpZmZuZXNzOiBzdGlmZm5lc3MgfSk7XG5cbiAgcmV0dXJuIChcbiAgICA8TW90aW9uIGNsYXNzTmFtZT0nZ2VuaWJsb2NrcyBhbmltYXRlZC1vcmdhbmlzbS12aWV3JyBcbiAgICAgICAgICAgIGRlZmF1bHRTdHlsZT17e29wYWNpdHk6IG9wYWNpdHlTdGFydH19IHN0eWxlPXt7b3BhY2l0eTogb3BhY2l0eUVuZH19IG9uUmVzdD17b25SZXN0fSA+XG4gICAgICB7XG4gICAgICAgIGludGVycG9sYXRlZFN0eWxlID0+IHtcbiAgICAgICAgICBjb25zdCB0U3R5bGUgPSB7IC4uLnN0eWxlLCAuLi5pbnRlcnBvbGF0ZWRTdHlsZSB9O1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8T3JnYW5pc21WaWV3IG9yZz17b3JnfSBpZD17aWR9IHdpZHRoPXt3aWR0aH0gc3R5bGU9e3RTdHlsZX0gb25DbGljaz17b25DbGlja30gLz5cbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgPC9Nb3Rpb24+XG4gICk7XG59O1xuXG5BbmltYXRlZE9yZ2FuaXNtVmlldy5wcm9wVHlwZXMgPSB7XG4gIG9yZzogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIsXG4gIHN0eWxlOiBQcm9wVHlwZXMub2JqZWN0LFxuICBpbml0aWFsT3BhY2l0eTogUHJvcFR5cGVzLm51bWJlcixcbiAgb3BhY2l0eTogUHJvcFR5cGVzLm51bWJlcixcbiAgc3RpZmZuZXNzOiBQcm9wVHlwZXMubnVtYmVyLFxuICBvblJlc3Q6IFByb3BUeXBlcy5mdW5jLFxuICBvbkNsaWNrOiBQcm9wVHlwZXMuZnVuY1xufTtcblxuZXhwb3J0IGRlZmF1bHQgQW5pbWF0ZWRPcmdhbmlzbVZpZXc7XG4iLCIvKlxuICogVGhpcyBjb21wb25lbnQgaXMgYSB2ZXJ5IHRoaW4gd3JhcHBlciBhcm91bmQgYSBzdGFuZGFyZCBidXR0b24gZGVzaWduZWQgdG8gcHJldmVudFxuICogZXh0cmFuZW91cyBmb2N1cyBoaWdobGlnaHRpbmcgYWRkZWQgYnkgYnJvd3NlcnMgd2hlbiBjbGlja2luZyBvbiBhIGJ1dHRvbiB3aGlsZVxuICogbWFpbnRhaW5pbmcga2V5Ym9hcmQgYWNjZXNzaWJpbGl0eS4gU2VlIFxuICogaHR0cHM6Ly93d3cucGFjaWVsbG9ncm91cC5jb20vYmxvZy8yMDEyLzA0L2hvdy10by1yZW1vdmUtY3NzLW91dGxpbmVzLWluLWFuLWFjY2Vzc2libGUtbWFubmVyL1xuICogZm9yIGRldGFpbHMuIFRoZSB1cHNob3QgaXMgdGhhdCB3ZSB1c2UgbW91c2UgZXZlbnRzIG9uIHRoZSBidXR0b24gdG8gZGlzYWJsZSB0aGVcbiAqIGZvY3VzIGhpZ2hsaWdodCAtLSBtb3VzaW5nL2NsaWNraW5nIG9uIGEgcHVzaCBidXR0b24gc2hvdWxkIG5vdCBiZSB1c2VkIGFzIGFuXG4gKiBpbmNpZGF0b3IgdGhhdCB0aGUgdXNlciB3b3VsZCBsaWtlIHRvIGtleWJvYXJkLWludGVyYWN0IHdpdGggdGhhdCBidXR0b24sIHdoaWNoXG4gKiBpcyB3aGF0IGZvY3VzaW5nIGEgY2xpY2tlZCBidXR0b24gaW1wbGllcy5cbiAqIElNUE9SVEFOVDogVG8gbWFpbnRhaW4gYWNjZXNzaWJpbGl0eSwgdGhlcmUgbXVzdCBiZSBjb2RlIHNvbWV3aGVyZSB0byByZWVuYWJsZVxuICogdGhlIGZvY3VzIGhpZ2hsaWdodCB3aGVuIGFwcHJvcHJpYXRlLiBUaGlzIGNhbiBiZSBkb25lIGZvciAna2V5ZG93bicgYnkgY2FsbGluZ1xuICogQnV0dG9uLmVuYWJsZUJ1dHRvbkZvY3VzSGlnaGxpZ2h0T25LZXlEb3duKCkgZHVyaW5nIGFwcGxpY2F0aW9uL3BhZ2UgaW5pdGlhbGl6YXRpb24sXG4gKiBvciBieSBhZGRpbmcgeW91ciBvd24gZXZlbnQgaGFuZGxlciB0aGF0IGNhbGxzIEJ1dHRvbi5lbmFibGVCdXR0b25Gb2N1c0hpZ2hsaWdodCgpLlxuICovXG5pbXBvcnQge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuXG5jbGFzcyBCdXR0b24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgY2xhc3NOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIGxhYmVsOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWRcbiAgfVxuXG4gIC8vIEluc3RhbGxzIGEga2V5ZG93biBoYW5kbGVyIG9uIHRoZSBkb2N1bWVudCB3aGljaCB3aWxsIGVuYWJsZSBidXR0b24gZm9jdXMgaGlnaGxpZ2h0aW5nLlxuICAvLyBTaG91bGQgYmUgY2FsbGVkIG9uY2UgZHVyaW5nIGFwcGxpY2F0aW9uIGluaXRpYWxpemF0aW9uLlxuICBzdGF0aWMgZW5hYmxlQnV0dG9uRm9jdXNIaWdobGlnaHRPbktleURvd24oKSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsICgpID0+IEJ1dHRvbi5lbmFibGVCdXR0b25Gb2N1c0hpZ2hsaWdodCgpKTtcbiAgfVxuXG4gIC8vIEVuYWJsZXMgYnV0dG9uIGZvY3VzIGhpZ2hsaWdodGluZzsgZGVzaWduZWQgdG8gYmUgY2FsbGVkIGZyb20gdGhlIGtleWRvd24gaGFuZGxlciBhYm92ZVxuICAvLyBidXQgYXZhaWxhYmxlIHNlcGFyYXRlbHkgZm9yIGltcGxlbWVudGF0aW9ucyB0aGF0IHJlcXVpcmUgaXQuXG4gIHN0YXRpYyBlbmFibGVCdXR0b25Gb2N1c0hpZ2hsaWdodCgpIHtcbiAgICBjb25zdCBidXR0b25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmdiLWJ1dHRvbicpLFxuICAgICAgICAgIGNvdW50ID0gYnV0dG9ucy5sZW5ndGg7XG4gICAgLy8gY2YuIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9Ob2RlTGlzdCNFeGFtcGxlXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgKytpKSB7XG4gICAgICBjb25zdCBidXR0b24gPSBidXR0b25zW2ldO1xuICAgICAgaWYgKGJ1dHRvbiAmJiBidXR0b24uY2xhc3NOYW1lKSB7XG4gICAgICAgIC8vIGNmLiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE5NTk1MS9jaGFuZ2UtYW4tZWxlbWVudHMtY2xhc3Mtd2l0aC1qYXZhc2NyaXB0XG4gICAgICAgIGJ1dHRvbi5jbGFzc05hbWUgPSBidXR0b24uY2xhc3NOYW1lLnJlcGxhY2UoLyg/Ol58XFxzKW5vLWZvY3VzLWhpZ2hsaWdodCg/IVxcUykvZyAsICcnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBwcmV2ZW50IGV4dHJhbmVvdXMgZm9jdXMgaGlnaGxpZ2h0IG9uIGNsaWNrIHdoaWxlIG1haW50YWluaW5nIGtleWJvYXJkIGFjY2Vzc2liaWxpdHlcbiAgLy8gc2VlIGh0dHBzOi8vd3d3LnBhY2llbGxvZ3JvdXAuY29tL2Jsb2cvMjAxMi8wNC9ob3ctdG8tcmVtb3ZlLWNzcy1vdXRsaW5lcy1pbi1hbi1hY2Nlc3NpYmxlLW1hbm5lci9cbiAgc3VwcHJlc3NCdXR0b25Gb2N1c0hpZ2hsaWdodCA9ICgpID0+IHtcbiAgICBjb25zdCBub0ZvY3VzSGlnaGxpZ2h0ID0gJ25vLWZvY3VzLWhpZ2hsaWdodCcsXG4gICAgICAgICAgYnV0dG9uID0gdGhpcy5yZWZzLmJ1dHRvbjtcbiAgICBpZiAoYnV0dG9uICYmIGJ1dHRvbi5jbGFzc05hbWUuaW5kZXhPZihub0ZvY3VzSGlnaGxpZ2h0KSA8IDApXG4gICAgICBidXR0b24uY2xhc3NOYW1lICs9ICcgJyArIG5vRm9jdXNIaWdobGlnaHQ7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBjbGFzc05hbWUsIGxhYmVsLCAuLi5vdGhlcnMgfSA9IHRoaXMucHJvcHMsXG4gICAgICAgICAgY2xhc3NlcyA9IChjbGFzc05hbWUgPyBjbGFzc05hbWUgKyAnICcgOiAnJykgKyAnZ2ItYnV0dG9uJztcblxuICAgIGNvbnN0IGhhbmRsZU1vdXNlRXZlbnQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuc3VwcHJlc3NCdXR0b25Gb2N1c0hpZ2hsaWdodCgpO1xuICAgIH0uYmluZCh0aGlzKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8YnV0dG9uIGNsYXNzTmFtZT17Y2xhc3Nlc30gcmVmPSdidXR0b24nIHsuLi5vdGhlcnN9XG4gICAgICAgICAgICAgIG9uTW91c2VFbnRlcj17aGFuZGxlTW91c2VFdmVudH1cbiAgICAgICAgICAgICAgb25Nb3VzZURvd249e2hhbmRsZU1vdXNlRXZlbnR9PlxuICAgICAgICB7bGFiZWx9XG4gICAgICA8L2J1dHRvbj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJ1dHRvbjtcbiIsImltcG9ydCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5cbi8qKlxuICogU3RhdGVsZXNzIGZ1bmN0aW9uYWwgUmVhY3QgY29tcG9uZW50IGZvciBkaXNwbGF5aW5nIG1hbGUvZmVtYWxlIGNoYW5nZSBidXR0b25zXG4gKiBUaGUgYXBwZWFyYW5jZSBvZiB0aGUgYnV0dG9ucyBpcyBjdXJyZW50bHkgZW50aXJlbHkgY29udHJvbGxlZCB2aWEgZXh0ZXJuYWwgQ1NTLlxuICogQHBhcmFtIHtzdHJpbmd9IHNleCAtIFsnbWFsZScgfCAnZmVtYWxlJ10gY3VycmVudGx5IHNlbGVjdGVkIGJ1dHRvblxuICogQHBhcmFtIHtmdW5jdGlvbn0gb25DaGFuZ2UoZXZ0LCBzZXgpIC0gY2FsbGJhY2sgdG8gYmUgY2FsbGVkIHdoZW4gdXNlIGNsaWNrcyB0byBjaGFuZ2Ugc2V4XG4gKi9cbmNvbnN0IENoYW5nZVNleEJ1dHRvbnMgPSAoe2lkLCBzZXgsIHNwZWNpZXMsIHNob3dMYWJlbCwgc3R5bGU9e30sIG9uQ2hhbmdlfSkgPT4ge1xuICBjb25zdCBjYXBTZXggPSBzZXguc3Vic3RyKDAsIDEpLnRvVXBwZXJDYXNlKCkgKyBzZXguc3Vic3RyKDEpLFxuICAgICAgICBzZWxlY3RlZFNleENsYXNzID0gc2V4ID09PSAnbWFsZScgPyAnbWFsZS1zZWxlY3RlZCcgOiAnZmVtYWxlLXNlbGVjdGVkJyxcbiAgICAgICAgQlVUVE9OX0lNQUdFX1dJRFRIID0gMTAwLFxuICAgICAgICBCVVRUT05fSU1BR0VfTUlEUE9JTlRfWCA9IEJVVFRPTl9JTUFHRV9XSURUSCAvIDIsXG4gICAgICAgIGltYWdlU3R5bGUgPSB7IHBvc2l0aW9uOiAnYWJzb2x1dGUnLCAuLi5zdHlsZSB9LFxuICAgICAgICBsYWJlbCA9IHNob3dMYWJlbCA/IGAke2NhcFNleH0gJHtzcGVjaWVzfWAgOiAnJyxcbiAgICAgICAgbGFiZWxFbGVtZW50ID0gc2hvd0xhYmVsID8gPGRpdiBzdHlsZT17e3Bvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6ICcxNHB0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6ICdib2xkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnd2hpdGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogQlVUVE9OX0lNQUdFX1dJRFRILFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hpdGVTcGFjZTogJ25vd3JhcCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW5MZWZ0OiAxMH19PntsYWJlbH08L2Rpdj4gOiAnJztcblxuICBmdW5jdGlvbiBoYW5kbGVDbGljayhldnQpIHtcbiAgICBjb25zdCBlbHRSZWN0ID0gZXZ0LnRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcbiAgICAgICAgICBjbGlja1ggPSBldnQuY2xpZW50WCAtIGVsdFJlY3QubGVmdDtcbiAgICBpZiAoKHNleCA9PT0gJ21hbGUnKSAhPT0gKGNsaWNrWCA+IEJVVFRPTl9JTUFHRV9NSURQT0lOVF9YKSlcbiAgICAgIG9uQ2hhbmdlKHNleCA9PT0gJ21hbGUnID8gJ2ZlbWFsZScgOiAnbWFsZScpO1xuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGlkPXtpZH0gc3R5bGU9e3twb3NpdGlvbjogJ3JlbGF0aXZlJ319PlxuICAgICAgPGRpdiAgY2xhc3NOYW1lPXtgZ2VuaWJsb2NrcyBjaGFuZ2Utc2V4LWJ1dHRvbnMgJHtzZWxlY3RlZFNleENsYXNzfWB9XG4gICAgICAgICAgICBzdHlsZT17aW1hZ2VTdHlsZX0gb25DbGljaz17aGFuZGxlQ2xpY2t9ID5cbiAgICAgIDwvZGl2PlxuICAgICAge2xhYmVsRWxlbWVudH1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbkNoYW5nZVNleEJ1dHRvbnMucHJvcFR5cGVzID0ge1xuICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgc2V4OiBQcm9wVHlwZXMub25lT2YoWydtYWxlJywgJ2ZlbWFsZSddKS5pc1JlcXVpcmVkLFxuICBzcGVjaWVzOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBzaG93TGFiZWw6IFByb3BUeXBlcy5ib29sLFxuICBzdHlsZTogUHJvcFR5cGVzLm9iamVjdCxcbiAgb25DaGFuZ2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbn07XG5cbmV4cG9ydCBkZWZhdWx0IENoYW5nZVNleEJ1dHRvbnM7XG4iLCJpbXBvcnQge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuXG5jb25zdCBDaHJvbW9zb21lSW1hZ2VWaWV3ID0gKHt3aWR0aD0yMywgaGVpZ2h0PTEyNiwgY29sb3I9JyNGRjk5OTknfSkgPT4ge1xuICBjb25zdCBzcGxpdD00NSxcbiAgICAgICAgcmFkaXVzID0gd2lkdGgvMixcbiAgICAgICAgaW1hZ2VXaWR0aCA9IHdpZHRoKzQsXG4gICAgICAgIGhhbGZJbWFnZVdpZHRoID0gaW1hZ2VXaWR0aC8yLFxuICAgICAgICBpbWFnZUhlaWdodCA9IGhlaWdodCs0O1xuXG4gIHJldHVybiAoXG4gICAgPHN2ZyB3aWR0aD17aW1hZ2VXaWR0aH0gaGVpZ2h0PXtpbWFnZUhlaWdodH0geG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxuICAgICAgPGc+XG4gICAgICAgIDxjaXJjbGUgcj17cmFkaXVzfSBjeT17cmFkaXVzKzJ9IGN4PXtoYWxmSW1hZ2VXaWR0aH0gc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlPVwiIzAwMDAwMFwiIGZpbGw9e2NvbG9yfS8+XG4gICAgICAgIDxjaXJjbGUgcj17cmFkaXVzfSBjeT17c3BsaXQtcmFkaXVzfSBjeD17aGFsZkltYWdlV2lkdGh9IHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPXtjb2xvcn0vPlxuICAgICAgICA8Y2lyY2xlIHI9e3JhZGl1c30gY3k9e3NwbGl0K3JhZGl1c30gY3g9e2hhbGZJbWFnZVdpZHRofSBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD17Y29sb3J9Lz5cbiAgICAgICAgPGNpcmNsZSByPXtyYWRpdXN9IGN5PXtoZWlnaHQtcmFkaXVzfSBjeD17aGFsZkltYWdlV2lkdGh9IHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPXtjb2xvcn0vPlxuICAgICAgICA8cmVjdCBoZWlnaHQ9eyhzcGxpdC1yYWRpdXMpLShyYWRpdXMrMil9IHdpZHRoPXt3aWR0aH0geT17cmFkaXVzKzJ9IHg9XCIyXCIgc3Ryb2tlV2lkdGg9XCIwXCIgc3Ryb2tlPVwiIzAwMDAwMFwiIGZpbGw9e2NvbG9yfS8+XG4gICAgICAgIDxyZWN0IGhlaWdodD17KGhlaWdodC1yYWRpdXMpLShzcGxpdCtyYWRpdXMpfSB3aWR0aD17d2lkdGh9IHk9e3NwbGl0K3JhZGl1c30geD1cIjJcIiBzdHJva2VXaWR0aD1cIjBcIiBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD17Y29sb3J9Lz5cbiAgICAgICAgPGxpbmUgeTE9e3JhZGl1cysyfSAgICAgeDE9XCIyXCIgICAgICAgeTI9e3NwbGl0LXJhZGl1cysyfSAgeDI9XCIyXCIgICAgICAgc3Ryb2tlTGluZWNhcD1cIm51bGxcIiBzdHJva2VMaW5lam9pbj1cIm51bGxcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD1cIm5vbmVcIi8+XG4gICAgICAgIDxsaW5lIHkxPXtyYWRpdXMrMn0gICAgIHgxPXt3aWR0aCsyfSB5Mj17c3BsaXQtcmFkaXVzKzJ9ICB4Mj17d2lkdGgrMn0gc3Ryb2tlTGluZWNhcD1cIm51bGxcIiBzdHJva2VMaW5lam9pbj1cIm51bGxcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD1cIm5vbmVcIi8+XG4gICAgICAgIDxsaW5lIHkxPXtzcGxpdCtyYWRpdXN9IHgxPVwiMlwiICAgICAgIHkyPXtoZWlnaHQtcmFkaXVzfSAgIHgyPVwiMlwiICAgICAgIHN0cm9rZUxpbmVjYXA9XCJudWxsXCIgc3Ryb2tlTGluZWpvaW49XCJudWxsXCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlPVwiIzAwMDAwMFwiIGZpbGw9XCJub25lXCIvPlxuICAgICAgICA8bGluZSB5MT17c3BsaXQrcmFkaXVzfSB4MT17d2lkdGgrMn0geTI9e2hlaWdodC1yYWRpdXN9ICAgeDI9e3dpZHRoKzJ9IHN0cm9rZUxpbmVjYXA9XCJudWxsXCIgc3Ryb2tlTGluZWpvaW49XCJudWxsXCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlPVwiIzAwMDAwMFwiIGZpbGw9XCJub25lXCIvPlxuICAgICAgPC9nPlxuICAgIDwvc3ZnPlxuICApO1xufTtcblxuQ2hyb21vc29tZUltYWdlVmlldy5wcm9wVHlwZXMgPSB7XG4gIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLFxuICBoZWlnaHQ6IFByb3BUeXBlcy5udW1iZXIsXG4gIGNvbG9yOiBQcm9wVHlwZXMuc3RyaW5nXG59O1xuXG5leHBvcnQgZGVmYXVsdCBDaHJvbW9zb21lSW1hZ2VWaWV3O1xuIiwiaW1wb3J0IHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBDaHJvbW9zb21lSW1hZ2VWaWV3IGZyb20gJy4vY2hyb21vc29tZS1pbWFnZSc7XG5pbXBvcnQgR2VuZUxhYmVsVmlldyBmcm9tICcuL2dlbmUtbGFiZWwnO1xuaW1wb3J0IEdlbmV0aWNzVXRpbHMgZnJvbSAnLi4vdXRpbGl0aWVzL2dlbmV0aWNzLXV0aWxzJztcblxuY29uc3QgQ2hyb21vc29tZVZpZXcgPSAoe29yZywgY2hyb21vc29tZU5hbWUsIHNpZGUsIGhpZGRlbkFsbGVsZXM9W10sIGVkaXRhYmxlPXRydWUsIG9uQWxsZWxlQ2hhbmdlLCBsYWJlbHNPblJpZ2h0PXRydWV9KSA9PiB7XG4gIGxldCBhbGxlbGVzID0gb3JnLmdldEdlbm90eXBlKCkuY2hyb21vc29tZXNbY2hyb21vc29tZU5hbWVdW3NpZGVdLmFsbGVsZXMsXG4gICAgICB2aXNpYmxlQWxsZWxlcyA9IEdlbmV0aWNzVXRpbHMuZmlsdGVyQWxsZWxlcyhhbGxlbGVzLCBoaWRkZW5BbGxlbGVzLCBvcmcuc3BlY2llcyksXG4gICAgICBsYWJlbHMgID0gdmlzaWJsZUFsbGVsZXMubWFwKGEgPT4ge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxHZW5lTGFiZWxWaWV3IGtleT17YX0gc3BlY2llcz17b3JnLnNwZWNpZXN9IGFsbGVsZT17YX0gZWRpdGFibGU9e2VkaXRhYmxlfVxuICAgICAgICAgIG9uQWxsZWxlQ2hhbmdlPXtmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgb25BbGxlbGVDaGFuZ2UoYSwgZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgICB9fS8+XG4gICAgICAgICk7XG4gICAgICB9KSxcblxuICAgICAgY29udGFpbmVyQ2xhc3MgPSBcIml0ZW1zXCI7XG5cbiAgaWYgKCFsYWJlbHNPblJpZ2h0KSB7XG4gICAgY29udGFpbmVyQ2xhc3MgKz0gXCIgcnRsXCI7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBjaHJvbW9zb21lLWNvbnRhaW5lclwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9eyBjb250YWluZXJDbGFzcyB9PlxuICAgICAgICA8Q2hyb21vc29tZUltYWdlVmlldyAvPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImxhYmVsc1wiPlxuICAgICAgICAgIHsgbGFiZWxzIH1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbkNocm9tb3NvbWVWaWV3LnByb3BUeXBlcyA9IHtcbiAgb3JnOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGNocm9tb3NvbWVOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIHNpZGU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgaGlkZGVuQWxsZWxlczogUHJvcFR5cGVzLmFycmF5LFxuICBlZGl0YWJsZTogUHJvcFR5cGVzLmJvb2wsXG4gIG9uQWxsZWxlQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgbGFiZWxzT25SaWdodDogUHJvcFR5cGVzLmJvb2xcbn07XG5cbmV4cG9ydCBkZWZhdWx0IENocm9tb3NvbWVWaWV3O1xuIiwiaW1wb3J0IHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcblxuLyoqXG4gKiBVc2VzIGFuIFNWRyBjaXJjdWxhciBncmFkaWVudCB0byBpbXBsZW1lbnQgYSBmYWRpbmcgZ2xvdyBiYWNrZ3JvdW5kLlxuICogSW1wbGVtZW50ZWQgYXMgYSBzdGF0ZWxlc3MgZnVuY3Rpb25hbCBSZWFjdCBjb21wb25lbnQuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGNvbG9yIC0gdGhlIGNvbG9yIG9mIHRoZSBjaXJjdWxhciBncmFkaWVudCBcImdsb3dcIlxuICogQHBhcmFtIHtudW1iZXJ9IHNpemUgLSB0aGUgZGlhbWV0ZXIgb2YgdGhlIGNpcmN1bGFyIGdyYWRpZW50XG4gKiBAcGFyYW0ge29iamVjdH0gc3R5bGUgLSBzdHlsZXMgYXBwbGllZCB0byB0aGUgb3V0ZXIgZGl2XG4gKi9cbmNvbnN0IENpcmN1bGFyR2xvd1ZpZXcgPSAoe2lkLCBjb2xvciwgc2l6ZSwgc3R5bGV9KSA9PiB7XG4gIGxldCByYWRpdXMgPSBzaXplLzIsXG4gICAgICBjb2xvck5vSGFzaCA9IGNvbG9yLnJlcGxhY2UoJyMnLCAnJyksXG4gICAgICBncmFkaWVudElEID0gYENpcmN1bGFyR2xvd1ZpZXdfJHtpZCB8fCBjb2xvck5vSGFzaH1gLFxuICAgICAgZ3JhZGllbnRJRFVybCA9IGB1cmwoIyR7Z3JhZGllbnRJRH0pYDtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBjaXJjdWxhci1nbG93XCIgc3R5bGU9e3N0eWxlfT5cbiAgICAgIDxzdmcgd2lkdGg9e3NpemUrMn0gaGVpZ2h0PXtzaXplKzJ9IHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cbiAgICAgICAgPGRlZnM+XG4gICAgICAgICAgPHJhZGlhbEdyYWRpZW50IGlkPXtncmFkaWVudElEfT5cbiAgICAgICAgICAgIDxzdG9wIG9mZnNldD1cIjAlXCIgc3RvcENvbG9yPXtjb2xvcn0gc3RvcE9wYWNpdHk9XCIxLjBcIi8+XG4gICAgICAgICAgICA8c3RvcCBvZmZzZXQ9XCIxMDAlXCIgc3RvcENvbG9yPXtjb2xvcn0gc3RvcE9wYWNpdHk9XCIwLjBcIi8+XG4gICAgICAgICAgPC9yYWRpYWxHcmFkaWVudD5cbiAgICAgICAgPC9kZWZzPlxuICAgICAgICA8Y2lyY2xlIGZpbGw9e2dyYWRpZW50SURVcmx9IGN4PXtyYWRpdXN9IGN5PXtyYWRpdXN9IHI9e3JhZGl1c30gLz5cbiAgICAgIDwvc3ZnPlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuQ2lyY3VsYXJHbG93Vmlldy5wcm9wVHlwZXMgPSB7XG4gIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBjb2xvcjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBzaXplOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIHN0eWxlOiBQcm9wVHlwZXMub2JqZWN0XG59O1xuXG5leHBvcnQgZGVmYXVsdCBDaXJjdWxhckdsb3dWaWV3O1xuIiwiaW1wb3J0IHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcblxuLyoqXG4gKiBJbXBsZW1lbnRzIGEgcmVjdGFuZ3VsYXIgdGV4dCBhcmVhIGZvciBwcm92aWRpbmcgZmVlZGJhY2sgdG8gdXNlcnMsIHN1Y2ggYXNcbiAqIHRoYXQgdXNlZCBpbiBHZW5pdmVyc2UncyBjaGFsbGVuZ2VzIGZvciBwcm92aWRpbmcgdHJpYWwgYW5kIGdvYWwgZmVlZGJhY2suXG4gKiBJbXBsZW1lbnRlZCBhcyBhIFJlYWN0IHN0YXRlbGVzcyBmdW5jdGlvbmFsIGNvbXBvbmVudC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ3xzdHJpbmdbXX0gdGV4dCAtIGEgc2luZ2xlIG9yIG11bHRpcGxlIGxpbmVzIG9mIHRleHQgdG8gZGlzcGxheVxuICogQHBhcmFtIHtvYmplY3R9IHN0eWxlIC0gaW5saW5lIHN0eWxlcyBhcHBsaWVkIHRvIHRoZSA8ZGl2PiBjb250YWluaW5nIGVhY2ggbGluZSBvZiB0ZXh0XG4gKi9cbmNvbnN0IEZlZWRiYWNrVmlldyA9ICh7dGV4dCwgc3R5bGU9e319KSA9PiB7XG4gIGNvbnN0IHRUZXh0ID0gQXJyYXkuaXNBcnJheSh0ZXh0KSA/IHRleHQgOiBbdGV4dF0sXG4gICAgICAgIGxpbmVDb3VudCA9IHRUZXh0Lmxlbmd0aCxcbiAgICAgICAgaGVpZ2h0ID0gMjAgKiBsaW5lQ291bnQgKyAyLFxuICAgICAgICBkZWZhdWx0U3R5bGUgPSB7IGhlaWdodDogaGVpZ2h0LCAuLi5zdHlsZSB9LFxuICAgICAgICB0ZXh0TGluZXMgPSB0VGV4dC5tYXAoKGlUZXh0LCBpbmRleCkgPT4gXG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGZlZWRiYWNrIHRleHQtbGluZVwiIGtleT17aW5kZXh9PntpVGV4dH08L2Rpdj4pO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGZlZWRiYWNrLXZpZXdcIiBzdHlsZT17ZGVmYXVsdFN0eWxlfT5cbiAgICAgIHt0ZXh0TGluZXN9XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5GZWVkYmFja1ZpZXcucHJvcFR5cGVzID0ge1xuICB0ZXh0OiBQcm9wVHlwZXMub25lT2ZUeXBlKFtcbiAgICAgICAgICBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICAgIFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zdHJpbmcpXG4gICAgICAgIF0pLmlzUmVxdWlyZWQsXG4gIHN0eWxlOiBQcm9wVHlwZXMub2JqZWN0XG59O1xuXG5leHBvcnQgZGVmYXVsdCBGZWVkYmFja1ZpZXc7XG4iLCJpbXBvcnQge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IEFuaW1hdGVkR2FtZXRlVmlldyBmcm9tICcuL2FuaW1hdGVkLWdhbWV0ZSc7XG5cbmNvbnN0IElOSVRJQUxfR0FNRVRFX1NJWkUgPSAzMCxcbiAgICAgIEZJTkFMX0dBTUVURV9TSVpFID0gMTQwLFxuICAgICAgUkVTVElOR19NT1RIRVJfR0FNRVRFX1ggPSAwLFxuICAgICAgUkVTVElOR19GQVRIRVJfR0FNRVRFX1ggPSAxNTAsXG4gICAgICBGRVJUSUxJWklOR19NT1RIRVJfR0FNRVRFX1ggPSA3MCxcbiAgICAgIEZFUlRJTElaSU5HX0ZBVEhFUl9HQU1FVEVfWCA9IDgwLFxuICAgICAgRklOQUxfWllHT1RFX1kgPSAtMTUwO1xuXG5leHBvcnQgY29uc3QgR0FNRVRFX1RZUEUgPSB7IE1PVEhFUjogJ21vdGhlcicsIEZBVEhFUjogJ2ZhdGhlcicgfTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmVydGlsaXppbmdHYW1ldGVWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHR5cGU6IFByb3BUeXBlcy5vbmVPZihbIEdBTUVURV9UWVBFLk1PVEhFUiwgR0FNRVRFX1RZUEUuRkFUSEVSIF0pLmlzUmVxdWlyZWQsXG4gICAgZ2FtZXRlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgaWQ6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICBmZXJ0aWxpemF0aW9uU3RhdGU6IFByb3BUeXBlcy5vbmVPZihbJ25vbmUnLCAnZmVydGlsaXppbmcnLCAnZmVydGlsaXplZCcsICdjb21wbGV0ZSddKS5pc1JlcXVpcmVkLFxuICAgIGhpZGRlbkFsbGVsZXM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zdHJpbmcpLFxuICAgIHNyY1JlY3Q6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBsZWZ0OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgICB0b3A6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICAgIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgICBoZWlnaHQ6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZFxuICAgIH0pLFxuICAgIGRzdFJlY3Q6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBsZWZ0OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgICB0b3A6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICAgIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgICBoZWlnaHQ6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZFxuICAgIH0pLFxuICAgIGFuaW1TdGlmZm5lc3M6IFByb3BUeXBlcy5udW1iZXIsICAvLyBzdGlmZm5lc3Mgb2Ygc3ByaW5nIGZvciBhbmltYXRpb24gKGRlZmF1bHQ6IDEwMClcbiAgICBvblJlc3Q6IFByb3BUeXBlcy5mdW5jXG4gIH1cblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIGhpZGRlbkFsbGVsZXM6IFtdLFxuICAgIGFuaW1TdGlmZm5lc3M6IDEwMFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gIH1cblxuICByZW5kZXIgPSAoKSA9PiB7XG4gICAgbGV0IHtnYW1ldGUsIGlkLCBoaWRkZW5BbGxlbGVzLCBhbmltU3RpZmZuZXNzLCBvblJlc3R9ID0gdGhpcy5wcm9wcyxcbiAgICAgICAgeE9mZnNldCA9IHRoaXMucHJvcHMuc3JjUmVjdCA/IHRoaXMucHJvcHMuc3JjUmVjdC5sZWZ0IC0gdGhpcy5wcm9wcy5kc3RSZWN0LmxlZnQgOiAwLFxuICAgICAgICB5T2Zmc2V0ID0gdGhpcy5wcm9wcy5zcmNSZWN0ID8gdGhpcy5wcm9wcy5zcmNSZWN0LnRvcCAtIHRoaXMucHJvcHMuZHN0UmVjdC50b3AgOiAwLFxuICAgICAgICB4UmVzdGluZyA9IHRoaXMucHJvcHMudHlwZSA9PT0gR0FNRVRFX1RZUEUuRkFUSEVSID8gUkVTVElOR19GQVRIRVJfR0FNRVRFX1hcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFJFU1RJTkdfTU9USEVSX0dBTUVURV9YLFxuICAgICAgICB4RmVydGlsaXppbmcgPSB0aGlzLnByb3BzLnR5cGUgPT09IEdBTUVURV9UWVBFLkZBVEhFUiA/IEZFUlRJTElaSU5HX0ZBVEhFUl9HQU1FVEVfWFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IEZFUlRJTElaSU5HX01PVEhFUl9HQU1FVEVfWCxcbiAgICAgICAgaW5pdGlhbCwgdEZpbmFsO1xuXG4gICAgaWYgKCFnYW1ldGUgfHwgKGlkID09IG51bGwpKSByZXR1cm47XG5cbiAgICBpZiAodGhpcy5wcm9wcy5mZXJ0aWxpemF0aW9uU3RhdGUgPT09ICdub25lJykge1xuICAgICAgaWYgKHRoaXMucHJvcHMudHlwZSA9PT0gR0FNRVRFX1RZUEUuRkFUSEVSKVxuICAgICAgICB4T2Zmc2V0ICs9IFJFU1RJTkdfRkFUSEVSX0dBTUVURV9YO1xuICAgICAgaW5pdGlhbCA9IHsgeDogeE9mZnNldCwgeTogeU9mZnNldCwgc2l6ZTogSU5JVElBTF9HQU1FVEVfU0laRSB9O1xuICAgICAgdEZpbmFsID0geyB4OiB4UmVzdGluZywgeTogMCwgc2l6ZTogRklOQUxfR0FNRVRFX1NJWkUgfTtcbiAgICB9XG4gICAgZWxzZSBpZiAodGhpcy5wcm9wcy5mZXJ0aWxpemF0aW9uU3RhdGUgPT09ICdmZXJ0aWxpemluZycpIHtcbiAgICAgIGluaXRpYWwgPSB7IHg6IHhSZXN0aW5nLCB5OiAwLCBzaXplOiBGSU5BTF9HQU1FVEVfU0laRSwgb3BhY2l0eTogMS4wIH07XG4gICAgICB0RmluYWwgPSB7IHg6IHhGZXJ0aWxpemluZywgeTogMCwgc2l6ZTogRklOQUxfR0FNRVRFX1NJWkUsIHJvdGF0aW9uOiAwLCBvcGFjaXR5OiAxLjAgfTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBpbml0aWFsID0geyB4OiB4RmVydGlsaXppbmcsIHk6IDAsIHNpemU6IEZJTkFMX0dBTUVURV9TSVpFLCByb3RhdGlvbjogMCwgb3BhY2l0eTogMS4wIH07XG4gICAgICB0RmluYWwgPSB7IHg6IHhGZXJ0aWxpemluZywgeTogRklOQUxfWllHT1RFX1ksIHNpemU6IEZJTkFMX0dBTUVURV9TSVpFLCByb3RhdGlvbjogMCwgb3BhY2l0eTogMC4wIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxBbmltYXRlZEdhbWV0ZVZpZXcgZ2FtZXRlPXtnYW1ldGV9IGlkPXtpZH0gaGlkZGVuQWxsZWxlcz17aGlkZGVuQWxsZWxlc31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgaW5pdGlhbERpc3BsYXk9e2luaXRpYWx9IGRpc3BsYXk9e3RGaW5hbH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbVN0aWZmbmVzcz17YW5pbVN0aWZmbmVzc30gb25SZXN0PXtvblJlc3R9IC8+XG4gICAgKTtcbiAgfVxufVxuIiwiaW1wb3J0IHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBBbmltYXRlZEdhbWV0ZVZpZXcgZnJvbSAnLi9hbmltYXRlZC1nYW1ldGUnO1xuXG5jb25zdCBHYW1ldGVQb29sVmlldyA9ICh7Z2FtZXRlcywgaGlkZGVuQWxsZWxlcz1bXSwgd2lkdGg9MzAwLCBoZWlnaHQ9MjAwLCBhbmltU3RpZmZuZXNzPTYwLCBzZWxlY3RlZElkLCBpc0dhbWV0ZURpc2FibGVkLCBvbkdhbWV0ZVNlbGVjdGVkfSkgPT4ge1xuICBsZXQgZ2FtZXRlQ291bnQgPSBnYW1ldGVzLmxlbmd0aCxcbiAgICAgIGdhbWV0ZVNpemUgPSAzMCxcbiAgICAgIG1hcmdpbiA9IDUsXG4gICAgICBzcGFjaW5nRGVmYXVsdCA9IGdhbWV0ZVNpemUgKyAyICogbWFyZ2luLFxuICAgICAgeFNwYWNpbmcgPSBzcGFjaW5nRGVmYXVsdCxcbiAgICAgIHlTcGFjaW5nID0gc3BhY2luZ0RlZmF1bHQsXG4gICAgICBjb2xEZWZhdWx0ID0gTWF0aC5mbG9vcih3aWR0aCAvIHNwYWNpbmdEZWZhdWx0KSxcbiAgICAgIHJvd0RlZmF1bHQgPSBNYXRoLmZsb29yKGhlaWdodCAvIHNwYWNpbmdEZWZhdWx0KSxcbiAgICAgIGVuYWJsZWRDb3VudCA9IDAsXG4gICAgICBkaXNhYmxlZENvdW50ID0gMCxcbiAgICAgIGRpc2FibGVkRmxhZ3MgPSBpc0dhbWV0ZURpc2FibGVkID8gZ2FtZXRlcy5tYXAoZyA9PiBpc0dhbWV0ZURpc2FibGVkKGcpKSA6IFtdLFxuICAgICAgdG90YWxEaXNhYmxlZENvdW50ID0gZGlzYWJsZWRGbGFncy5yZWR1Y2UoKHRvdGFsLGZsYWcpID0+IHRvdGFsICsgZmxhZywgMCksXG4gICAgICAvLyBsZWF2ZSByb29tIGZvciB0aGUgZGlzYWJsZWQgZ2FtZXRlIHJvdyBpZiB0aGVyZSBhcmUgZGlzYWJsZWQgZ2FtZXRlc1xuICAgICAgYXZhaWxhYmxlSGVpZ2h0ID0gaGVpZ2h0IC0gKHRvdGFsRGlzYWJsZWRDb3VudCA/IHNwYWNpbmdEZWZhdWx0IDogMCkgLSA0ICogbWFyZ2luLFxuICAgICAgLy8gcGFjayB0aGUgZGlzYWJsZWQgZ2FtZXRlcyBpbnRvIHRoZSBkaXNhYmxlZCByb3dcbiAgICAgIHhEaXNhYmxlZFNwYWNpbmcgPSBNYXRoLm1pbih4U3BhY2luZyAvIDIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHdpZHRoIC0gNyAqIG1hcmdpbikgLyB0b3RhbERpc2FibGVkQ291bnQpLFxuICAgICAgeURpc2FibGVkU3BhY2luZyA9IHNwYWNpbmdEZWZhdWx0LFxuICAgICAgdG90YWxFbmFibGVkQ291bnQgPSBnYW1ldGVDb3VudCAtIHRvdGFsRGlzYWJsZWRDb3VudCxcbiAgICAgIGdhbWV0ZVZpZXdzO1xuXG4gIC8vIHNxdWVlemUgaW4gdG8gbWFrZSByb29tIGZvciBhZGRpdGlvbmFsIGdhbWV0ZXMgaWYgbmVjZXNzYXJ5XG4gIHZhciBjb2xDb3VudCA9IGNvbERlZmF1bHQsXG4gICAgICByb3dDb3VudCA9IHJvd0RlZmF1bHQgLSAodG90YWxEaXNhYmxlZENvdW50ID4gMCk7XG4gIHdoaWxlIChjb2xDb3VudCAqIHJvd0NvdW50IDwgdG90YWxFbmFibGVkQ291bnQpIHtcbiAgICBpZiAoeVNwYWNpbmcgPiB4U3BhY2luZykge1xuICAgICAgeVNwYWNpbmcgPSBhdmFpbGFibGVIZWlnaHQgLyArK3Jvd0NvdW50O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHhTcGFjaW5nID0gKHdpZHRoIC0gNCAqIG1hcmdpbikgLyArK2NvbENvdW50O1xuICAgIH1cbiAgfVxuXG4gIGdhbWV0ZVZpZXdzID0gZ2FtZXRlcy5tYXAoKGdhbWV0ZSwgaW5kZXgpID0+IHtcbiAgICBjb25zdCBpc0Rpc2FibGVkID0gZGlzYWJsZWRGbGFnc1tpbmRleF0sXG4gICAgICAgICAgbGF5b3V0SW5kZXggPSBpc0Rpc2FibGVkID8gZGlzYWJsZWRDb3VudCsrIDogZW5hYmxlZENvdW50KyssXG4gICAgICAgICAgcm93ID0gaXNEaXNhYmxlZCA/IHJvd0RlZmF1bHQgLSAxIDogTWF0aC5mbG9vcihsYXlvdXRJbmRleCAvIGNvbENvdW50KSxcbiAgICAgICAgICBjb2wgPSBpc0Rpc2FibGVkID8gbGF5b3V0SW5kZXggOiBsYXlvdXRJbmRleCAlIGNvbENvdW50LFxuICAgICAgICAgIHkgPSBpc0Rpc2FibGVkID8gcm93ICogeURpc2FibGVkU3BhY2luZyA6IHJvdyAqIHlTcGFjaW5nLFxuICAgICAgICAgIHggPSBpc0Rpc2FibGVkID8gY29sICogeERpc2FibGVkU3BhY2luZyA6IGNvbCAqIHhTcGFjaW5nO1xuICAgIHJldHVybiAoXG4gICAgICA8QW5pbWF0ZWRHYW1ldGVWaWV3IGdhbWV0ZT17Z2FtZXRlfSBpZD17aW5kZXggKyAxfSBrZXk9e2luZGV4fVxuICAgICAgICAgICAgICAgICAgICAgICAgICBoaWRkZW5BbGxlbGVzPXtoaWRkZW5BbGxlbGVzfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBpbml0aWFsRGlzcGxheT17eyB4OiBNYXRoLnJvdW5kKHdpZHRoLzIpLCB5OiAtTWF0aC5yb3VuZCh5U3BhY2luZykgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheT17eyB4OiBNYXRoLnJvdW5kKHgpLCB5OiBNYXRoLnJvdW5kKHkpIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1TdGlmZm5lc3M9e2FuaW1TdGlmZm5lc3N9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlzU2VsZWN0ZWQ9e2luZGV4ICsgMSA9PT0gc2VsZWN0ZWRJZH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgaXNEaXNhYmxlZD17aXNEaXNhYmxlZH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17b25HYW1ldGVTZWxlY3RlZH0gLz5cbiAgICApO1xuICB9KTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBnYW1ldGUtcG9vbFwiIHN0eWxlPXt7IHdpZHRoOiB3aWR0aCwgaGVpZ2h0OiBoZWlnaHQgfX0+XG4gICAgICB7IGdhbWV0ZVZpZXdzIH1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbkdhbWV0ZVBvb2xWaWV3LnByb3BUeXBlcyA9IHtcbiAgZ2FtZXRlczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm9iamVjdCkuaXNSZXF1aXJlZCxcbiAgaGlkZGVuQWxsZWxlczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnN0cmluZyksXG4gIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLFxuICBoZWlnaHQ6IFByb3BUeXBlcy5udW1iZXIsXG4gIGFuaW1TdGlmZm5lc3M6IFByb3BUeXBlcy5udW1iZXIsXG4gIHNlbGVjdGVkSWQ6IFByb3BUeXBlcy5udW1iZXIsXG4gIGlzR2FtZXRlRGlzYWJsZWQ6IFByb3BUeXBlcy5mdW5jLFxuICBvbkdhbWV0ZVNlbGVjdGVkOiBQcm9wVHlwZXMuZnVuY1xufTtcblxuZXhwb3J0IGRlZmF1bHQgR2FtZXRlUG9vbFZpZXc7XG4iLCJpbXBvcnQge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuXG4vKipcbiAqIFN0YXRlbGVzcyBmdW5jdGlvbmFsIFJlYWN0IGNvbXBvbmVudCBmb3IgZGlzcGxheWluZyBhIEJpb2xvZ2ljYSBnYW1ldGVcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZ2FtZXRlIC0gQmlvbG9naWNhIGdhbWV0ZSAobWFwIG9mIGNocm9tb3NvbWUgbmFtZXMgdG8gY2hyb21vc29tZXMpXG4gKiBAcGFyYW0ge251bWJlcn0gaWQgLSB0aGUgdW5pcXVlIGlkIG9mIHRoaXMgZ2FtZXRlXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBoaWRkZW5BbGxlbGVzIC0gaW5kaXZpZHVhbCBhbGxlbGVzIG9mIGdlbmVzIGZvciB3aGljaCBhbGwgYWxsZWxlcyBzaG91bGQgYmUgaGlkZGVuXG4gKiBAcGFyYW0ge09iamVjdH0gZGlzcGxheSAtIGRpc3BsYXkgcGFyYW1ldGVycyB1c2VkIHRvIHJlcHJlc2VudCB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gZGlzcGxheS54IC0gbG9jYXRpb24gKGxlZnQpIG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBkaXNwbGF5LnkgLSBsb2NhdGlvbiAodG9wKSBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gW2Rpc3BsYXkuc2l6ZT0zMF0gLSBzaXplICh3aWR0aCAmIGhlaWdodCkgb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IFtkaXNwbGF5LnJvdGF0aW9uPTBdIC0gcm90YXRpb24gb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IFtkaXNwbGF5Lm9wYWNpdHk9MV0gLSBvcGFjaXR5IG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzU2VsZWN0ZWQ9ZmFsc2VdIC0gd2hldGhlciB0aGUgZ2FtZXRlIHNob3VsZCBoYXZlIHRoZSAnc2VsZWN0ZWQnIGNsYXNzIGFwcGxpZWRcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzRGlzYWJsZWQ9ZmFsc2VdIC0gd2hldGhlciB0aGUgZ2FtZXRlIHNob3VsZCBoYXZlIHRoZSAnZGlzYWJsZWQnIGNsYXNzIGFwcGxpZWRcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IFtvbkNsaWNrKGV2dCwgaWQsIHJlY3QpXSAtIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBnYW1ldGUgaXMgY2xpY2tlZFxuICpcbiAqIE5vdGU6IEFzIHRoaW5ncyBzdGFuZCBjdXJyZW50bHksIHRoZXJlIGlzIF9ub18gcGFydGljdWxhciByZXByZXNlbnRhdGlvbiBvZiB0aGUgZ2FtZXRlIGRlZmluZWRcbiAqIGJ5IHRoaXMgdmlldy4gVGhlIGNsaWVudCBjYW4gc3R5bGUgdGhlIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBnYW1ldGUgYnkgc3R5bGluZyB0aGVcbiAqICcuZ2VuaWJsb2Nrcy5nYW1ldGUnIGNsYXNzIGluIENTUywgZS5nLiBieSBhc3NpZ25pbmcgYSBiYWNrZ3JvdW5kLWltYWdlLlxuICovXG5jb25zdCBHYW1ldGVWaWV3ID0gKHtnYW1ldGUsIGlkLCBoaWRkZW5BbGxlbGVzPVtdLCBkaXNwbGF5LCBpc1NlbGVjdGVkPWZhbHNlLCBpc0Rpc2FibGVkPWZhbHNlLCBvbkNsaWNrfSkgPT4ge1xuXG4gIGZ1bmN0aW9uIGhhbmRsZUNsaWNrKGV2dCkge1xuICAgIGNvbnN0IGVsdCA9IGV2dC50YXJnZXQsXG4gICAgICAgICAgcmVjdCA9IGVsdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBpZiAoIWlzRGlzYWJsZWQgJiYgb25DbGljaykge1xuICAgICAgb25DbGljayhldnQsIGlkLCByZWN0KTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBidWlsZFRvb2x0aXBGb3JHYW1ldGUoZ2FtZXRlKSB7XG4gICAgbGV0IHRvb2x0aXAgPSBcIlwiLFxuICAgICAgICBhbGxIaWRkZW5BbGxlbGVzO1xuICAgIC8vIE5vdGU6IGl0IHdvdWxkIGJlIG1vcmUgZWZmaWNpZW50IGZvciB0aGUgY2FsbGVyIHRvIHBhc3MgaW4gdGhlXG4gICAgLy8gYWxsSGlkZGVuQWxsZWxlcyBhcnJheSByYXRoZXIgdGhhbiBjb21wdXRpbmcgaXQgZWFjaCB0aW1lIGhlcmUuXG4gICAgLy8gQnV0IGlmIHdlIG1vdmVkIGl0IG91dCByaWdodCBub3cgd2UnZCBoYXZlIHRvIGVsaW1pbmF0ZSB0aGUgRVM2IHNwbGF0LlxuICAgIGZ1bmN0aW9uIGNvbmNhdEhpZGRlbkFsbGVsZXMoaVNwZWNpZXMsIGlIaWRkZW5BbGxlbGVzKSB7XG4gICAgICBhbGxIaWRkZW5BbGxlbGVzID0gW107XG4gICAgICBmb3IgKGNvbnN0IGFsbGVsZSBvZiBpSGlkZGVuQWxsZWxlcykge1xuICAgICAgICBjb25zdCBnZW5lID0gQmlvTG9naWNhLkdlbmV0aWNzLmdldEdlbmVPZkFsbGVsZShpU3BlY2llcywgYWxsZWxlKTtcbiAgICAgICAgYWxsSGlkZGVuQWxsZWxlcy5wdXNoKC4uLmdlbmUuYWxsZWxlcyk7XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAoY29uc3QgY2ggaW4gZ2FtZXRlKSB7XG4gICAgICB2YXIgY2hyb21vc29tZSA9IGdhbWV0ZVtjaF07XG4gICAgICBpZiAoYWxsSGlkZGVuQWxsZWxlcyA9PSBudWxsKVxuICAgICAgICBjb25jYXRIaWRkZW5BbGxlbGVzKGNocm9tb3NvbWUuc3BlY2llcywgaGlkZGVuQWxsZWxlcyk7XG4gICAgICBmb3IgKGNvbnN0IGFsbGVsZSBvZiBjaHJvbW9zb21lLmFsbGVsZXMpIHtcbiAgICAgICAgaWYgKGFsbEhpZGRlbkFsbGVsZXMuaW5kZXhPZihhbGxlbGUpIDwgMCkge1xuICAgICAgICAgIGNvbnN0IGxhYmVsID0gY2hyb21vc29tZS5zcGVjaWVzLmFsbGVsZUxhYmVsTWFwW2FsbGVsZV07XG4gICAgICAgICAgdG9vbHRpcCArPSAodG9vbHRpcCA/ICdcXG4nIDogJycpICsgY2ggKyAnOiAnICsgbGFiZWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChjaCA9PT0gJ1hZJykge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGNocm9tb3NvbWUuc2lkZSA9PT0gJ3knID8gJ3knIDogJ3gnO1xuICAgICAgICB0b29sdGlwICs9ICh0b29sdGlwID8gJ1xcbicgOiAnJykgKyBjaCArICc6ICcgKyB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRvb2x0aXA7XG4gIH1cblxuICBjb25zdCBzZWxlY3RlZENsYXNzID0gaXNTZWxlY3RlZCAmJiAhaXNEaXNhYmxlZCA/IFwic2VsZWN0ZWRcIiA6IFwiXCIsXG4gICAgICAgIGRpc2FibGVkQ2xhc3MgPSBpc0Rpc2FibGVkID8gXCJkaXNhYmxlZFwiIDogXCJcIixcbiAgICAgICAgZ3JvdXAgPSBpZCAlIDQsXG4gICAgICAgIHJvdGF0aW9uRm9yR3JvdXAgPSBncm91cCAqIDkwLFxuICAgICAgICBjbGFzc2VzID0gYGdlbmlibG9ja3MgZ2FtZXRlICR7c2VsZWN0ZWRDbGFzc30gJHtkaXNhYmxlZENsYXNzfSBncm91cCR7Z3JvdXB9YCxcbiAgICAgICAgc2l6ZSA9IGRpc3BsYXkuc2l6ZSB8fCAzMCxcbiAgICAgICAgcm90YXRpb24gPSBkaXNwbGF5LnJvdGF0aW9uICE9IG51bGwgPyBkaXNwbGF5LnJvdGF0aW9uIDogcm90YXRpb25Gb3JHcm91cCxcbiAgICAgICAgdHJhbnNmb3JtID0gcm90YXRpb24gPyBgcm90YXRlKCR7cm90YXRpb259ZGVnKWAgOiAnJyxcbiAgICAgICAgb3BhY2l0eSA9IGRpc3BsYXkub3BhY2l0eSAhPSBudWxsID8gZGlzcGxheS5vcGFjaXR5IDogMS4wLFxuICAgICAgICB0b29sdGlwID0gYnVpbGRUb29sdGlwRm9yR2FtZXRlKGdhbWV0ZSk7XG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzZXN9IHRpdGxlPXt0b29sdGlwfVxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBsZWZ0OiBkaXNwbGF5LngsIHRvcDogZGlzcGxheS55LFxuICAgICAgICAgICAgd2lkdGg6IHNpemUsIGhlaWdodDogc2l6ZSxcbiAgICAgICAgICAgIHRyYW5zZm9ybSwgb3BhY2l0eVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25DbGljaz17aGFuZGxlQ2xpY2t9PlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuR2FtZXRlVmlldy5wcm9wVHlwZXMgPSB7XG4gIGdhbWV0ZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBpZDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBoaWRkZW5BbGxlbGVzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc3RyaW5nKSxcbiAgZGlzcGxheTogUHJvcFR5cGVzLnNoYXBlKHsgICAgICAgIC8vIGRpc3BsYXkgcHJvcGVydGllc1xuICAgIHg6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCwgLy8gbG9jYXRpb24gKGxlZnQpIG9mIGdhbWV0ZSBpbWFnZVxuICAgIHk6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCwgLy8gbG9jYXRpb24gKHRvcCkgb2YgZ2FtZXRlIGltYWdlXG4gICAgc2l6ZTogUHJvcFR5cGVzLm51bWJlciwgICAgICAgICAvLyBzaXplIG9mIGdhbWV0ZSBpbWFnZSAoZGVmYXVsdDogMzApXG4gICAgcm90YXRpb246IFByb3BUeXBlcy5udW1iZXIsICAgICAvLyByb3RhdGlvbiAoZGVnKSBvZiBnYW1ldGUgaW1hZ2UgKGRlZmF1bHQ6IDB8OTB8MTgwfDI3MClcbiAgICBvcGFjaXR5OiBQcm9wVHlwZXMubnVtYmVyICAgICAgIC8vIG9wYWNpdHkgb2YgZ2FtZXRlIGltYWdlIChkZWZhdWx0OiAxLjApXG4gIH0pLmlzUmVxdWlyZWQsXG4gIGlzU2VsZWN0ZWQ6IFByb3BUeXBlcy5ib29sLFxuICBpc0Rpc2FibGVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgb25DbGljazogUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWV0ZVZpZXc7XG4iLCJpbXBvcnQge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuXG5jb25zdCBHZW5lTGFiZWxWaWV3ID0gKHtzcGVjaWVzLCBhbGxlbGUsIGVkaXRhYmxlPWZhbHNlLCBvbkFsbGVsZUNoYW5nZX0pID0+IHtcbiAgaWYgKCFlZGl0YWJsZSkge1xuICAgIGNvbnN0IGFsbGVsZU5hbWUgPSBzcGVjaWVzLmFsbGVsZUxhYmVsTWFwW2FsbGVsZV07XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBnZW5lLWxhYmVsIGFsbGVsZSBub25lZGl0YWJsZVwiPlxuICAgICAgICA8c3Bhbj5cbiAgICAgICAgICB7IGFsbGVsZU5hbWUgfVxuICAgICAgICA8L3NwYW4+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IGFsbGVsZXMgPSBCaW9Mb2dpY2EuR2VuZXRpY3MuZ2V0R2VuZU9mQWxsZWxlKHNwZWNpZXMsIGFsbGVsZSkuYWxsZWxlcyxcbiAgICAgICAgICBhbGxlbGVOYW1lcyA9IGFsbGVsZXMubWFwKGEgPT4gc3BlY2llcy5hbGxlbGVMYWJlbE1hcFthXSksXG4gICAgICAgICAgYWxsZWxlT3B0aW9ucyA9IGFsbGVsZU5hbWVzLm1hcCgobmFtZSwgaSkgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24ga2V5PXtuYW1lfSB2YWx1ZT17YWxsZWxlc1tpXX0+e25hbWV9PC9vcHRpb24+KVxuICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgZ2VuZS1sYWJlbCBhbGxlbGUgZWRpdGFibGVcIj5cbiAgICAgICAgPHNlbGVjdCB2YWx1ZT17IGFsbGVsZSB9IG9uQ2hhbmdlPXsgb25BbGxlbGVDaGFuZ2UgfT5cbiAgICAgICAgICB7IGFsbGVsZU9wdGlvbnMgfVxuICAgICAgICA8L3NlbGVjdD5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn07XG5cbkdlbmVMYWJlbFZpZXcucHJvcFR5cGVzID0ge1xuICBzcGVjaWVzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGFsbGVsZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBlZGl0YWJsZTogUHJvcFR5cGVzLmJvb2wsXG4gIG9uQWxsZWxlQ2hhbmdlOiBQcm9wVHlwZXMuZnVuY1xufTtcblxuZXhwb3J0IGRlZmF1bHQgR2VuZUxhYmVsVmlldztcbiIsImltcG9ydCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgQ2hyb21vc29tZUltYWdlVmlldyBmcm9tICcuL2Nocm9tb3NvbWUtaW1hZ2UnO1xuaW1wb3J0IEdlbmV0aWNzVXRpbHMgZnJvbSAnLi4vdXRpbGl0aWVzL2dlbmV0aWNzLXV0aWxzJztcblxubGV0IFRlc3RQdWxsZG93blZpZXcgPSAoe3NwZWNpZXMsIGdlbmUsIHNlbGVjdGlvbiwgb25TZWxlY3Rpb25DaGFuZ2V9KSA9PiB7XG4gICAgICBsZXQgYWxsZWxlcyA9IGdlbmUuYWxsZWxlcyxcbiAgICAgICAgICBhbGxlbGVOYW1lcyA9IGFsbGVsZXMubWFwKGEgPT4gc3BlY2llcy5hbGxlbGVMYWJlbE1hcFthXSksXG4gICAgICAgICAgbnVtQWxsZWxlcyA9IGFsbGVsZU5hbWVzLmxlbmd0aCxcbiAgICAgICAgICBwb3NzaWJsZUNvbWJvcyA9IFtdLFxuICAgICAgICAgIGN1cnJlbnRTZWxlY3Rpb24gPSBzZWxlY3Rpb24gfHwgXCJwbGFjZWhvbGRlclwiLFxuICAgICAgICAgIGksIGo7XG5cbiAgICAgIHBvc3NpYmxlQ29tYm9zLnB1c2goPG9wdGlvbiBrZXk9XCJwbGFjZWhvbGRlclwiIHZhbHVlPVwicGxhY2Vob2xkZXJcIiBkaXNhYmxlZD1cImRpc2FibGVkXCI+U2VsZWN0IGEgR2Vub3R5cGU8L29wdGlvbj4pO1xuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbnVtQWxsZWxlczsgaSsrKSB7XG4gICAgICAgIGZvciAoaiA9IGk7IGogPCBudW1BbGxlbGVzOyBqKyspIHtcbiAgICAgICAgICBsZXQga2V5ID0gaSArIFwiIFwiICsgaixcbiAgICAgICAgICAgICAgc3RyaW5nID0gYWxsZWxlTmFtZXNbaV0gKyBcIiAvIFwiICsgYWxsZWxlTmFtZXNbal07XG4gICAgICAgICAgcG9zc2libGVDb21ib3MucHVzaCg8b3B0aW9uIGtleT17a2V5fSB2YWx1ZT17a2V5fT57c3RyaW5nfTwvb3B0aW9uPik7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZWxlY3Qtd3JhcHBlclwiPlxuICAgICAgICAgIDxzZWxlY3QgdmFsdWU9eyBjdXJyZW50U2VsZWN0aW9uIH0gb25DaGFuZ2U9eyBvblNlbGVjdGlvbkNoYW5nZSB9PlxuICAgICAgICAgICAgeyBwb3NzaWJsZUNvbWJvcyB9XG4gICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9O1xuXG5jb25zdCBHZW5vbWVUZXN0VmlldyA9ICh7b3JnLCBoaWRkZW5BbGxlbGVzPVtdLCBzZWxlY3Rpb249e30sIG9uU2VsZWN0aW9uQ2hhbmdlfSkgPT4ge1xuICBsZXQgcGFpcldyYXBwZXJzID0gW107XG4gIGZvciAobGV0IGNocm9tb3NvbWVOYW1lIG9mIG9yZy5zcGVjaWVzLmNocm9tb3NvbWVOYW1lcykge1xuICAgIGxldCBjaHJvbSA9IG9yZy5nZW5ldGljcy5nZW5vdHlwZS5jaHJvbW9zb21lc1tjaHJvbW9zb21lTmFtZV0sXG4gICAgICAgIGFsbGVsZXMgPSBjaHJvbVtPYmplY3Qua2V5cyhjaHJvbSlbMF1dLmFsbGVsZXMsXG4gICAgICAgIHZpc2libGVBbGxlbGVzID0gR2VuZXRpY3NVdGlscy5maWx0ZXJBbGxlbGVzKGFsbGVsZXMsIGhpZGRlbkFsbGVsZXMsIG9yZy5zcGVjaWVzKSxcbiAgICAgICAgZ2VuZXMgPSB2aXNpYmxlQWxsZWxlcy5tYXAoYSA9PiBCaW9Mb2dpY2EuR2VuZXRpY3MuZ2V0R2VuZU9mQWxsZWxlKG9yZy5zcGVjaWVzLCBhKSksXG4gICAgICAgIHB1bGxkb3ducyA9IGdlbmVzLm1hcChnID0+IHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPFRlc3RQdWxsZG93blZpZXdcbiAgICAgICAgICAgICAga2V5ICAgICAgID0geyBnLm5hbWUgfVxuICAgICAgICAgICAgICBzcGVjaWVzICAgPSB7IG9yZy5zcGVjaWVzIH1cbiAgICAgICAgICAgICAgZ2VuZSAgICAgID0geyBnIH1cbiAgICAgICAgICAgICAgc2VsZWN0aW9uID0geyBzZWxlY3Rpb25bZy5uYW1lXSB9XG4gICAgICAgICAgICAgIG9uU2VsZWN0aW9uQ2hhbmdlID0geyBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgIG9uU2VsZWN0aW9uQ2hhbmdlKGcsIGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gICAgICAgICAgICAgIH0gfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApO1xuICAgICAgICB9KTtcblxuICAgIHBhaXJXcmFwcGVycy5wdXNoKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJpdGVtc1wiIGtleT17Y2hyb21vc29tZU5hbWV9PlxuICAgICAgICA8Q2hyb21vc29tZUltYWdlVmlldyAvPlxuICAgICAgICA8Q2hyb21vc29tZUltYWdlVmlldyAvPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbm9tZS10ZXN0LW9wdGlvbnNcIj5cbiAgICAgICAgICB7IHB1bGxkb3ducyB9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBnZW5vbWUtdGVzdFwiPlxuICAgICAgeyBwYWlyV3JhcHBlcnMgfVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuVGVzdFB1bGxkb3duVmlldy5wcm9wVHlwZXMgPSB7XG4gIHNwZWNpZXM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgZ2VuZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBzZWxlY3Rpb246IFByb3BUeXBlcy5zdHJpbmcsXG4gIG9uU2VsZWN0aW9uQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG59O1xuXG5HZW5vbWVUZXN0Vmlldy5wcm9wVHlwZXMgPSB7XG4gIG9yZzogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBoaWRkZW5BbGxlbGVzOiBQcm9wVHlwZXMuYXJyYXksXG4gIHNlbGVjdGlvbjogUHJvcFR5cGVzLm9iamVjdCxcbiAgb25TZWxlY3Rpb25DaGFuZ2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEdlbm9tZVRlc3RWaWV3O1xuIiwiaW1wb3J0IHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBDaHJvbW9zb21lVmlldyBmcm9tICcuL2Nocm9tb3NvbWUnO1xuXG5jb25zdCBHZW5vbWVWaWV3ID0gKHtvcmcsIGhpZGRlbkFsbGVsZXMgPSBbXSwgZWRpdGFibGU9dHJ1ZSwgb25BbGxlbGVDaGFuZ2V9KSA9PiB7XG4gIGxldCBwYWlyV3JhcHBlcnMgPSBbXTtcbiAgZm9yIChsZXQgY2hyb21vc29tZU5hbWUgb2Ygb3JnLnNwZWNpZXMuY2hyb21vc29tZU5hbWVzKSB7XG4gICAgbGV0IGNocm9tID0gb3JnLmdlbmV0aWNzLmdlbm90eXBlLmNocm9tb3NvbWVzW2Nocm9tb3NvbWVOYW1lXSxcbiAgICAgICAgcGFpcnMgPSBbXTtcbiAgICBmb3IgKGxldCBzaWRlIGluIGNocm9tKSB7XG4gICAgICBwYWlycy5wdXNoKFxuICAgICAgICA8Q2hyb21vc29tZVZpZXdcbiAgICAgICAgICBvcmc9e29yZ31cbiAgICAgICAgICBrZXk9e3BhaXJzLmxlbmd0aCArIDF9XG4gICAgICAgICAgY2hyb21vc29tZU5hbWU9e2Nocm9tb3NvbWVOYW1lfVxuICAgICAgICAgIHNpZGU9e3NpZGV9XG4gICAgICAgICAgaGlkZGVuQWxsZWxlcz17aGlkZGVuQWxsZWxlc31cbiAgICAgICAgICBsYWJlbHNPblJpZ2h0PXtwYWlycy5sZW5ndGg+MH1cbiAgICAgICAgICBlZGl0YWJsZT17ZWRpdGFibGV9XG4gICAgICAgICAgb25BbGxlbGVDaGFuZ2U9e2Z1bmN0aW9uKHByZXZBbGxlbGUsIG5ld0FsbGVsZSkge1xuICAgICAgICAgICAgb25BbGxlbGVDaGFuZ2UoY2hyb21vc29tZU5hbWUsIHNpZGUsIHByZXZBbGxlbGUsIG5ld0FsbGVsZSk7XG4gICAgICAgICAgfX0vPlxuICAgICAgKTtcbiAgICB9XG4gICAgcGFpcldyYXBwZXJzLnB1c2goXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgY2hyb21vc29tZS1wYWlyXCIga2V5PXtwYWlyV3JhcHBlcnMubGVuZ3RoICsgMX0+XG4gICAgICAgIHsgcGFpcnMgfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBnZW5vbWVcIj5cbiAgICAgIHsgcGFpcldyYXBwZXJzIH1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbkdlbm9tZVZpZXcucHJvcFR5cGVzID0ge1xuICBvcmc6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgaGlkZGVuQWxsZWxlczogUHJvcFR5cGVzLmFycmF5LFxuICBvbkFsbGVsZUNoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXG4gIGVkaXRhYmxlOiBQcm9wVHlwZXMuYm9vbFxufTtcblxuZXhwb3J0IGRlZmF1bHQgR2Vub21lVmlldztcbiIsImltcG9ydCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgQ2lyY3VsYXJHbG93VmlldyBmcm9tICcuL2NpcmN1bGFyLWdsb3cnO1xuXG5jb25zdCBHbG93QmFja2dyb3VuZFZpZXcgPSAoe2lkLCBjb2xvciwgc2l6ZSwgY29udGFpbmVyU3R5bGU9e30sIGdsb3dTdHlsZT17fSwgQ2hpbGRDb21wb25lbnQsIGNoaWxkU3R5bGU9e30sIC4uLm90aGVyc30pID0+IHtcbiAgY29uc3QgdENvbnRhaW5lclN0eWxlID0geyBwb3NpdGlvbjogJ3JlbGF0aXZlJywgd2lkdGg6IHNpemUsIGhlaWdodDogc2l6ZSwgLi4uY29udGFpbmVyU3R5bGUgfSxcbiAgICAgICAgdEdsb3dTdHlsZSA9IHsgcG9zaXRpb246ICdhYnNvbHV0ZScsIC4uLmdsb3dTdHlsZSB9LFxuICAgICAgICB0Q2hpbGRTdHlsZSA9IHsgcG9zaXRpb246ICdhYnNvbHV0ZScsIC4uLmNoaWxkU3R5bGUgfTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBnbG93LWJhY2tncm91bmRcIiBzdHlsZT17dENvbnRhaW5lclN0eWxlfT5cbiAgICAgIDxDaXJjdWxhckdsb3dWaWV3IGlkPXsnZ2xvdy0nK2lkfSBjb2xvcj17Y29sb3J9IHNpemU9e3NpemV9IHN0eWxlPXt0R2xvd1N0eWxlfS8+XG4gICAgICA8Q2hpbGRDb21wb25lbnQgaWQ9eydjaGlsZC0nK2lkfSBzdHlsZT17dENoaWxkU3R5bGV9IHdpZHRoPXtzaXplfSB7Li4ub3RoZXJzfSAvPlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuR2xvd0JhY2tncm91bmRWaWV3LnByb3BUeXBlcyA9IHtcbiAgaWQ6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgY29sb3I6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgc2l6ZTogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBjb250YWluZXJTdHlsZTogUHJvcFR5cGVzLm9iamVjdCxcbiAgZ2xvd1N0eWxlOiBQcm9wVHlwZXMub2JqZWN0LFxuICBDaGlsZENvbXBvbmVudDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgY2hpbGRTdHlsZTogUHJvcFR5cGVzLm9iamVjdFxufTtcblxuZXhwb3J0IGRlZmF1bHQgR2xvd0JhY2tncm91bmRWaWV3O1xuIiwiLypcbiAqIEJhc2VkIG9uIFJlYWN0T3ZlcmxheXMgZGVtbyBhdCBodHRwOi8vcmVhY3QtYm9vdHN0cmFwLmdpdGh1Yi5pby9yZWFjdC1vdmVybGF5cy9leGFtcGxlcy8jbW9kYWxzXG4gKi9cbmltcG9ydCBNb2RhbCBmcm9tICdyZWFjdC1vdmVybGF5cy9saWIvTW9kYWwnO1xuaW1wb3J0IEJ1dHRvbiBmcm9tICcuL2J1dHRvbic7XG5pbXBvcnQgeyBQcm9wVHlwZXMgfSBmcm9tICdyZWFjdCc7XG5cbmNvbnN0IG1vZGFsU3R5bGUgPSB7XG4gIHBvc2l0aW9uOiAnZml4ZWQnLFxuICB6SW5kZXg6IDEwNDAsXG4gIHRvcDogMCwgYm90dG9tOiAwLCBsZWZ0OiAwLCByaWdodDogMFxufTtcblxuY29uc3QgYmFja2Ryb3BTdHlsZSA9IHtcbiAgLi4ubW9kYWxTdHlsZSxcbiAgekluZGV4OiAnYXV0bycsXG4gIGJhY2tncm91bmRDb2xvcjogJyMwMDAnLFxuICBvcGFjaXR5OiAwLjFcbn07XG5cbmNvbnN0IGRpYWxvZ1N0eWxlID0gZnVuY3Rpb24oKSB7XG4gIC8vIHdlIHVzZSBzb21lIHBzdWVkbyByYW5kb20gY29vcmRzIHNvIG5lc3RlZCBtb2RhbHNcbiAgLy8gZG9uJ3Qgc2l0IHJpZ2h0IG9uIHRvcCBvZiBlYWNoIG90aGVyLlxuICBsZXQgdG9wID0gNTA7XG4gIGxldCBsZWZ0ID0gNTA7XG5cbiAgcmV0dXJuIHtcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICB3aWR0aDogNDAwLFxuICAgIHRvcDogdG9wICsgJyUnLCBsZWZ0OiBsZWZ0ICsgJyUnLFxuICAgIHRyYW5zZm9ybTogYHRyYW5zbGF0ZSgtJHt0b3B9JSwgLSR7bGVmdH0lKWAsXG4gICAgYm9yZGVyOiAnMXB4IHNvbGlkICNlNWU1ZTUnLFxuICAgIGJhY2tncm91bmRDb2xvcjogJ3doaXRlJyxcbiAgICBib3hTaGFkb3c6ICcwIDVweCAxNXB4IHJnYmEoMCwwLDAsLjUpJyxcbiAgICBwYWRkaW5nOiAyMFxuICB9O1xufTtcblxuXG5jbGFzcyBNb2RhbEFsZXJ0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHNob3c6IFByb3BUeXBlcy5ib29sLFxuICAgIG1lc3NhZ2U6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgZXhwbGFuYXRpb246IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgbGVmdEJ1dHRvbjogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGxhYmVsOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgb25DbGljazogUHJvcFR5cGVzLmZ1bmNcbiAgICB9KSxcbiAgICByaWdodEJ1dHRvbjogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGxhYmVsOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgb25DbGljazogUHJvcFR5cGVzLmZ1bmNcbiAgICB9KSxcbiAgICBvbkhpZGU6IFByb3BUeXBlcy5mdW5jXG4gIH1cblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIHNob3c6IGZhbHNlXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgLyogZXNsaW50IHJlYWN0L2pzeC1oYW5kbGVyLW5hbWVzOiAwICovXG4gICAgY29uc3QgbGVmdFByb3BzID0gdGhpcy5wcm9wcy5sZWZ0QnV0dG9uIHx8IHt9LFxuICAgICAgICAgIGxlZnRCdXR0b24gPSBsZWZ0UHJvcHNcbiAgICAgICAgICAgICAgICAgICAgICAgID8gPEJ1dHRvbiBsYWJlbD17bGVmdFByb3BzLmxhYmVsIHx8IFwiXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17bGVmdFByb3BzLm9uQ2xpY2t9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDogbnVsbCxcbiAgICAgICAgICByaWdodFByb3BzID0gdGhpcy5wcm9wcy5yaWdodEJ1dHRvbiB8fCB7fSxcbiAgICAgICAgICByaWdodEJ1dHRvbiA9IDxCdXR0b24gbGFiZWw9e3JpZ2h0UHJvcHMubGFiZWwgfHwgXCJcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17cmlnaHRQcm9wcy5vbkNsaWNrfS8+O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxNb2RhbCAgYXJpYS1sYWJlbGxlZGJ5PSdtb2RhbC1sYWJlbCdcbiAgICAgICAgICAgICAgc3R5bGU9e21vZGFsU3R5bGV9XG4gICAgICAgICAgICAgIGJhY2tkcm9wU3R5bGU9e2JhY2tkcm9wU3R5bGV9XG4gICAgICAgICAgICAgIHNob3c9e3RoaXMucHJvcHMuc2hvd31cbiAgICAgICAgICAgICAgb25IaWRlPXt0aGlzLnByb3BzLm9uSGlkZX0gPlxuICAgICAgICA8ZGl2IHN0eWxlPXtkaWFsb2dTdHlsZSgpfSA+XG4gICAgICAgICAgPGg0IGlkPSdtb2RhbC1sYWJlbCc+e3RoaXMucHJvcHMubWVzc2FnZX08L2g0PlxuICAgICAgICAgIDxwPnt0aGlzLnByb3BzLmV4cGxhbmF0aW9ufTwvcD5cbiAgICAgICAgICB7bGVmdEJ1dHRvbn0ge3JpZ2h0QnV0dG9ufVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvTW9kYWw+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBNb2RhbEFsZXJ0O1xuXG4iLCJpbXBvcnQge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IENpcmN1bGFyR2xvd1ZpZXcgZnJvbSAnLi9jaXJjdWxhci1nbG93JztcbmltcG9ydCBPcmdhbmlzbVZpZXcgZnJvbSAnLi9vcmdhbmlzbSc7XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIEJpb0xvZ2ljYSBvcmdhbmlzbSBhcyBhbiBpbWFnZSBvbiB0b3Agb2YgYSBjaXJjdWxhciBncmFkaWVudCBcImdsb3dcIiBiYWNrZ3JvdW5kLlxuICogSW1wbGVtZW50ZWQgYXMgYSBSZWFjdCBzdGF0ZWxlc3MgZnVuY3Rpb25hbCBjb21wb25lbnQuXG4gKlxuICogQHBhcmFtIHtCaW9Mb2dpY2EuT3JnYW5pc219IG9yZyAtIHRoZSBvcmdhbmlzbSB0byBiZSByZXByZXNlbnRlZFxuICogQHBhcmFtIHtzdHJpbmd9IGNvbG9yIC0gdGhlIGNvbG9yIG9mIHRoZSBjaXJjdWxhciBncmFkaWVudCBcImdsb3dcIiBiYWNrZ3JvdW5kIHZpZXcuXG4gKiBAcGFyYW0ge251bWJlcn0gc2l6ZVxuICovXG5jb25zdCBPcmdhbmlzbUdsb3dWaWV3ID0gKHtpZCwgY2xhc3NOYW1lLCBjb2xvciwgc2l6ZSwgc3R5bGU9e30sIC4uLm90aGVyfSkgPT4ge1xuICBjb25zdCBjb250YWluZXJTdHlsZSA9IHtwb3NpdGlvbjogJ3JlbGF0aXZlJywgd2lkdGg6IHNpemUsIGhlaWdodDogc2l6ZX0sXG4gICAgICAgIGdsb3dTdHlsZSA9IHsgcG9zaXRpb246ICdhYnNvbHV0ZScgfSxcbiAgICAgICAgb3JnU3R5bGUgPSB7IHBvc2l0aW9uOiAnYWJzb2x1dGUnLCAuLi5zdHlsZSB9O1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBpZD17aWR9IGNsYXNzTmFtZT17YGdlbmlibG9ja3Mgb3JnYW5pc20tZ2xvdyAke2NsYXNzTmFtZX1gfSBzdHlsZT17Y29udGFpbmVyU3R5bGV9PlxuICAgICAgPENpcmN1bGFyR2xvd1ZpZXcgaWQ9e2Ake2lkfS1nbG93YH0gY29sb3I9e2NvbG9yfSBzaXplPXtzaXplfSBzdHlsZT17Z2xvd1N0eWxlfS8+XG4gICAgICA8T3JnYW5pc21WaWV3IGlkPXtgJHtpZH0tb3JnYW5pc21gfSB3aWR0aD17c2l6ZX0gc3R5bGU9e29yZ1N0eWxlfSB7Li4ub3RoZXJ9IC8+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5PcmdhbmlzbUdsb3dWaWV3LnByb3BUeXBlcyA9IHtcbiAgaWQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGNsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgY29sb3I6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgc2l6ZTogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBzdHlsZTogUHJvcFR5cGVzLm9iamVjdFxufTtcblxuZXhwb3J0IGRlZmF1bHQgT3JnYW5pc21HbG93VmlldztcbiIsImltcG9ydCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5cbmNvbnN0IE9yZ2FuaXNtVmlldyA9ICh7b3JnLCBpZCwgd2lkdGg9MjAwLCBzdHlsZT17fSwgb25DbGljaywgd3JhcHBlciB9KSA9PiB7XG4gIGNvbnN0IGJhc2VVcmwgPSBcImh0dHBzOi8vZ2VuaXZlcnNlLXJlc291cmNlcy5jb25jb3JkLm9yZy9yZXNvdXJjZXMvZHJha2VzL2ltYWdlcy9cIixcbiAgICAgICAgdXJsICAgICA9IGJhc2VVcmwgKyBvcmcuZ2V0SW1hZ2VOYW1lKCksXG4gICAgICAgIC8vIFRoZSBnb2FsIGhlcmUgd2FzIHRvIGhhdmUgdGhlIG9uTW91c2VEb3duIGhhbmRsZXIgc2VsZWN0IHRoZSBvcmdhbmlzbSxcbiAgICAgICAgLy8gc28gdGhhdCBtb3VzZWRvd24tZHJhZyB3aWxsIGJvdGggc2VsZWN0IHRoZSBvcmdhbmlzbSBhbmQgYmVnaW4gdGhlXG4gICAgICAgIC8vIGRyYWcuIFRoaXMgd29ya3Mgb24gQ2hyb21lIGFuZCBTYWZhcmksIGJ1dCBvbiBGaXJlZm94IGl0IGRpc2FibGVzXG4gICAgICAgIC8vIGRyYWdnaW5nLiBEaXNhYmxpbmcgdGhlIG9uTW91c2VEb3duIGhhbmRsZXIgbWVhbnMgdGhhdCBGaXJlZm94IHVzZXJzXG4gICAgICAgIC8vIG11c3QgY2xpY2sgdG8gc2VsZWN0IGFuZCB0aGVuIGNsaWNrIHRvIGRyYWcsIGJ1dCBhdCBsZWFzdCB0aGV5IGNhblxuICAgICAgICAvLyBkcmFnLiBUaGUgcmlnaHQgc29sdXRpb24gaXMgcHJvYmFibHkgdG8gYWxsb3cgb3JnYW5pc21zIHRvIGJlIGRyYWdnZWRcbiAgICAgICAgLy8gd2hldGhlciBvciBub3QgdGhleSdyZSBzZWxlY3RlZCBhbmQgdGhlbiBob3BlZnVsbHkgdGhlIG9uTW91c2VEb3duXG4gICAgICAgIC8vIGhhbmRsZXIgd2lsbCB3b3JrIGFzIGV4cGVjdGVkLiBPdGhlcndpc2UsIGl0IG1heSBiZSBuZWNlc3NhcnkgdG9cbiAgICAgICAgLy8gc2VsZWN0IHRoZSBvcmdhbmlzbSAoaWYgaXQgaXNuJ3QgYWxyZWFkeSBzZWxlY3RlZCkgaW4gYmVnaW5EcmFnLlxuICAgICAgICBpc0ZpcmVmb3ggPSAobmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ2ZpcmVmb3gnKSA+PSAwKSxcbiAgICAgICAgaGFuZGxlTW91c2VEb3duID0gaXNGaXJlZm94ID8gdW5kZWZpbmVkIDogaGFuZGxlQ2xpY2ssXG4gICAgICAgIGRpdldyYXBwZXIgPSB3cmFwcGVyIHx8IGZ1bmN0aW9uKGVsdCkgeyByZXR1cm4gZWx0OyB9O1xuXG4gIGZ1bmN0aW9uIGhhbmRsZUNsaWNrKCkge1xuICAgIGlmIChvbkNsaWNrKSBvbkNsaWNrKGlkLCBvcmcpO1xuICB9XG5cbiAgcmV0dXJuIGRpdldyYXBwZXIoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIG9yZ2FuaXNtXCIgaWQ9e2lkfSBzdHlsZT17c3R5bGV9IFxuICAgICAgICAgIG9uTW91c2VEb3duPXtoYW5kbGVNb3VzZURvd259IG9uQ2xpY2s9e2hhbmRsZUNsaWNrfT5cbiAgICAgIDxpbWcgc3JjPXt1cmx9IHdpZHRoPXt3aWR0aH0gLz5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbk9yZ2FuaXNtVmlldy5wcm9wVHlwZXMgPSB7XG4gIG9yZzogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIsXG4gIHN0eWxlOiBQcm9wVHlwZXMub2JqZWN0LFxuICBvbkNsaWNrOiBQcm9wVHlwZXMuZnVuYyxcbiAgd3JhcHBlcjogUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmV4cG9ydCBkZWZhdWx0IE9yZ2FuaXNtVmlldztcbiIsImltcG9ydCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUGVuVmlldyBmcm9tICcuL3Blbic7XG5pbXBvcnQgU3RhdHNWaWV3IGZyb20gJy4vc3RhdHMnO1xuaW1wb3J0IFRhYnMgZnJvbSAncmVhY3Qtc2ltcGxldGFicyc7XG5cbmNsYXNzIFBlblN0YXRzVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBvcmdzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMub2JqZWN0KS5pc1JlcXVpcmVkLFxuICAgIGxhc3RDbHV0Y2hTaXplOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgc2VsZWN0ZWRJbmRleDogUHJvcFR5cGVzLm51bWJlcixcbiAgICBvblNlbGVjdGlvbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmNcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IG9yZ3MsIGxhc3RDbHV0Y2hTaXplLCBzZWxlY3RlZEluZGV4LCBvblNlbGVjdGlvbkNoYW5nZSwgLi4ub3RoZXJzIH0gPSB0aGlzLnByb3BzLFxuICAgICAgICAgIGxhc3RDbHV0Y2ggPSBvcmdzLnNsaWNlKC1sYXN0Q2x1dGNoU2l6ZSk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPFRhYnM+XG4gICAgICAgIDxUYWJzLlBhbmVsIHRpdGxlPVwiQnJlZWRpbmcgUGVuXCIga2V5PVwiQnJlZWRpbmcgUGVuXCI+XG4gICAgICAgICAgPFBlblZpZXcgb3Jncz17bGFzdENsdXRjaH0gey4uLm90aGVyc31cbiAgICAgICAgICAgICAgICAgIHNlbGVjdGVkSW5kZXg9e3NlbGVjdGVkSW5kZXh9XG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXtmdW5jdGlvbihpU2VsZWN0ZWRJbmRleCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAob25TZWxlY3Rpb25DaGFuZ2UpXG4gICAgICAgICAgICAgICAgICAgICAgb25TZWxlY3Rpb25DaGFuZ2UoaVNlbGVjdGVkSW5kZXgpO1xuICAgICAgICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgPC9UYWJzLlBhbmVsPlxuICAgICAgICA8VGFicy5QYW5lbCB0aXRsZT1cIlN0YXRzXCIga2V5PVwiU3RhdHNcIj5cbiAgICAgICAgICA8U3RhdHNWaWV3IG9yZ3M9e29yZ3N9IGxhc3RDbHV0Y2hTaXplPXtsYXN0Q2x1dGNoU2l6ZX0gLz5cbiAgICAgICAgPC9UYWJzLlBhbmVsPlxuICAgICAgPC9UYWJzPlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGVuU3RhdHNWaWV3O1xuIiwiaW1wb3J0IHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBPcmdhbmlzbVZpZXcgZnJvbSAnLi9vcmdhbmlzbSc7XG5cbmNvbnN0IFBlblZpZXcgPSAoe29yZ3MsIGlkUHJlZml4PSdvcmdhbmlzbS0nLCB3aWR0aD00MDAsIGNvbHVtbnM9NSwgU2VsZWN0ZWRPcmdhbmlzbVZpZXc9T3JnYW5pc21WaWV3LCBzZWxlY3RlZEluZGV4LCBvbkNsaWNrfSkgPT4ge1xuXG4gIGZ1bmN0aW9uIGhhbmRsZUNsaWNrKGlkLCBvcmcpIHtcbiAgICBjb25zdCBwcmVmaXhJbmRleCA9IGlkLmluZGV4T2YoaWRQcmVmaXgpLFxuICAgICAgICAgIGluZGV4ID0gTnVtYmVyKGlkLnN1YnN0cihwcmVmaXhJbmRleCArIGlkUHJlZml4Lmxlbmd0aCkpO1xuICAgIGlmIChvbkNsaWNrKSBvbkNsaWNrKGluZGV4LCBpZCwgb3JnKTtcbiAgfVxuXG4gIGxldCBvcmdXaWR0aCA9IHdpZHRoL2NvbHVtbnMsXG4gICAgICBvcmdWaWV3cyA9IG9yZ3MubWFwKChvcmcsIGluZGV4KSA9PiB7XG4gICAgICAgIHJldHVybiBpbmRleCA9PT0gc2VsZWN0ZWRJbmRleFxuICAgICAgICAgICAgICAgID8gPFNlbGVjdGVkT3JnYW5pc21WaWV3IG9yZz17b3JnfSBpZD17aWRQcmVmaXggKyBpbmRleH0gaW5kZXg9e2luZGV4fSBrZXk9e2luZGV4fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I9XCIjRkZGRkFBXCIgc2l6ZT17b3JnV2lkdGh9IG9uQ2xpY2s9e2hhbmRsZUNsaWNrfS8+XG4gICAgICAgICAgICAgICAgOiA8T3JnYW5pc21WaWV3IG9yZz17b3JnfSBpZD17aWRQcmVmaXggKyBpbmRleH0gaW5kZXg9e2luZGV4fSBrZXk9e2luZGV4fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aD17b3JnV2lkdGh9IG9uQ2xpY2s9e2hhbmRsZUNsaWNrfS8+O1xuICAgICAgfSk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgcGVuXCI+XG4gICAgICB7IG9yZ1ZpZXdzIH1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cblBlblZpZXcucHJvcFR5cGVzID0ge1xuICBvcmdzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMub2JqZWN0KS5pc1JlcXVpcmVkLFxuICBpZFByZWZpeDogUHJvcFR5cGVzLnN0cmluZyxcbiAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIsXG4gIGNvbHVtbnM6IFByb3BUeXBlcy5udW1iZXIsXG4gIFNlbGVjdGVkT3JnYW5pc21WaWV3OiBQcm9wVHlwZXMuZnVuYyxcbiAgc2VsZWN0ZWRJbmRleDogUHJvcFR5cGVzLm51bWJlcixcbiAgb25DbGljazogUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFBlblZpZXc7XG4iLCJpbXBvcnQge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IENpcmN1bGFyR2xvd1ZpZXcgZnJvbSAnLi9jaXJjdWxhci1nbG93JztcblxuY29uc3QgUXVlc3Rpb25HbG93VmlldyA9ICh7Z2xvd0NvbG9yLCBzaXplPTIwMH0pID0+IHtcbiAgY29uc3QgY29udGFpbmVyU3R5bGUgPSB7cG9zaXRpb246ICdyZWxhdGl2ZScsIHdpZHRoOiBzaXplLCBoZWlnaHQ6IHNpemV9LFxuICAgICAgICBnbG93U3R5bGUgPSB7cG9zaXRpb246ICdhYnNvbHV0ZSd9O1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIHF1ZXN0aW9uLWdsb3dcIiBzdHlsZT17Y29udGFpbmVyU3R5bGV9PlxuICAgICAgPENpcmN1bGFyR2xvd1ZpZXcgY29sb3I9e2dsb3dDb2xvcn0gc2l6ZT17c2l6ZX0gc3R5bGU9e2dsb3dTdHlsZX0vPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIHF1ZXN0aW9uLWdsb3cgcXVlc3Rpb24tbWFya1wiXG4gICAgICAgICAgICBzdHlsZT17e3Bvc2l0aW9uOiBcImFic29sdXRlXCIsIHdpZHRoOiBzaXplLCBoZWlnaHQ6IHNpemV9fT5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xuICAvLyBIVE1MIHRleHQgbm9kZVxuICAvLzxkaXYgc3R5bGU9e3RTdHlsZX0+e3RleHR9PC9kaXY+XG5cbiAgLy8gU1ZHIHRleHQgbm9kZVxuICAvLzxzdmcgd2lkdGg9e3NpemUrMn0gaGVpZ2h0PXtzaXplKzJ9IHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cbiAgLy8gIDx0ZXh0IHg9JzUwJyB5PScxNzUnIGZpbGw9JyMwRDBEOEMnIHN0eWxlPXt0U3R5bGV9PlxuICAvLyAgICB7dGV4dH1cbiAgLy8gIDwvdGV4dD5cbiAgLy88L3N2Zz5cbn07XG5cblF1ZXN0aW9uR2xvd1ZpZXcucHJvcFR5cGVzID0ge1xuICBnbG93Q29sb3I6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgc2l6ZTogUHJvcFR5cGVzLm51bWJlclxufTtcblxuZXhwb3J0IGRlZmF1bHQgUXVlc3Rpb25HbG93VmlldztcbiIsImltcG9ydCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgT3JnYW5pc21HbG93VmlldyBmcm9tICcuL29yZ2FuaXNtLWdsb3cnO1xuaW1wb3J0IFF1ZXN0aW9uR2xvd1ZpZXcgZnJvbSAnLi9xdWVzdGlvbi1nbG93JztcblxuY29uc3QgUXVlc3Rpb25PcmdhbmlzbUdsb3dWaWV3ID0gKHtoaWRkZW4sIGNvbG9yLCBzaXplLCAuLi5vdGhlcn0pID0+IHtcbiAgY29uc3Qgb3JnVmlldyA9IDxPcmdhbmlzbUdsb3dWaWV3IGNvbG9yPXtjb2xvcn0gc2l6ZT17c2l6ZX0gey4uLm90aGVyfSAvPixcbiAgICAgICAgcXVlc3Rpb25WaWV3ID0gPFF1ZXN0aW9uR2xvd1ZpZXcgZ2xvd0NvbG9yPXtjb2xvcn0gd2lkdGg9e3NpemV9IC8+LFxuICAgICAgICBmaW5hbFZpZXcgPSBoaWRkZW4gPyBxdWVzdGlvblZpZXcgOiBvcmdWaWV3O1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIHF1ZXN0aW9uLW9yZ2FuaXNtLWdsb3dcIj5cbiAgICAgIHtmaW5hbFZpZXd9XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5RdWVzdGlvbk9yZ2FuaXNtR2xvd1ZpZXcucHJvcFR5cGVzID0ge1xuICBoaWRkZW46IFByb3BUeXBlcy5ib29sLFxuICBjb2xvcjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBzaXplOiBQcm9wVHlwZXMubnVtYmVyXG59O1xuXG5leHBvcnQgZGVmYXVsdCBRdWVzdGlvbk9yZ2FuaXNtR2xvd1ZpZXc7XG4iLCJpbXBvcnQge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IEdlbmV0aWNzVXRpbHMgZnJvbSAnLi4vdXRpbGl0aWVzL2dlbmV0aWNzLXV0aWxzJztcblxuLyoqXG4gKiBTdGF0ZWxlc3MgZnVuY3Rpb25hbCBSZWFjdCBjb21wb25lbnQgZm9yIGRpc3BsYXlpbmcgYnJlZWRpbmcgc3RhdGlzdGljcyBmb3IgYSBzZXQgb2YgQmlvbG9naWNhIG9yZ2FuaXNtc1xuICogQHBhcmFtIHtPYmplY3RbXX0gb3JncyAtIGFycmF5IG9mIEJpb2xvZ2ljYSBvcmdhbmlzbXMgZm9yIHdoaWNoIHN0YXRpc3RpY3MgYXJlIHRvIGJlIGRpc3BsYXllZFxuICogQHBhcmFtIHtPYmplY3R9IG9yZ3NbXS5waGVub3R5cGUgLSB0aGUgcGhlbm90eXBlIG9mIHRoZSBCaW9sb2dpY2Egb3JnYW5pc21cbiAqIEBwYXJhbSB7bnVtYmVyfSBbbGFzdENsdXRjaFNpemU9b3Jncy5sZW5ndGhdIC0gdGhlIG51bWJlciBvZiBvcmdhbmlzbXMgYXQgdGhlIGVuZCBvZiB0aGUgYXJyYXkgdGhhdCBjb21wcmlzZSB0aGUgbW9zdCByZWNlbnQgY2x1dGNoXG4gKi9cbmNvbnN0IFN0YXRzVmlldyA9ICh7b3JncywgbGFzdENsdXRjaFNpemV9KSA9PiB7XG5cbiAgbGV0IHRyYWl0cyA9IEdlbmV0aWNzVXRpbHMuY29tcHV0ZVRyYWl0Q291bnRzRm9yT3JnYW5pc21zKG9yZ3MsIGxhc3RDbHV0Y2hTaXplKSxcbiAgICAgIGNsdXRjaFNpemUgPSBsYXN0Q2x1dGNoU2l6ZSB8fCBvcmdzLmxlbmd0aCxcbiAgICAgIHJvd3MgPSBbXTtcblxuICAvLyBidWlsZCBjdW11bGF0aXZlIHN0YXRzIGZvciB0YWJsZSByb3dzXG4gIGxldCB0cmFpdE51bSA9IDA7XG4gIGZvciAoY29uc3QgW3RyYWl0LCB2YWx1ZXNdIG9mIHRyYWl0cykge1xuICAgIGZvciAoY29uc3QgW3ZhbHVlLCBjb3VudHNdIG9mIHZhbHVlcykge1xuICAgICAgY29uc3QgY01hbGVzID0gY291bnRzLmNsdXRjaFtCaW9Mb2dpY2EuTUFMRV0sXG4gICAgICAgICAgICBjRmVtYWxlcyA9IGNvdW50cy5jbHV0Y2hbQmlvTG9naWNhLkZFTUFMRV0sXG4gICAgICAgICAgICBjVG90YWwgPSBjTWFsZXMgKyBjRmVtYWxlcyxcbiAgICAgICAgICAgIGNQY3QgPSBNYXRoLnJvdW5kKDEwMCAqIGNUb3RhbCAvIGNsdXRjaFNpemUpLFxuICAgICAgICAgICAgdE1hbGVzID0gY291bnRzLnRvdGFsW0Jpb0xvZ2ljYS5NQUxFXSxcbiAgICAgICAgICAgIHRGZW1hbGVzID0gY291bnRzLnRvdGFsW0Jpb0xvZ2ljYS5GRU1BTEVdLFxuICAgICAgICAgICAgdFRvdGFsID0gdE1hbGVzICsgdEZlbWFsZXMsXG4gICAgICAgICAgICB0UGN0ID0gTWF0aC5yb3VuZCgxMDAgKiB0VG90YWwgLyBvcmdzLmxlbmd0aCk7XG4gICAgICByb3dzLnB1c2goeyB0cmFpdCwgdHJhaXROdW0sIHZhbHVlLCBjTWFsZXMsIGNGZW1hbGVzLCBjVG90YWwsIGNQY3QsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0TWFsZXMsIHRGZW1hbGVzLCB0VG90YWwsIHRQY3QgfSk7XG4gICAgfVxuICAgICsrIHRyYWl0TnVtO1xuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3Mgc3RhdHNcIj5cbiAgICAgIDx0YWJsZSBpZD1cInN0YXRzLXRhYmxlXCIgY2xhc3NOYW1lPXtvcmdzLmxlbmd0aCA+IDAgPyBcImhhcy1kYXRhXCIgOiBcIm5vLWRhdGFcIn0+XG4gICAgICAgIDx0aGVhZD5cbiAgICAgICAgICA8dHI+XG4gICAgICAgICAgICA8dGg+VHJhaXQgVmFsdWU8L3RoPlxuICAgICAgICAgICAgPHRoIGNvbFNwYW49XCIyXCI+Q2x1dGNoPC90aD48dGg+RjwvdGg+PHRoPk08L3RoPlxuICAgICAgICAgICAgPHRoIGNvbFNwYW49XCIyXCI+VG90YWw8L3RoPjx0aD5GPC90aD48dGg+TTwvdGg+XG4gICAgICAgICAgPC90cj5cbiAgICAgICAgPC90aGVhZD5cbiAgICAgICAgPHRib2R5PlxuICAgICAgICB7XG4gICAgICAgICAgcm93cy5tYXAoZnVuY3Rpb24ocm93LCBpbmRleCkge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgPHRyIGtleT17aW5kZXh9IGNsYXNzTmFtZT17cm93LnRyYWl0TnVtICYgMSA/IFwib2RkLXRyYWl0XCIgOiBcImV2ZW4tdHJhaXRcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdHJhaXQtdmFsdWU9e3Jvdy52YWx1ZX0+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cImxhYmVsXCI+e3Jvdy52YWx1ZX08L3RkPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJudW1lcmljXCI+e3Jvdy5jVG90YWx9PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwibnVtZXJpY1wiPntyb3cuY1BjdH0lPC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwibnVtZXJpY1wiPntyb3cuY0ZlbWFsZXN9PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwibnVtZXJpY1wiPntyb3cuY01hbGVzfTwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cIm51bWVyaWNcIj57cm93LnRUb3RhbH08L3RkPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJudW1lcmljXCI+e3Jvdy50UGN0fSU8L3RkPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJudW1lcmljXCI+e3Jvdy50RmVtYWxlc308L3RkPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJudW1lcmljXCI+e3Jvdy50TWFsZXN9PC90ZD5cbiAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICA8L3Rib2R5PlxuICAgICAgPC90YWJsZT5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cblN0YXRzVmlldy5wcm9wVHlwZXMgPSB7XG4gIG9yZ3M6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5vYmplY3QpLmlzUmVxdWlyZWQsXG4gIGxhc3RDbHV0Y2hTaXplOiBQcm9wVHlwZXMubnVtYmVyXG59O1xuXG5leHBvcnQgZGVmYXVsdCBTdGF0c1ZpZXc7XG4iLCIvKlxuICogU2VlIGh0dHBzOi8vbWVkaXVtLmNvbS9Aa2VudGNkb2Rkcy9taXN1bmRlcnN0YW5kaW5nLWVzNi1tb2R1bGVzLXVwZ3JhZGluZy1iYWJlbC10ZWFycy1hbmQtYS1zb2x1dGlvbi1hZDJkNWFiOTNjZTAjLnExdmNrZmZpd1xuICogKEtlbnQgQy4gRG9kZHMsIFwiTWlzdW5kZXJzdGFuZGluZyBFUzYgTW9kdWxlcywgVXBncmFkaW5nIEJhYmVsLCBUZWFycywgYW5kIGEgU29sdXRpb25cIilcbiAqIGZvciBkZXNjcmlwdGlvbiBvZiBzb21lIG9mIHRoZSBkZXRhaWxzIGludm9sdmVkIGluIG1peGluZyBFUzYgZXhwb3J0IHdpdGggcmVxdWlyZSgpLlxuICovXG5cbi8vIGNvbXBvbmVudHNcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQWxsZWxlRmlsdGVyc1ZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvYWxsZWxlLWZpbHRlcnMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBBbGxlbGVWaWV3IH0gZnJvbSAnLi9jb21wb25lbnRzL2FsbGVsZSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEFuaW1hdGVkR2FtZXRlVmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9hbmltYXRlZC1nYW1ldGUnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBBbmltYXRlZE9yZ2FuaXNtVmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9hbmltYXRlZC1vcmdhbmlzbSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEJ1dHRvbiB9IGZyb20gJy4vY29tcG9uZW50cy9idXR0b24nO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBDaGFuZ2VTZXhCdXR0b25zIH0gZnJvbSAnLi9jb21wb25lbnRzL2NoYW5nZS1zZXgtYnV0dG9ucyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIENocm9tb3NvbWVJbWFnZVZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvY2hyb21vc29tZS1pbWFnZSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIENocm9tb3NvbWVWaWV3IH0gZnJvbSAnLi9jb21wb25lbnRzL2Nocm9tb3NvbWUnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBDaXJjdWxhckdsb3dWaWV3IH0gZnJvbSAnLi9jb21wb25lbnRzL2NpcmN1bGFyLWdsb3cnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBGZWVkYmFja1ZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvZmVlZGJhY2snO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBGZXJ0aWxpemluZ0dhbWV0ZVZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvZmVydGlsaXppbmctZ2FtZXRlJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgR2FtZXRlUG9vbFZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvZ2FtZXRlLXBvb2wnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBHYW1ldGVWaWV3IH0gZnJvbSAnLi9jb21wb25lbnRzL2dhbWV0ZSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEdlbmVMYWJlbFZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvZ2VuZS1sYWJlbCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEdlbm9tZVRlc3RWaWV3IH0gZnJvbSAnLi9jb21wb25lbnRzL2dlbm9tZS10ZXN0JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgR2Vub21lVmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9nZW5vbWUnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBHbG93QmFja2dyb3VuZFZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvZ2xvdy1iYWNrZ3JvdW5kJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgTW9kYWxBbGVydCB9IGZyb20gJy4vY29tcG9uZW50cy9tb2RhbC1hbGVydCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIE9yZ2FuaXNtVmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9vcmdhbmlzbSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIE9yZ2FuaXNtR2xvd1ZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvb3JnYW5pc20tZ2xvdyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFBlblZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvcGVuJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgUGVuU3RhdHNWaWV3IH0gZnJvbSAnLi9jb21wb25lbnRzL3Blbi1zdGF0cyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFF1ZXN0aW9uR2xvd1ZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvcXVlc3Rpb24tZ2xvdyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFF1ZXN0aW9uT3JnYW5pc21HbG93VmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9xdWVzdGlvbi1vcmdhbmlzbS1nbG93JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgU3RhdHNWaWV3IH0gZnJvbSAnLi9jb21wb25lbnRzL3N0YXRzJztcblxuLy8gdXRpbGl0aWVzXG5leHBvcnQgeyBkZWZhdWx0IGFzIEdlbmV0aWNzVXRpbHMgfSBmcm9tICcuL3V0aWxpdGllcy9nZW5ldGljcy11dGlscyc7XG4iLCIvKipcbiAqIENsYXNzIHByb3ZpZGluZyB1dGlsaXR5IGZ1bmN0aW9ucyBmb3IgQmlvTG9naWNhIGdlbmV0aWNzIG9wZXJhdGlvbnMuXG4gKiBJbiBzb21lIGNhc2VzIHRoZXNlIGFyZSBhZGFwdGVkIGZyb20gY29ycmVzcG9uZGluZyBjb2RlIGluIEdlbml2ZXJzZS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2VuZXRpY3NVdGlscyB7XG5cbiAgLyoqXG4gICAqIEZpbHRlcnMgb3V0IGhpZGRlbiBhbGxlbGVzIGZyb20gYW4gb3JpZ2luYWwgbGlzdCBvZiBhbGxlbGVzXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nW119IGFsbGVsZXMgLSB0aGUgc2V0IG9mIGFsbGVsZXMgdG8gYmUgZmlsdGVyZWRcbiAgICogQHBhcmFtIHtzdHJpbmdbXX0gaGlkZGVuQWxsZWxlcyAtIHRoZSBhbGxlbGVzIGlkZW50aWZ5aW5nIHRoZSBoaWRkZW4gZ2VuZXNcbiAgICogQHBhcmFtIHtCaW9Mb2dpY2Euc3BlY2llc30gc3BlY2llcyAtIHRoZSBzcGVjaWVzIHRoYXQgZGVmaW5lcyB0aGUgZ2Vub3R5cGVcbiAgICogQHJldHVybiB7c3RyaW5nW119IC0gdGhlIGZpbHRlcmVkIGFsbGVsZXNcbiAgICovXG4gIHN0YXRpYyBmaWx0ZXJBbGxlbGVzKGFsbGVsZXMsIGhpZGRlbkFsbGVsZXMsIHNwZWNpZXMpIHtcbiAgICBjb25zdCBoaWRkZW5HZW5lcyA9IGhpZGRlbkFsbGVsZXMubWFwKGEgPT4gQmlvTG9naWNhLkdlbmV0aWNzLmdldEdlbmVPZkFsbGVsZShzcGVjaWVzLCBhKSk7XG4gICAgcmV0dXJuIGFsbGVsZXMuZmlsdGVyKGEgPT4ge1xuICAgICAgY29uc3QgZ2VuZSA9IEJpb0xvZ2ljYS5HZW5ldGljcy5nZXRHZW5lT2ZBbGxlbGUoc3BlY2llcywgYSk7XG4gICAgICByZXR1cm4gaGlkZGVuR2VuZXMuaW5kZXhPZihnZW5lKSA9PT0gLTE7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ29tcHV0ZSBhIG1hcCBvZiB0cmFpdHMgLT4gdHJhaXRWYWx1ZXMgLT4gdHJhaXRDb3VudHMuXG4gICAqXG4gICAqIEBwYXJhbSB7QmlvTG9naWNhLk9yZ2FuaXNtW119IG9yZ2FuaXNtcyAtIHRoZSBzZXQgb2Ygb3JnYW5pc21zIHRvIGNvbXB1dGUgc3RhdHMgZm9yXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBjbHV0Y2hTaXplIC0gdGhlIGxhc3QgJ2NsdXRjaFNpemUnIG9yZ2FuaXNtcyBhcmUgYXNzdW1lZCB0byBiZSB0aGUgbGFzdCBjbHV0Y2hcbiAgICogQHJldHVybiB7TWFwfSAtIGUuZy4geyBcInRhaWxcIjogeyBcImxvbmcgdGFpbFwiOiB7IFwiY2x1dGNoXCI6IFs5LCAxMV0sIFwidG90YWxcIjogWzUzLCA0N10gfX19XG4gICAqL1xuICBzdGF0aWMgY29tcHV0ZVRyYWl0Q291bnRzRm9yT3JnYW5pc21zKG9yZ2FuaXNtcywgbGFzdENsdXRjaFNpemUpIHtcbiAgICBsZXQgdHJhaXRzID0gbmV3IE1hcCxcbiAgICAgICAgY2x1dGNoU2l6ZSA9IGxhc3RDbHV0Y2hTaXplIHx8IG9yZ2FuaXNtcy5sZW5ndGg7XG5cbiAgICAvLyBhY2N1bXVsYXRlIHN0YXRzIGZvciBlYWNoIHRyYWl0L3ZhbHVlIGNvbWJpbmF0aW9uXG4gICAgZm9yIChjb25zdCBbaW5kZXgsIG9yZ10gb2Ygb3JnYW5pc21zLmVudHJpZXMoKSkge1xuICAgICAgZm9yIChjb25zdCB0cmFpdCBvZiBPYmplY3Qua2V5cyhvcmcucGhlbm90eXBlLmNoYXJhY3RlcmlzdGljcykpIHtcbiAgICAgICAgbGV0IHZhbHVlID0gb3JnLnBoZW5vdHlwZS5jaGFyYWN0ZXJpc3RpY3NbdHJhaXRdLFxuICAgICAgICAgICAgdHJhaXRWYWx1ZXMgPSB0cmFpdHMuZ2V0KHRyYWl0KSB8fCBuZXcgTWFwLFxuICAgICAgICAgICAgdmFsdWVDb3VudHMgPSB0cmFpdFZhbHVlcy5nZXQodmFsdWUpIHx8IHsgY2x1dGNoOiBbMCwgMF0sIHRvdGFsOiBbMCwgMF0gfTtcbiAgICAgICAgaWYgKCF0cmFpdHMuaGFzKHRyYWl0KSkgdHJhaXRzLnNldCh0cmFpdCwgdHJhaXRWYWx1ZXMpO1xuICAgICAgICBpZiAoIXRyYWl0VmFsdWVzLmhhcyh2YWx1ZSkpIHRyYWl0VmFsdWVzLnNldCh2YWx1ZSwgdmFsdWVDb3VudHMpO1xuICAgICAgICAvLyBtb3N0IHJlY2VudCBjbHV0Y2ggYXNzdW1lZCB0byBiZSBhdCBlbmQgb2Ygb3JnYW5pc21zIGFycmF5XG4gICAgICAgIGlmIChpbmRleCA+PSBvcmdhbmlzbXMubGVuZ3RoIC0gY2x1dGNoU2l6ZSlcbiAgICAgICAgICArKyB2YWx1ZUNvdW50cy5jbHV0Y2hbb3JnLnNleF07XG4gICAgICAgICsrIHZhbHVlQ291bnRzLnRvdGFsW29yZy5zZXhdO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJhaXRzO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIGFuIGFsbGVsZSBzdHJpbmcgdG8gYSBKYXZhU2NyaXB0IG9iamVjdCB0aGF0IG1hcHMgZ2VuZXMgdG8gYWxsZWxlcy5cbiAgICogVGhpcyBjYW4gYmUgdXNlZnVsIGZvciBjb21wYXJpc29uIHB1cnBvc2VzLCBmb3IgaW5zdGFuY2UuXG4gICAqXG4gICAqIEBwYXJhbSB7QmlvTG9naWNhLkdlbmV0aWNzfSBnZW5ldGljcyAtIGdlbmV0aWNzIG9iamVjdCB0byB1c2UgZm9yIGdlbmUgbWFwcGluZ1xuICAgKiBAcGFyYW0ge3N0cmluZ30gYWxsZWxlU3RyaW5nIC0gYWxsZWxlIHN0cmluZyBvZiBmb3JtIFwiYTpoLGI6aCxhOmEsYjphLi4uXCIgdG8gYmUgbW9kaWZpZWRcbiAgICogQHJldHVybiB7b2JqZWN0fSAtIGdlbmUgbWFwIG9mIGZvcm0geyBob3Juczoge2E6XCJoXCIsIGI6XCJoXCJ9LCBhcm1vcjoge2E6XCJhXCIsIGI6XCJhXCJ9LCAuLi59XG4gICAqL1xuICBzdGF0aWMgYnVpbGRHZW5lTWFwRnJvbUFsbGVsZVN0cmluZyhnZW5ldGljcywgYWxsZWxlU3RyaW5nKSB7XG4gICAgbGV0IGdlbmVNYXAgPSB7fSxcbiAgICAgICAgYWxsZWxlU3Vic3RyaW5ncyA9IGFsbGVsZVN0cmluZy5zcGxpdChcIixcIik7XG4gICAgZm9yIChjb25zdCBhbGxlbGVTdWJzdHIgb2YgYWxsZWxlU3Vic3RyaW5ncykge1xuICAgICAgY29uc3QgW3NpZGUsIGFsbGVsZV0gPSBhbGxlbGVTdWJzdHIuc3BsaXQoXCI6XCIpLFxuICAgICAgICAgICAgZ2VuZSA9IGdlbmV0aWNzLmdlbmVGb3JBbGxlbGUoYWxsZWxlKTtcbiAgICAgIGlmIChzaWRlICYmIGFsbGVsZSAmJiBnZW5lKSB7XG4gICAgICAgIGlmICghZ2VuZU1hcFtnZW5lXSkgZ2VuZU1hcFtnZW5lXSA9IHt9O1xuICAgICAgICBnZW5lTWFwW2dlbmVdW3NpZGVdID0gYWxsZWxlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZ2VuZU1hcDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHaXZlbiBhbiBhbGxlbGUgc3RyaW5nIGFuZCBhIGdlbmUgbWFwIGRlZmluaW5nIGEgc2V0IG9mIGJhc2UgKGRlZmF1bHQpIGFsbGVsZXMsXG4gICAqIHJldHVybnMgYSBuZXcgYWxsZWxlIHN0cmluZyB3aXRoIG1pc3NpbmcgYWxsZWxlcyByZXBsYWNlZCBieSB0aGVpciBkZWZhdWx0cy5cbiAgICpcbiAgICogQHBhcmFtIHtCaW9Mb2dpY2EuR2VuZXRpY3N9IGdlbmV0aWNzIC0gZ2VuZXRpY3Mgb2JqZWN0IHRvIHVzZSBmb3IgZ2VuZSBtYXBwaW5nXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhbGxlbGVTdHJpbmcgLSBhbGxlbGUgc3RyaW5nIG9mIGZvcm0gXCJhOmgsYjpoLGE6YSxiOmEuLi5cIiB0byBiZSBtb2RpZmllZFxuICAgKiBAcGFyYW0ge29iamVjdH0gYmFzZUdlbmVNYXAgLSBnZW5lIG1hcCBvZiBmb3JtIHsgaG9ybjoge2E6XCJoXCIsIGI6XCJoXCJ9LCBhcm1vcjoge2E6XCJhXCIsIGI6XCJhXCJ9LCAuLi59XG4gICAqIEByZXR1cm4ge3N0cmluZ30gLSB1cGRhdGVkIGFsbGVsZSBzdHJpbmcgb2YgZm9ybSBcImE6aCxiOmgsYTphLGI6YS4uLlwiXG4gICAqL1xuICBzdGF0aWMgZmlsbEluTWlzc2luZ0FsbGVsZXNGcm9tR2VuZU1hcChnZW5ldGljcywgYWxsZWxlU3RyaW5nLCBiYXNlR2VuZU1hcCkge1xuICAgIGNvbnN0IGRzdEdlbmVNYXAgPSBHZW5ldGljc1V0aWxzLmJ1aWxkR2VuZU1hcEZyb21BbGxlbGVTdHJpbmcoZ2VuZXRpY3MsIGFsbGVsZVN0cmluZyk7XG4gICAgbGV0ICAgZHN0QWxsZWxlU3RyaW5nID0gYWxsZWxlU3RyaW5nO1xuICAgIGZvciAoY29uc3QgZ2VuZSBpbiBkc3RHZW5lTWFwKSB7XG4gICAgICBjb25zdCBnZW5lVmFsdWUgPSBkc3RHZW5lTWFwW2dlbmVdO1xuICAgICAgLy8gcmVwbGFjZSBhIG1pc3NpbmcgJ2EnIHNpZGUgYWxsZWxlIHdpdGggdGhlIGRlZmF1bHQgaWYgYXBwcm9wcmlhdGVcbiAgICAgIGlmICghZ2VuZVZhbHVlLmEgJiYgYmFzZUdlbmVNYXBbZ2VuZV0gJiYgYmFzZUdlbmVNYXBbZ2VuZV0uYSkge1xuICAgICAgICBkc3RBbGxlbGVTdHJpbmcgPSBkc3RBbGxlbGVTdHJpbmcucmVwbGFjZShgYjoke2dlbmVWYWx1ZS5ifWAsIGBhOiR7YmFzZUdlbmVNYXBbZ2VuZV0uYX0sJCZgKTtcbiAgICAgIH1cbiAgICAgIC8vIHJlcGxhY2UgYSBtaXNzaW5nICdiJyBzaWRlIGFsbGVsZSB3aXRoIHRoZSBkZWZhdWx0IGlmIGFwcHJvcHJpYXRlXG4gICAgICBpZiAoIWdlbmVWYWx1ZS5iICYmIGJhc2VHZW5lTWFwW2dlbmVdICYmIGJhc2VHZW5lTWFwW2dlbmVdLmIpIHtcbiAgICAgICAgZHN0QWxsZWxlU3RyaW5nID0gZHN0QWxsZWxlU3RyaW5nLnJlcGxhY2UoYGE6JHtnZW5lVmFsdWUuYX1gLCBgJCYsYjoke2Jhc2VHZW5lTWFwW2dlbmVdLmJ9YCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkc3RBbGxlbGVTdHJpbmc7XG4gIH1cblxuICAvKipcbiAgICogR2l2ZW4gdHdvIGFsbGVsZSBzdHJpbmdzLCByZXR1cm5zIGEgbmV3IGFsbGVsZSBzdHJpbmcgaW4gd2hpY2ggbWlzc2luZyBhbGxlbGVzXG4gICAqIGluIHRoZSBmaXJzdCBhcmUgcmVwbGFjZWQgYnkgZGVmYXVsdHMgcHJvdmlkZWQgYnkgdGhlIHNlY29uZCBhbGxlbGUgc3RyaW5nLlxuICAgKlxuICAgKiBAcGFyYW0ge0Jpb0xvZ2ljYS5HZW5ldGljc30gZ2VuZXRpY3MgLSBnZW5ldGljcyBvYmplY3QgdG8gdXNlIGZvciBnZW5lIG1hcHBpbmdcbiAgICogQHBhcmFtIHtzdHJpbmd9IGFsbGVsZVN0cmluZyAtIGFsbGVsZSBzdHJpbmcgb2YgZm9ybSBcImE6aCxiOmgsYTphLGI6YS4uLlwiIHRvIGJlIG1vZGlmaWVkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBiYXNlQWxsZWxlU3RyaW5nIC0gYWxsZWxlIHN0cmluZyBvZiBmb3JtIFwiYTpoLGI6aCxhOmEsYjphLi4uXCIgdG8gdXNlIGFzIGRlZmF1bHRzXG4gICAqIEByZXR1cm4ge3N0cmluZ30gLSB1cGRhdGVkIGFsbGVsZSBzdHJpbmcgb2YgZm9ybSBcImE6aCxiOmgsYTphLGI6YS4uLlwiXG4gICAqL1xuICBzdGF0aWMgZmlsbEluTWlzc2luZ0FsbGVsZXNGcm9tQWxsZWxlU3RyaW5nKGdlbmV0aWNzLCBhbGxlbGVTdHJpbmcsIGJhc2VBbGxlbGVTdHJpbmcpIHtcbiAgICBjb25zdCBiYXNlR2VuZU1hcCA9IEdlbmV0aWNzVXRpbHMuYnVpbGRHZW5lTWFwRnJvbUFsbGVsZVN0cmluZyhnZW5ldGljcywgYmFzZUFsbGVsZVN0cmluZyk7XG4gICAgcmV0dXJuIEdlbmV0aWNzVXRpbHMuZmlsbEluTWlzc2luZ0FsbGVsZXNGcm9tR2VuZU1hcChnZW5ldGljcywgYWxsZWxlU3RyaW5nLCBiYXNlR2VuZU1hcCk7XG4gIH1cblxuICBzdGF0aWMgbnVtYmVyT2ZCcmVlZGluZ01vdmVzVG9SZWFjaERyYWtlKG9yZ2FuaXNtMSwgb3JnYW5pc20yLCBjaGFuZ2VhYmxlQWxsZWxlczEsIGNoYW5nZWFibGVBbGxlbGVzMiwgdGFyZ2V0T3JnYW5pc20pIHtcbiAgICB2YXIgbW92ZXMgPSAwLFxuICAgICAgICBvcmcxQWxsZWxlcyA9IG9yZ2FuaXNtMS5nZXRBbGxlbGVTdHJpbmcoKS5zcGxpdCgnLCcpLm1hcChhID0+IGEuc3BsaXQoJzonKVsxXSksXG4gICAgICAgIG9yZzJBbGxlbGVzID0gb3JnYW5pc20yLmdldEFsbGVsZVN0cmluZygpLnNwbGl0KCcsJykubWFwKGEgPT4gYS5zcGxpdCgnOicpWzFdKSxcbiAgICAgICAgdGFyZ2V0Y2hhcnMgPSB0YXJnZXRPcmdhbmlzbS5waGVub3R5cGUuY2hhcmFjdGVyaXN0aWNzLFxuICAgICAgICB0cmFpdFJ1bGVzID0gb3JnYW5pc20xLnNwZWNpZXMudHJhaXRSdWxlcztcblxuICAgIGZvciAodmFyIHRyYWl0IGluIHRyYWl0UnVsZXMpIHtcbiAgICAgIGlmICh0cmFpdFJ1bGVzLmhhc093blByb3BlcnR5KHRyYWl0KSkge1xuICAgICAgICB2YXIgcG9zc2libGVTb2x1dGlvbnMgPSB0cmFpdFJ1bGVzW3RyYWl0XVt0YXJnZXRjaGFyc1t0cmFpdF1dLFxuICAgICAgICAgICAgc2hvcnRlc3RQYXRoID0gSW5maW5pdHk7XG4gICAgICAgIGlmIChwb3NzaWJsZVNvbHV0aW9ucyAmJiBwb3NzaWJsZVNvbHV0aW9ucy5sZW5ndGgpIHtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaWkgPSBwb3NzaWJsZVNvbHV0aW9ucy5sZW5ndGg7IGk8aWk7IGkrKykge1xuICAgICAgICAgICAgdmFyIHNvbHV0aW9uID0gcG9zc2libGVTb2x1dGlvbnNbaV0sXG4gICAgICAgICAgICAgICAgbW92ZXNGb3JTb2x1dGlvbjEgPSAwLFxuICAgICAgICAgICAgICAgIG1vdmVzRm9yU29sdXRpb24yID0gMDtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwLCBqaiA9IHNvbHV0aW9uLmxlbmd0aDsgajxqajsgaisrKSB7XG4gICAgICAgICAgICAgIHZhciBhbGxlbGUxID0gc29sdXRpb25bal0sXG4gICAgICAgICAgICAgICAgICBhbGxlbGUyID0gaiUyID09PSAwID8gc29sdXRpb25baisxXSA6IHNvbHV0aW9uW2otMV0sXG4gICAgICAgICAgICAgICAgICBzb2x1dGlvbk1vdmVzID0gMDtcbiAgICAgICAgICAgICAgaWYgKG9yZzFBbGxlbGVzLmluZGV4T2YoYWxsZWxlMSkgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFsbGVsZTEgJiYgKGNoYW5nZWFibGVBbGxlbGVzMS5pbmRleE9mKGFsbGVsZTEpID4gLTEgfHxcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlYWJsZUFsbGVsZXMxLmluZGV4T2YoYWxsZWxlMS50b0xvd2VyQ2FzZSgpKSA+IC0xKSkge1xuICAgICAgICAgICAgICAgICAgc29sdXRpb25Nb3ZlcysrO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBzb2x1dGlvbk1vdmVzID0gSW5maW5pdHk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYgKG9yZzJBbGxlbGVzLmluZGV4T2YoYWxsZWxlMikgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFsbGVsZTIgJiYgKGNoYW5nZWFibGVBbGxlbGVzMi5pbmRleE9mKGFsbGVsZTIpID4gLTEgfHxcbiAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2VhYmxlQWxsZWxlczIuaW5kZXhPZihhbGxlbGUyLnRvTG93ZXJDYXNlKCkpID4gLTEpKSB7XG4gICAgICAgICAgICAgICAgICBzb2x1dGlvbk1vdmVzKys7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHNvbHV0aW9uTW92ZXMgPSBJbmZpbml0eTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAoaiUyID09PSAwKSB7XG4gICAgICAgICAgICAgICAgbW92ZXNGb3JTb2x1dGlvbjEgKz0gc29sdXRpb25Nb3ZlcztcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBtb3Zlc0ZvclNvbHV0aW9uMiArPSBzb2x1dGlvbk1vdmVzO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzaG9ydGVzdFBhdGggPSBNYXRoLm1pbihzaG9ydGVzdFBhdGgsIE1hdGgubWluKG1vdmVzRm9yU29sdXRpb24xLCBtb3Zlc0ZvclNvbHV0aW9uMikpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBtb3ZlcyArPSBzaG9ydGVzdFBhdGg7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbW92ZXM7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIHNlcGFyYXRlIGNoYW5nZXMsIGluY2x1ZGluZyBhbGxlbGUgY2hhbmdlcyBhbmQgc2V4IGNoYW5nZXMsXG4gICAqIHJlcXVpcmVkIHRvIG1hdGNoIHRoZSBwaGVub3R5cGUgb2YgdGhlICd0ZXN0T3JnYW5pc20nIHRvIHRoYXQgb2YgdGhlICd0YXJnZXRPcmdhbmlzbScuXG4gICAqXG4gICAqIEBwYXJhbSB7QmlvTG9naWNhLk9yZ2FuaXNtfSB0ZXN0T3JnYW5pc20gLSB0aGUgb3JnYW5pc20gdG8gd2hpY2ggY2hhbmdlcyB3b3VsZCBhcHBseVxuICAgKiBAcGFyYW0ge0Jpb0xvZ2ljYS5PcmdhbmlzbX0gdGFyZ2V0T3JnYW5pc20gLSB0aGUgb3JnYW5pc20gdGhhdCBzZXJ2ZXMgYXMgZGVzdGluYXRpb25cbiAgICogQHJldHVybiB7bnVtYmVyfSAtIHRoZSB0b3RhbCBudW1iZXIgb2YgY2hhbmdlcyByZXF1aXJlZCBmb3IgdGhlIHBoZW5vdHlwZXMgdG8gbWF0Y2hcbiAgICovXG4gIHN0YXRpYyBudW1iZXJPZkNoYW5nZXNUb1JlYWNoUGhlbm90eXBlKHRlc3RPcmdhbmlzbSwgdGFyZ2V0T3JnYW5pc20pIHtcbiAgICBsZXQgcmVxdWlyZWRDaGFuZ2VDb3VudCA9IEdlbmV0aWNzVXRpbHMubnVtYmVyT2ZBbGxlbGVDaGFuZ2VzVG9SZWFjaFBoZW5vdHlwZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXN0T3JnYW5pc20ucGhlbm90eXBlLmNoYXJhY3RlcmlzdGljcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRPcmdhbmlzbS5waGVub3R5cGUuY2hhcmFjdGVyaXN0aWNzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlc3RPcmdhbmlzbS5nZW5ldGljcy5nZW5vdHlwZS5hbGxBbGxlbGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlc3RPcmdhbmlzbS5zcGVjaWVzLnRyYWl0UnVsZXMpO1xuICAgIGlmICh0ZXN0T3JnYW5pc20uc2V4ICE9PSB0YXJnZXRPcmdhbmlzbS5zZXgpXG4gICAgICArK3JlcXVpcmVkQ2hhbmdlQ291bnQ7XG5cbiAgICByZXR1cm4gcmVxdWlyZWRDaGFuZ2VDb3VudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBudW1iZXIgb2Ygc2VwYXJhdGUgYWxsZWxlIGNoYW5nZXMgcmVxdWlyZWQgdG8gbWFrZSB0aGUgcGhlbm90eXBlIG9mXG4gICAqIHRoZSBvcmdhbmlzbSBjaGFyYWN0ZXJpemVkIGJ5ICd0ZXN0Q2hhcmFjdGVyc3RpY3MnIG1hdGNoIHRoYXQgb2YgdGhlIG9yZ2FuaXNtXG4gICAqIGNoYXJhY3Rlcml6ZWQgYnkgJ3RhcmdldENoYXJhY3RlcmlzdGljcycuIEFkYXB0ZWQgZnJvbTpcbiAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vY29uY29yZC1jb25zb3J0aXVtL0dlbml2ZXJzZS1TcHJvdXRDb3JlL2Jsb2IvbWFzdGVyL2ZyYW1ld29ya3MvZ2VuaXZlcnNlL2NvbnRyb2xsZXJzL21hdGNoLmpzXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSB0ZXN0Q2hhcmFjdGVyaXN0aWNzIC0gdGhlIGNoYXJhY3RlcmlzdGljcyBvZiB0aGUgdGVzdCBvcmdhbmlzbVxuICAgKiBAcGFyYW0ge29iamVjdH0gdGFyZ2V0Q2hhcmFjdGVyaXN0aWNzIC0gdGhlIGNoYXJhY3RlcmlzdGljcyBvZiB0aGUgdGFyZ2V0IG9yZ2FuaXNtXG4gICAqIEBwYXJhbSB7c3RyaW5nW119IHRlc3RBbGxlbGVzIC0gdGhlIGFycmF5IG9mIGFsbGVsZXMgb2YgdGhlIHRlc3Qgb3JnYW5pc21cbiAgICogQHBhcmFtIHtvYmplY3R9IHRyYWl0UnVsZXMgLSB0aGUgdHJhaXRSdWxlcyBvZiB0aGUgQmlvTG9naWNhLlNwZWNpZXMgb2YgdGhlIG9yZ2FuaXNtc1xuICAgKiBAcmV0dXJuIHtudW1iZXJ9IC0gdGhlIG51bWJlciBvZiBhbGxlbGUgY2hhbmdlcyByZXF1aXJlZCBmb3IgdGhlIHBoZW5vdHlwZXMgdG8gbWF0Y2hcbiAgICovXG4gIHN0YXRpYyBudW1iZXJPZkFsbGVsZUNoYW5nZXNUb1JlYWNoUGhlbm90eXBlKHRlc3RDaGFyYWN0ZXJpc3RpY3MsIHRhcmdldENoYXJhY3RlcmlzdGljcywgdGVzdEFsbGVsZXMsIHRyYWl0UnVsZXMpIHtcbiAgICBjb25zdCBhbGxlbGVzID0gdGVzdEFsbGVsZXM7XG4gICAgbGV0ICAgbW92ZXMgPSAwO1xuXG4gICAgZm9yIChjb25zdCB0cmFpdCBpbiB0cmFpdFJ1bGVzKSB7XG4gICAgICBpZiAodHJhaXRSdWxlcy5oYXNPd25Qcm9wZXJ0eSh0cmFpdCkpIHtcbiAgICAgICAgaWYgKHRlc3RDaGFyYWN0ZXJpc3RpY3NbdHJhaXRdICE9PSB0YXJnZXRDaGFyYWN0ZXJpc3RpY3NbdHJhaXRdKSB7XG4gICAgICAgICAgLy8gZmlyc3Qgd2UgaGF2ZSB0byB3b3JrIG91dCB3aGF0IGFsbGVsZXMgdGhlIG9yaWdpbmFsIGRyYWtlIGhhcyB0aGF0IGNvcnJlc3BvbmQgdG9cbiAgICAgICAgICAvLyB0aGVpciBub24tbWF0Y2hpbmcgdHJhaXRcbiAgICAgICAgICBjb25zdCBwb3NzaWJsZVRyYWl0QWxsZWxlcyA9IEdlbmV0aWNzVXRpbHMuY29sbGVjdEFsbEFsbGVsZXNGb3JUcmFpdCh0cmFpdCwgdHJhaXRSdWxlcyk7XG4gICAgICAgICAgbGV0ICAgY2hhcmFjdGVyaXN0aWNBbGxlbGVzID0gW107XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gYWxsZWxlcy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBpZiAocG9zc2libGVUcmFpdEFsbGVsZXMuaW5kZXhPZihhbGxlbGVzW2ldKSA+PSAwKXtcbiAgICAgICAgICAgICAgY2hhcmFjdGVyaXN0aWNBbGxlbGVzLnB1c2goYWxsZWxlc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIG5vdyB3b3JrIG91dCB0aGUgc21hbGxlc3QgbnVtYmVyIG9mIHN0ZXBzIHRvIGdldCBmcm9tIHRoZXJlIHRvIHRoZSBkZXNpcmVkIGNoYXJhY3RlcmlzdGljXG4gICAgICAgICAgY29uc3QgcG9zc2libGVTb2x1dGlvbnMgPSB0cmFpdFJ1bGVzW3RyYWl0XVt0YXJnZXRDaGFyYWN0ZXJpc3RpY3NbdHJhaXRdXTtcbiAgICAgICAgICBsZXQgICBzaG9ydGVzdFBhdGhMZW5ndGggPSBJbmZpbml0eTtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBwb3NzaWJsZVNvbHV0aW9ucy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgc29sdXRpb24gPSBwb3NzaWJsZVNvbHV0aW9uc1tpXS5zbGljZSgpLFxuICAgICAgICAgICAgICAgIHBhdGhMZW5ndGggPSAwO1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDAsIGpqID0gY2hhcmFjdGVyaXN0aWNBbGxlbGVzLmxlbmd0aDsgaiA8IGpqOyBqKyspe1xuICAgICAgICAgICAgICBpZiAoc29sdXRpb24uaW5kZXhPZihjaGFyYWN0ZXJpc3RpY0FsbGVsZXNbal0pID09PSAtMSl7XG4gICAgICAgICAgICAgICAgcGF0aExlbmd0aCsrO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNvbHV0aW9uLnNwbGljZShzb2x1dGlvbi5pbmRleE9mKGNoYXJhY3RlcmlzdGljQWxsZWxlc1tqXSksIDEpOyAvLyBhbHJlYWR5IG1hdGNoZWQgdGhpcyBvbmUsIGNhbid0IG1hdGNoIGl0IGFnYWluXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNob3J0ZXN0UGF0aExlbmd0aCA9IChwYXRoTGVuZ3RoIDwgc2hvcnRlc3RQYXRoTGVuZ3RoKSA/IHBhdGhMZW5ndGggOiBzaG9ydGVzdFBhdGhMZW5ndGg7XG4gICAgICAgICAgfVxuICAgICAgICAgIG1vdmVzICs9IHNob3J0ZXN0UGF0aExlbmd0aDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbW92ZXM7XG4gIH1cblxuICAvKipcbiAgICogR29lcyB0aHJvdWdoIHRoZSB0cmFpdFJ1bGVzIHRvIGZpbmQgb3V0IHdoYXQgdW5pcXVlIGFsbGVsZXMgYXJlIGFzc29jaWF0ZWQgd2l0aCBlYWNoIHRyYWl0XG4gICAqIGUuZy4gRm9yIFwidGFpbFwiIGl0IHdpbGwgcmV0dXJuIFtcIlRcIiwgXCJUa1wiLCBcInRcIl0uIEFkYXB0ZWQgZnJvbTpcbiAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vY29uY29yZC1jb25zb3J0aXVtL0dlbml2ZXJzZS1TcHJvdXRDb3JlL2Jsb2IvbWFzdGVyL2ZyYW1ld29ya3MvZ2VuaXZlcnNlL2NvbnRyb2xsZXJzL21hdGNoLmpzXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0cmFpdCAtIG5hbWUgb2YgdHJhaXQsIGUuZy4gXCJ0YWlsXCJcbiAgICogQHBhcmFtIHtvYmplY3R9IHRyYWl0UnVsZXMgLSB0aGUgdHJhaXRSdWxlcyBvZiB0aGUgQmlvTG9naWNhLlNwZWNpZXMgd2hvc2UgdHJhaXRzIGFyZSBvZiBpbnRlcmVzdFxuICAgKiBAcmV0dXJuIHtzdHJpbmdbXX0gLSBhcnJheSBvZiBhbGxlbGUgc3RyaW5ncywgZS5nLiBbXCJUXCIsIFwiVGtcIiwgXCJ0XCJdXG4gICAqL1xuICBzdGF0aWMgX3Bvc3NpYmxlQWxsZWxlc0ZvclRyYWl0ID0ge307XG4gIHN0YXRpYyBjb2xsZWN0QWxsQWxsZWxlc0ZvclRyYWl0KHRyYWl0LCB0cmFpdFJ1bGVzKSB7XG4gICAgaWYgKEdlbmV0aWNzVXRpbHMuX3Bvc3NpYmxlQWxsZWxlc0ZvclRyYWl0W3RyYWl0XSkge1xuICAgICAgcmV0dXJuIEdlbmV0aWNzVXRpbHMuX3Bvc3NpYmxlQWxsZWxlc0ZvclRyYWl0W3RyYWl0XTtcbiAgICB9XG5cbiAgICBsZXQgYWxsZWxlc0hhc2ggPSB7fSxcbiAgICAgICAgYWxsZWxlcyAgICAgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGNoYXJhY3RlcmlzdGljIGluIHRyYWl0UnVsZXNbdHJhaXRdKXtcbiAgICAgICAgZm9yIChjb25zdCBwb3NzaWJpbGVBbGxlbGVzQ29tYm8gaW4gdHJhaXRSdWxlc1t0cmFpdF1bY2hhcmFjdGVyaXN0aWNdKSB7XG4gICAgICAgICAgaWYgKHRyYWl0UnVsZXNbdHJhaXRdW2NoYXJhY3RlcmlzdGljXS5oYXNPd25Qcm9wZXJ0eShwb3NzaWJpbGVBbGxlbGVzQ29tYm8pKXtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IHRyYWl0UnVsZXNbdHJhaXRdW2NoYXJhY3RlcmlzdGljXVtwb3NzaWJpbGVBbGxlbGVzQ29tYm9dLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgICAgYWxsZWxlc0hhc2hbdHJhaXRSdWxlc1t0cmFpdF1bY2hhcmFjdGVyaXN0aWNdW3Bvc3NpYmlsZUFsbGVsZXNDb21ib11baV1dID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGFsbGVsZSBpbiBhbGxlbGVzSGFzaCl7XG4gICAgICBhbGxlbGVzLnB1c2goYWxsZWxlKTtcbiAgICB9XG5cbiAgICBHZW5ldGljc1V0aWxzLl9wb3NzaWJsZUFsbGVsZXNGb3JUcmFpdFt0cmFpdF0gPSBhbGxlbGVzOyAgLy8gc3RvcmUgc28gd2UgZG9uJ3QgbmVlZCB0byByZWNhbGN1bGF0ZSBpdFxuICAgIHJldHVybiBhbGxlbGVzO1xuICB9XG59XG4iXX0=
