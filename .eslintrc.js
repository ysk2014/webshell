module.exports = {
    env: {
        node: true,
        es6: true
    },
    extends: 'eslint:recommended',
    globals: {},
    parserOptions: {
        ecmaVersion: 2018
    },
    rules: {
        'no-console': 0,
        'no-undef': 0,
        'no-useless-escape': 0,
        quotes: ['error', 'single'],
        semi: ['error', 'always']
    }
};
