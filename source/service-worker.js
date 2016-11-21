import notifyAll from './utils/sw/notifyClients';
import {
    PUSH_JS_WINDOW
} from './constants/channels';

const isFromParent = event => !!(
    event.notification
    && event.notification.data
    && event.notification.data._source === PUSH_JS_WINDOW
);

const sendEvent = (tag, eventName) => notifyAll({
    tag,
    eventName
});

const listener = eventName => event => {
    if (isFromParent(event)) {
        event.waitUntil(
            sendEvent(event.notification.tag, eventName)
        );
    }
};

self.addEventListener('notificationclick', listener('click'));
self.addEventListener('notificationclose', listener('close'));
