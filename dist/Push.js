'use strict';

var INIT = 'INIT';
var UNSUPPORTED = 'UNSUPPORTED';
var PERMISSION_DENIED = 'PERMISSION_DENIED';
var PERMISSION_GRANTED = 'PERMISSION_GRANTED';
var PERMISSION_PROMPT = 'PERMISSION_PROMPT';
var ERROR = 'ERROR';
var STARTING_SUBSCRIBE = 'STARTING_SUBSCRIBE';
var SUBSCRIBED = 'SUBSCRIBED';
var STARTING_UNSUBSCRIBE = 'STARTING_UNSUBSCRIBE';
var UNSUBSCRIBED = 'UNSUBSCRIBED';

var states = {
    INIT: {
        id: INIT,
        interactive: false,
        subscribed: false
    },
    UNSUPPORTED: {
        id: UNSUPPORTED,
        interactive: false,
        subscribed: false
    },
    PERMISSION_DENIED: {
        id: PERMISSION_DENIED,
        interactive: false,
        subscribed: false
    },
    PERMISSION_GRANTED: {
        id: PERMISSION_GRANTED,
        interactive: true,
        subscribed: false
    },
    PERMISSION_PROMPT: {
        id: PERMISSION_PROMPT,
        interactive: true,
        subscribed: false
    },
    ERROR: {
        id: ERROR,
        interactive: false,
        subscribed: false
    },
    STARTING_SUBSCRIBE: {
        id: STARTING_SUBSCRIBE,
        interactive: false,
        subscribed: false
    },
    SUBSCRIBED: {
        id: SUBSCRIBED,
        interactive: true,
        subscribed: true
    },
    STARTING_UNSUBSCRIBE: {
        id: STARTING_UNSUBSCRIBE,
        interactive: false,
        subscribed: false
    },
    UNSUBSCRIBED: {
        id: UNSUBSCRIBED,
        interactive: true,
        subscribed: false
    }
};

var noop = (function () {});

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();





var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};



var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

var PermissionError = function (_Error) {
    inherits(PermissionError, _Error);

    function PermissionError(message) {
        classCallCheck(this, PermissionError);

        var _this = possibleConstructorReturn(this, (PermissionError.__proto__ || Object.getPrototypeOf(PermissionError)).call(this, message));

        _this.name = 'PermissionError';
        _this.message = message || _this.name;
        _this.stack = new Error().stack;
        return _this;
    }

    return PermissionError;
}(Error);

var MIN_LENGTH = 10;
var randId = function rand() {
    var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : MIN_LENGTH;
    var prepend = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    var result = Math.random().toString(36).slice(2); // eslint-disable-line no-magic-numbers

    return result.length >= MIN_LENGTH ? prepend + result : rand(min, prepend);
};

/* global Promise */
var rejectedStates = {
    UNSUBSCRIBED: true,
    PERMISSION_DENIED: true,
    ERROR: true
};

/**
 * Class Push.
 * @example
 * const push = new Push();
 * push.subscribe().then(subscription => {})
 * push.unsubscribe().then(() => {})
 */

var Push = function () {
    /**
     * @param {stateChangeCb} [stateChangeCb]
     * @param {subscriptionUpdateCb} [subscriptionUpdateCb]
     * @param {logCb} [logCb]
     * @param {String} [serviceWorker] - Path to service-worker
     */
    function Push() {
        var _this = this;

        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var _ref$stateChangeCb = _ref.stateChangeCb;
        var stateChangeCb = _ref$stateChangeCb === undefined ? noop : _ref$stateChangeCb;
        var _ref$subscriptionUpda = _ref.subscriptionUpdateCb;
        var subscriptionUpdateCb = _ref$subscriptionUpda === undefined ? noop : _ref$subscriptionUpda;
        var _ref$logCb = _ref.logCb;
        var logCb = _ref$logCb === undefined ? noop : _ref$logCb;
        var serviceWorker = _ref.serviceWorker;
        classCallCheck(this, Push);

        this._state = Object.assign({}, states.INIT);

        this._stateChange = stateChangeCb;
        this._subscriptionUpdateCb = subscriptionUpdateCb;
        this._log = logCb;

        this._serviceWorker = serviceWorker;

        if (!Push.checkSupport()) {
            this._setState(states.UNSUPPORTED);
            return;
        }

        this._setState(Push.getPermissionState());

        if (rejectedStates[this._state.id]) {
            return;
        }

        this._installServiceWorker().then(function () {
            return Push.getSubscription();
        }).then(function (subscription) {
            if (!subscription) {
                _this._setState(states.UNSUBSCRIBED);
                return;
            }

            _this._setState(states.SUBSCRIBED);
            _this._updateSubscription(subscription);
        }).catch(function (error) {
            _this._setState(states.ERROR, error);
        });
    }

    /**
     * Sets new state
     * @param {Object} state - see states.
     * @param {Error} [error] - error object.
     * @private
     */


    createClass(Push, [{
        key: '_setState',
        value: function _setState(state, error) {
            this._log('State update: ', state, error);
            this._state = Object.assign({}, this._state, state);
            this._stateChange(this._state, error);
        }

        /**
         * Updates subscription
         * @param {PushSubscription} subscription
         * @private
         */

    }, {
        key: '_updateSubscription',
        value: function _updateSubscription(subscription) {
            this._log('Subscription update: ', subscription);
            this._subscription = subscription;
            this._subscriptionUpdateCb(this._subscription);
        }

        /**
         * Installs service worker
         * @returns {Promise.<undefined, Error>}
         * @private
         */

    }, {
        key: '_installServiceWorker',
        value: function _installServiceWorker() {
            var _this2 = this;

            return this._serviceWorker ? navigator.serviceWorker.register(this._serviceWorker).catch(function (error) {
                _this2._setState(states.ERROR, error);
                return Promise.reject(error);
            }) : Promise.resolve();
        }

        /**
         * @returns {Promise.<T>}
         * @private
         */

    }, {
        key: '_innerUnsubscribe',
        value: function _innerUnsubscribe() {
            this._updateSubscription(null);
            this._setState(states.UNSUBSCRIBED);

            return Promise.resolve();
        }

        /**
         * @returns {Promise.<PushSubscription>}
         * @private
         */

    }, {
        key: '_innerSubscribe',
        value: function _innerSubscribe(subscription) {
            this._updateSubscription(subscription);
            this._setState(states.SUBSCRIBED);

            return Promise.resolve(subscription);
        }

        /**
         * @returns {Object} Permission state
         * @public
         */

    }, {
        key: 'subscribe',


        /**
         * Creates new subscription
         * @returns {Promise.<PushSubscription, Error>}
         * @public
         */
        value: function subscribe() {
            var _this3 = this;

            return Push.getSubscription().then(function (subscription) {
                if (subscription) {
                    return _this3._innerSubscribe(subscription);
                }

                _this3._setState(states.STARTING_SUBSCRIBE);

                return Push.requestPermission().then(function () {
                    return navigator.serviceWorker.ready;
                }).then(function (registration) {
                    return registration.pushManager.subscribe({
                        userVisibleOnly: true
                    });
                }).then(function (subscription) {
                    return _this3._innerSubscribe(subscription);
                }).catch(function (error) {
                    _this3._setState(error instanceof PermissionError ? Push.getPermissionState() : states.ERROR, error);

                    return Promise.reject(error);
                });
            });
        }

        /**
         * Performs unsubscription.
         * NB: Promise.resolve() will be returned in any case. We should respect user and treat his intention to unsubscribe in a proper way.
         * @returns {Promise.<Boolean>}
         * @public
         */

    }, {
        key: 'unsubscribe',
        value: function unsubscribe() {
            var _this4 = this;

            this._setState(states.STARTING_UNSUBSCRIBE);

            return Push.getSubscription().then(function (subscription) {
                if (!subscription) {
                    return Promise.resolve(true);
                }

                return subscription.unsubscribe();
            }).then(function () {
                _this4._log('Unsubscribed successfully.');
                return _this4._innerUnsubscribe;
            }).catch(function () {
                _this4._log('Something went wrong, but whatever.');
                return _this4._innerUnsubscribe;
            });
        }
    }], [{
        key: 'getPermissionState',
        value: function getPermissionState() {
            var _denied$granted$defau;

            return (_denied$granted$defau = {}, defineProperty(_denied$granted$defau, 'denied', states.PERMISSION_DENIED), defineProperty(_denied$granted$defau, 'granted', states.PERMISSION_GRANTED), defineProperty(_denied$granted$defau, 'default', states.PERMISSION_PROMPT), _denied$granted$defau)[Notification.permission] || states.ERROR;
        }

        /**
         * @returns {Boolean}
         * @public
         */

    }, {
        key: 'checkSupport',
        value: function checkSupport() {
            var techs = ['serviceWorker', 'PushManager', 'permissions'];

            techs.forEach(function (prop) {
                if (!(prop in navigator)) {
                    return false;
                }
            });

            if (!Notification) {
                return false;
            }

            return true;
        }

        /**
         * Returns pushManager getSubscription promise.
         * @see https://developer.mozilla.org/ru/docs/Web/API/PushManager/getSubscription
         * @returns {Promise.<PushSubscription>}
         * @public
         */

    }, {
        key: 'getSubscription',
        value: function getSubscription() {
            return navigator.serviceWorker.ready.then(function (registration) {
                return registration.pushManager.getSubscription();
            });
        }

        /**
         * Requests user permission to show notifications.
         * @returns {Promise.<undefined, Error>}
         * @public
         */

    }, {
        key: 'requestPermission',
        value: function requestPermission() {
            return new Promise(function (resolve, reject) {
                switch (Notification.permission) {
                    case 'denied':
                        return reject(new PermissionError('Push messages are blocked.'));

                    case 'granted':
                        return resolve();

                    case 'default':
                    default:
                        return Notification.requestPermission(function (result) {
                            if (result !== 'granted') {
                                reject(new PermissionError('Couldn\'t obtain permission.'));
                            } else {
                                resolve();
                            }
                        });
                }
            });
        }

        /**
         * Shows notification
         * @param title
         * @param options
         * @returns {Promise.<Notification>}
         */

    }, {
        key: 'showNotification',
        value: function showNotification(title) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var tag = options.tag || randId();

            return Push.requestPermission().then(function () {
                return navigator.serviceWorker.ready;
            }).then(function (registration) {
                return registration.showNotification(title, Object.assign({}, options, { tag: tag }));
            }).then(function () {
                return navigator.serviceWorker.ready;
            }).then(function (registration) {
                return registration.getNotifications({ tag: tag });
            }).then(function (notifications) {
                return Promise.resolve(notifications[0]);
            });
        }
    }]);
    return Push;
}();

module.exports = Push;
