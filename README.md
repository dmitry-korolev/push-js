# Push-JS

### Purpose

Wrapper around Push and Notifications API
Handles subscription and unsubscription.

**Needs** service worker to be installed in any way. Provide interface to perform service worker installation if needed.

**Does not** provide other service worker related stuff and service worker itself.

### Usage

```js
// ES6
import Push from 'push-js';

// ES5
const Push = require('push-js');

const push = new Push(); // All arguments are optional
push.subscribe().then(subscription => {});
push.unsubscribe().then(() => {});
```

### Constructor parameters

##### options (optional)

An options object that can contain some callbacks and a path to the service worker.

*   `stateChangeCb`: receives state and an Error object if an error occured.
*   `subscriptionUpdateCb`: receives subscription object ([PushSubscription](https://developer.mozilla.org/en-US/docs/Web/API/PushSubscription)).
*   `logCb`: receives anything that should be logged.

### Instance methods

##### Push.prototype.subscribe()

Creates and returnes new subscription if it doesn't exist, returns old otherwise.

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

Shows notification via service worker. Returns Promise resolved with corresponding [Notification](https://developer.mozilla.org/en-US/docs/Web/API/Notification) object.

