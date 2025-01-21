/** @type {import('ts-jest').JestConfigWithTsJest} */

module.exports = {
  preset: "ts-jest",
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  testPathIgnorePatterns: ["/node_modules/"],
  testRegex: ".*.(test|spec).(j|t)s[x]?$",
  transform: {
    "node_modules/(react-dnd|dnd-core|@react-dnd)/.+\\.(j|t)sx?$": "ts-jest",
    "^.+\\.js$": "babel-jest",
  },
  transformIgnorePatterns: [`/node_modules/(?!(filenamify)|filename-reserved-regex)`],
}