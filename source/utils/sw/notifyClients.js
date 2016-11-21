/* global MessageChannel, clients, Promise */
import {
    PUSH_JS_SW
} from '../../constants/channels';

const notifyClient = message => client => new Promise((resolve, reject) => {
    const channel = new MessageChannel();

    channel.port1.onmessage = event => {
        if (event.data.error) {
            reject(event.data.error);
        } else {
            resolve(event.data);
        }
    };

    client.postMessage(`${message}`, [ channel.port2 ]);
});

const notifyAll = data => clients.matchAll({
    includeUncontrolled: true
})
    .then(clients => {
        const message = {
            source: PUSH_JS_SW,
            data
        };
        const notify = notifyClient(JSON.stringify(message));
        const proms = [];

        clients.forEach(client => {
            proms.push(notify(client));
        });

        return Promise.all(proms);
    });

export default notifyAll;
