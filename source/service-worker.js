import notifyAll from './utils/sw/notifyClients';

const isFromParent = event => !!(
    event.notification
    && event.notification.data
    && event.notification.data._source === 'Push-JS-Window'
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
