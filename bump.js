const MAJOR = 0;
const MINOR = 1;
const PATCH = 2;

const replace = require('replace');
const args = require('yargs').argv;
const version = require('./package.json').version;
const path = require('path');

let newVersion = version.split('.').map(i => Number(i));

switch (true) {
    case !!args.version:
        newVersion = args.version.split('.').map(i => Number(i));
        break;

    case args.major:
        newVersion[MAJOR] = newVersion[MAJOR] + 1;
        newVersion[MINOR] = 0;
        newVersion[PATCH] = 0;
        break;

    case args.minor:
        newVersion[MINOR] = newVersion[MINOR] + 1;
        newVersion[PATCH] = 0;
        break;

    case args.patch:
    default:
        newVersion[PATCH] = newVersion[PATCH] + 1;
        break;
}

replace({
    regex: version,
    replacement: newVersion.join('.'),
    paths: [
        path.resolve('./README.md'),
        path.resolve('./package.json'),
        path.resolve('./example/app.js')
    ]
});

console.log('New version: ', newVersion.join('.')); // eslint-disable-line no-console
