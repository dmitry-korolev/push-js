// This is an example service worker
// It doesn't do anything, since this package doesn't handle sending push notifications
// However it's purpose is to show you some basic stuff, which should be handled
// by your service-worker, for push notifications to work properly.

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
            .catch()
    );
});

// Part 3. Listening for clicks on notifications
self.addEventListener('notificationclick', event => {
    // First - close the notification
    event.notification.close();

    // BTW, all data, you passed to the notification in Part 2,
    // is available to you in event.notification

    // Maybe you want to open some page?
    const RedirectURL = 'https://example.com';

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
            .catch()
    );
});

// Part 4. Listening to subscription change event.
// Because sometimes they change. Eventually.
self.addEventListener('pushsubscriptionchange', event => {
    event.waitUntil(
        // Step 1: resubscribe client.
        self.registration.pushManager.subscribe({ userVisibleOnly: true })
            .then(subscription => {/* Step 2. Do something with new subscription. Send it's credentials to your API, do something, don't just stay! */})
            .catch()
    );
});
