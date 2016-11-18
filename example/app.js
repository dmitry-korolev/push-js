/* global Uint8Array */
/* eslint-disable no-use-before-define, no-console */
import Push from '../source/Push';

const subscribeButton = document.getElementById('subscribe');
const endpoint = document.getElementById('endpoint');
const auth = document.getElementById('auth');
const p256dh = document.getElementById('p256dh');

const ab2b64 = b => btoa(String.fromCharCode.apply(null, new Uint8Array(b)));

let toggle = () => {};

const P = new Push({
    stateChangeCb: viewUpdate,
    subscriptionUpdateCb: subscriptionUpdate,
    logCb: (...message) => console.log(...message),
    serviceWorker: '/sw.js'
});

window.Push = Push;

function subscribe() {
    return P.subscribe();
}

function unsubscribe() {
    return P.unsubscribe();
}

function viewUpdate(state) {
    window.state = state;
    subscribeButton.disabled = !state.interactive;
    subscribeButton.innerText = state.subscribed ? 'Unsubscribe' : 'Subscribe';
    toggle = state.subscribed ? unsubscribe : subscribe;
}

function onClick() {
    toggle();
}

function subscriptionUpdate(sub) {
    if (sub) {
        auth.value = ab2b64(sub.getKey('auth'));
        p256dh.value = ab2b64(sub.getKey('p256dh'));
        endpoint.value = sub.endpoint;
    } else {
        auth.value = '';
        p256dh.value = '';
        endpoint.value = '';
    }

    window.sub = sub;
}

subscribeButton.addEventListener('click', onClick);
