/* global importScripts, clients */

// This is an example service worker
// It doesn't do anything, since this package doesn't handle sending push notifications yet.
// However it's purpose is to show you some basic stuff, which should be handled
// by your service-worker, for push notifications to work properly.

// Import library service-worker from dist directory.
// It is used to receive notifications click and close events
// and to notify parent window about them.
importScripts('/service-worker.js');

// Part 1. Installation.
// See https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/skipWaiting
self.addEventListener('install', () => {
    self.skipWaiting();
});


// Part 2. Listening to pushes.
self.addEventListener('push', event => {
    // There are two ways to get some data to show to the user
    // Most progressive way is to use the PushMessageData interface
    // https://developer.mozilla.org/en-US/docs/Web/API/PushMessageData

    // Supposing we use json data.
    const json = event.data ? event.data.json() : {};

    // In case you want to support some older browsers (which doesn't make sense IMO)
    // you may use fetch() to, ugh, fetch something.

    // After retrieving data let's use it to construct a notification.
    const title = json.title;
    const options = json.options;

    // You need to wrap any async code into event.waitUntil,
    // otherwise some unexpected behavior may occur. E.g. in this case browser may show some kind
    // of technical notification ("This site has been updated in the background").
    event.waitUntil(
        self.registration.showNotification(title, options)
            .then(() => {/* here you may want to send some feedback to your API, e.g. update notification status */})
            .catch(() => {})
    );
});

// Part 3. Listening for clicks on notifications
self.addEventListener('notificationclick', event => {
    // Check that the notification is spawned from the push event
    // You may use other kinds of such inspection. For example, you can pass some
    // unique id or something in the data section of a notification object.
    if (
        event.notification
        && event.notification.data
        && event.notification.data._source === 'Push-JS-Window'
    ) {
        return;
    }

    // First - close the notification
    event.notification.close();

    // BTW, all of the data that you passed to the notification in Part 2,
    // is available to you in the event.notification

    // Maybe you want to open some page?
    const RedirectURL = (event.notification.data || {}).url || 'https://example.com';

    event.waitUntil(
        clients.matchAll({ type: 'window' })
            .then(clientList => {
                const client = clientList.find(client => client.url === RedirectURL && 'focus' in client);

                if (client) {
                    return client.focus();
                } else if (clients.openWindow) {
                    return clients.openWindow(RedirectURL);
                }
            })
            .catch(() => {})
    );
});

// Part 4. Listening to subscription change event.
// Because sometimes they change. Eventually.
self.addEventListener('pushsubscriptionchange', event => {
    event.waitUntil(
        // Step 1: resubscribe client.
        self.registration.pushManager.subscribe({ userVisibleOnly: true })
            .then(subscription => { // eslint-disable-line no-unused-vars
                /*
                    Step 2. Do something with new subscription.
                    Send it's credentials to your API, do something, don't just stare!
                */
            })
            .catch(() => {})
    );
});
