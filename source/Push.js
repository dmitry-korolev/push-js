/* global Promise */
import states from './constants/states';
import {
    PUSH_JS_WINDOW,
    PUSH_JS_SW
} from './constants/channels';
import noop from './utils/noop';
import PermissionError from './utils/PermissionError';
import randId from './utils/randId';

const rejectedStates = {
    UNSUBSCRIBED: true,
    PERMISSION_DENIED: true,
    ERROR: true
};

const notifications = Object.create(null);

/**
 * Class Push.
 * @example
 * const push = new Push();
 * push.subscribe().then(subscription => {})
 * push.unsubscribe().then(() => {})
 */
class Push {
    /**
     * @param {stateChangeCb} [stateChangeCb]
     * @param {subscriptionUpdateCb} [subscriptionUpdateCb]
     * @param {logCb} [logCb]
     * @param {String} [serviceWorker] - Path to service-worker
     */
    constructor({
        stateChangeCb = noop,
        subscriptionUpdateCb = noop,
        logCb = noop,
        serviceWorker
    } = {}) {
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

        this._addListener();

        this._installServiceWorker()
            .then(() => Push.getSubscription())
            .then(subscription => {
                if (!subscription) {
                    this._setState(states.UNSUBSCRIBED);
                    return;
                }

                this._setState(states.SUBSCRIBED);
                this._updateSubscription(subscription);
            })
            .catch(error => {
                this._setState(states.ERROR, error);
            });
    }

    /**
     * Sets new state
     * @param {Object} state - see states.
     * @param {Error} [error] - error object.
     * @private
     */
    _setState(state, error) {
        this._log('State update: ', state, error);
        this._state = Object.assign({}, this._state, state);
        this._stateChange(this._state, error);
    }

    /**
     * Updates subscription
     * @param {PushSubscription} subscription
     * @private
     */
    _updateSubscription(subscription) {
        this._log('Subscription update: ', subscription);
        this._subscription = subscription;
        this._subscriptionUpdateCb(this._subscription);
    }

    /**
     * Installs service worker
     * @returns {Promise.<undefined, Error>}
     * @private
     */
    _installServiceWorker() {
        return this._serviceWorker ? navigator.serviceWorker.register(this._serviceWorker)
            .catch(error => {
                this._setState(states.ERROR, error);
                return Promise.reject(error);
            }) : Promise.resolve();
    }

    _addListener() {
        navigator.serviceWorker.addEventListener('message', event => {
            let message = {};

            try {
                message = JSON.parse(event.data);
            } catch (err) { /* */ }

            if (
                message.source === PUSH_JS_SW
                && message.data
                && message.data.eventName
                && notifications[message.data.tag]
                && event.ports
            ) {
                const { tag, eventName } = message.data;
                this._log('Message from SW: ', message.data);
                event.ports[0].postMessage('OK');

                notifications[tag].dispatchEvent(new Event(eventName));
            }
        });
    }

    /**
     * @returns {Promise.<T>}
     * @private
     */
    _handleUnsubscribe() {
        this._updateSubscription(null);
        this._setState(states.UNSUBSCRIBED);

        return Promise.resolve();
    }

    /**
     * @returns {Promise.<PushSubscription>}
     * @private
     */
    _handleSubscribe(subscription) {
        this._updateSubscription(subscription);
        this._setState(states.SUBSCRIBED);

        return Promise.resolve(subscription);
    }

    /**
     * @returns {Object} Permission state
     * @public
     */
    static getPermissionState() {
        return {
            ['denied']: states.PERMISSION_DENIED,
            ['granted']: states.PERMISSION_GRANTED,
            ['default']: states.PERMISSION_PROMPT
        }[Notification.permission] || states.ERROR;
    }

    /**
     * @returns {Boolean}
     * @public
     */
    static checkSupport() {
        const techs = [ 'serviceWorker', 'PushManager', 'permissions' ];

        techs.forEach(prop => {
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
    static getSubscription() {
        return navigator.serviceWorker.ready
            .then(registration => registration.pushManager.getSubscription());
    }

    /**
     * Requests user permission to show notifications.
     * @returns {Promise.<undefined, Error>}
     * @public
     */
    static requestPermission() {
        return new Promise((resolve, reject) => {
            switch (Notification.permission) {
                case 'denied':
                    return reject(new PermissionError('Push messages are blocked.'));

                case 'granted':
                    return resolve();

                case 'default':
                default:
                    return Notification.requestPermission(result => {
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
    static showNotification(title, options = {}) {
        const tag = options.tag || randId();
        const data = options.data || {};
        data._source = PUSH_JS_WINDOW;

        let notification;

        return Push.requestPermission()
            .then(() => navigator.serviceWorker.ready)
            .then(registration => registration.showNotification(title, Object.assign({}, options, { data, tag })))
            .then(() => navigator.serviceWorker.ready)
            .then(registration => registration.getNotifications({ tag }))
            .then(matched => {
                notification = matched[0];
                notifications[tag] = notification;

                return notification;
            });
    }

    /**
     * Creates new subscription
     * @returns {Promise.<PushSubscription, Error>}
     * @public
     */
    subscribe() {
        return Push.getSubscription()
            .then(subscription => {
                if (subscription) {
                    return this._handleSubscribe(subscription);
                }

                this._setState(states.STARTING_SUBSCRIBE);

                return Push.requestPermission()
                    .then(() => navigator.serviceWorker.ready)
                    .then(registration => registration.pushManager.subscribe({
                        userVisibleOnly: true
                    }))
                    .then(subscription => this._handleSubscribe(subscription))
                    .catch(error => {
                        this._setState((
                            error instanceof PermissionError
                                ? Push.getPermissionState()
                                : states.ERROR
                        ), error);

                        return Promise.reject(error);
                    });
            });
    }

    /**
     * Performs unsubscription.
     * NB: Promise.resolve() will be returned in any case.
     * We should respect user and treat his intention to unsubscribe in a proper way.
     * @returns {Promise.<Boolean>}
     * @public
     */
    unsubscribe() {
        this._setState(states.STARTING_UNSUBSCRIBE);

        return Push.getSubscription()
            .then(subscription => {
                if (!subscription) {
                    return Promise.resolve(true);
                }

                return subscription.unsubscribe();
            })
            .then(() => {
                this._log('Unsubscribed successfully.');
            })
            .catch(() => {
                this._log('Something went wrong, but whatever.');
            })
            .then(() => this._handleUnsubscribe());
    }
}

/**
 * @callback stateChangeCb
 * @param {Object} state - Object representing state.
 * @param {Error} error
 */
/**
 * @callback subscriptionUpdateCb
 * @param {PushSubscription}
 */
/**
 * @callback logCb
 * @param {...*}
 * @example
 * new Push({
 *     logCb: console.log.bind(console)
 * })
 */
/**
 * @interface PushSubscription
 * @see https://developer.mozilla.org/en-US/docs/Web/API/PushSubscription
 */
/**
 * @interface Notification
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Notification
 */

export {
    states
};
export default Push;
