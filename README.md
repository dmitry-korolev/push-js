# Push-JS

**Table of Contents**
- [Purpose](#purpose)
- [Example app](#example)
- [Usage](#usage)
- [Service worker](#service-worker)
- [Constructor parameters](#constructor-parameters)
    - [options (optional)](#options-optional)
- [Instance methods](#instance-methods)
    - [Push.prototype.subscribe()](#pushprototypesubscribe)
    - [Push.prototype.unsubscribe()](#pushprototypeunsubscribe)
- [Static methods](#static-methods)
    - [Push.getPermissionState()](#pushgetpermissionstate)
    - [Push.requestPermission()](#pushrequestpermission)
    - [Push.checkSupport()](#pushchecksupport)
    - [Push.getSubscription()](#pushgetsubscription)
    - [Push.showNotification()](#pushshownotification)
- [Version 1.1.1](#version-101)

### Purpose

Wrapper around Push and Notifications API. Handles subscription and unsubscription. Provides some useful methods.

**Needs** service worker to be installed in any way. Provides an interface to perform service worker installation if needed.

### Example

You can find a basic example application including manifest.json and fully commented service worker in the `example` folder.

To run the app use `npm run local` command and navigate to http://localhost:5001.

### Usage

```js
import Push from 'push-js';

const push = new Push(); // All arguments are optional
push.subscribe().then(subscription => {});
push.unsubscribe().then(() => {});
```

### Service worker
There is a simple service worker provided with this package. It's needed to make notification events to work properly. You may use it as is, but the best way is to import it in your service worker, as shown in the example.

### Constructor parameters

##### options (optional)

An options object that can contain some callbacks and a path to the service worker.

*   `stateChangeCb`: receives state and an Error object if an error occurred.
*   `subscriptionUpdateCb`: receives subscription object ([PushSubscription](https://developer.mozilla.org/en-US/docs/Web/API/PushSubscription)).
*   `logCb`: receives anything that should be logged.

### Instance methods

##### Push.prototype.subscribe()

Creates and returns new subscription if it does n't exist, returns old otherwise.

##### Push.prototype.unsubscribe()

Tries to unsubscribe. Returns resolved Promise anyway.

### Static methods

##### Push.getPermissionState()

Returns permission state. See `./source/constants/states.js`.

##### Push.requestPermission()

Requests user permission to show notifications. Returns resolved or rejected Promise depending on user decision.

##### Push.checkSupport()

Checks browser support and returns Boolean.

##### Push.getSubscription()

Same as [PushManager.getSubscription()](https://developer.mozilla.org/en-US/docs/Web/API/PushManager/getSubscription).

##### Push.showNotification()

Accepts two parameters, same as `new Notification` constuctor does. See [MDN](https://developer.mozilla.org/ru/docs/Web/API/Notification/Notification) for the description.
Shows notification via service worker. Returns Promise resolved with corresponding [Notification](https://developer.mozilla.org/en-US/docs/Web/API/Notification) object.

## Version 1.1.1