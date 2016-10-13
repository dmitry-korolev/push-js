import babel from 'rollup-plugin-babel';

export default {
    entry: 'source/Push.js',
    dest: 'dist/Push.js',
    format: 'cjs',
    plugins: [
        babel({
            presets: [
                ["es2015", { "modules": false }]
            ],
            plugins: ["external-helpers"]
        })
    ]
};