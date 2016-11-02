const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const uglify = require('rollup-plugin-uglify');
const version = require('./package.json').version;

const uglifyConfig = {
    output: {
        comments: (node, comment) => {
            const text = comment.value;
            const type = comment.type;
            if (type === "comment2") {
                return /@preserve|@license|@cc_on/i.test(text);
            }
        }
    }
};
const plugins = [
    babel({
        exclude: 'node_modules/**'
    }),
    uglify(uglifyConfig)
];
const banner = '/* @preserve version ' + version + ' */';

// Build app
rollup.rollup({
    entry: 'example/app.js',
    plugins: plugins
})
    .then(bundle => {
        bundle.write({
            format: 'iife',
            dest: 'example/app.min.js',
            banner: banner
        });
    });
