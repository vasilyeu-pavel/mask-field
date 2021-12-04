module.exports = {
    extends: [
        "umbrellio",
        "umbrellio/react",
        "umbrellio/jest"
    ],
    parser: "babel-eslint",
    env: {
        browser: true,
        es6: true,
        node: true,
        serviceworker: true,
        jquery: true,
    },
    globals: {
        Routes: true,
        I18n: true,
        Generator: true,
        IntersectionObserver: true,

        // for test settings
        jest: true,

        // custom
        popup: true,
        topLine: true,
        APP_CONFIG: true,
    },
    rules: {
        "no-buffer-constructor": 0,
        "switch-colon-spacing": 0,
        "new-cap": 0,
        "react/prefer-stateless-function": [2, { "ignorePureComponents": true }],
        "import/newline-after-import": ["error", { "count": 1 }],
        "no-empty-function": 2,
        "react/jsx-closing-tag-location": 2,
        "react/jsx-first-prop-new-line": 2
    }
}
