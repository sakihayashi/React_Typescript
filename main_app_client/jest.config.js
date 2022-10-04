var fetch = require('isomorphic-fetch');

module.exports = {
  preset: 'ts-jest',
  globals: {
    fetch,
    WebSocket: () => null,
    localStorage: { getItem: () => null, setItem: () => null },
    'ts-jest': {},
    'process.env': {
        apiUrl: JSON.stringify('https://api-qa.oto.analoggarage.com'),
        basename: JSON.stringify('/'),
        experimental: JSON.stringify(true),
        wsUrl: JSON.stringify('wss://api-qa.oto.analoggarage.com/websocket'),
    },
    url: { createObjectURL: () => null },
    URL: { createObjectURL: () => null },
  },
  testRegex: "/test/.*\\.(test|spec)\\.(ts|tsx|js)$",
  "transform": {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "json",
    "jsx",
  ],
  moduleNameMapper: {
    "^.+\\.(css|scss)$": "<rootDir>/test/CSSStub.js",
    "^.+\\.(svg|png|jpg)$": "<rootDir>/test/imageMock.js"
  },
  setupFiles: ['./test/setupTests.ts'],
  setupFilesAfterEnv: ['./node_modules/jest-enzyme/lib/index.js'],
  cacheDirectory: "./test/jestCache"
};


