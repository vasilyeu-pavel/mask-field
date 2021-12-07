const projectRoot = "<rootDir>/../"

module.exports = {
    roots: [projectRoot],
    verbose: false,
    moduleNameMapper: {
        '\\.(scss|css)$': 'identity-obj-proxy',
    },

    transform: {
        "^.+\\.tsx?$": "ts-jest",
        "^.+\\.[jt]sx?$": "<rootDir>/jest-legacy-transforme.js"
    },
    testRegex: "/__tests__/.*\\.test\\.tsx?$",
    moduleFileExtensions: [
        "ts",
        "tsx",
        "js",
        "scss"
    ],
    globals: {
        "ts-jest": {
            tsconfig: `${projectRoot}tsconfig.json`,
        },
    },
    collectCoverageFrom: ["**/*.{ts,tsx}", "!**/node_modules/**"],
    snapshotSerializers: ["enzyme-to-json/serializer"],
    setupFilesAfterEnv: ["<rootDir>/enzyme.setup.js"],
}
