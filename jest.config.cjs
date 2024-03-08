/** @type {import('ts-jest').JestConfigWithTsJest} */

module.exports = {
  preset: "ts-jest",
    testEnvironment: "jsdom",
    moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
    testPathIgnorePatterns: ["/node_modules/"],
    testRegex: ".*.(test|spec).(j|t)s[x]?$",
    transform: {
        "node_modules/(react-dnd|dnd-core|@react-dnd)/.+\\.(j|t)sx?$": "ts-jest",
        "^.+\\.js$": "babel-jest",
    },
    testEnvironment: "./jest-env-jsdom.js",
    transformIgnorePatterns: [`/node_modules/(?!(filenamify)|filename-reserved-regex)`],
  }

/*
module.exports = {
  
  transform: {'^.+\\.ts?$': 'ts-jest'},
  
  testRegex: '/tests/.*\\.(test|spec)?\\.(ts|tsx)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  //testEnvironment: "./jest-env-jsdom.js",
  
  extensionsToTreatAsEsm: ['.ts'],

  transformIgnorePatterns: [
    "node_modules/(filenamify)"
  ]
};
*/