const INIT = 'INIT';
const UNSUPPORTED = 'UNSUPPORTED';
const PERMISSION_DENIED = 'PERMISSION_DENIED';
const PERMISSION_GRANTED = 'PERMISSION_GRANTED';
const PERMISSION_PROMPT = 'PERMISSION_PROMPT';
const ERROR = 'ERROR';
const STARTING_SUBSCRIBE = 'STARTING_SUBSCRIBE';
const SUBSCRIBED = 'SUBSCRIBED';
const STARTING_UNSUBSCRIBE = 'STARTING_UNSUBSCRIBE';
const UNSUBSCRIBED = 'UNSUBSCRIBED';

const states = {
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

export default states;
