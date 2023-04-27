module.exports = {
    root: true,
    env: {
        es2021: true,
    },
    'extends': [
        'plugin:vue/vue3-essential',
        'eslint:recommended'
    ],
    rules: {
        indent: [2, 4],
        'no-unused-vars': 'warn',
        'no-undef': 'warn'
    }
}
