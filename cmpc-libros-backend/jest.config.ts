import type { Config } from "jest";
const config: Config = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/main.ts",
    "!src/**/dto/*.ts",
    "!src/**/constants.ts",
  ],
  coverageDirectory: "./coverage",
  testEnvironment: "node",
};
export default config;
