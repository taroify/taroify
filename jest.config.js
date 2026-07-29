/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

module.exports = {
  globals: {
    window: true,
    DEPRECATED_ADAPTER_COMPONENT: false,
    ENABLE_INNER_HTML: true,
    ENABLE_ADJACENT_HTML: true,
    ENABLE_SIZE_APIS: true,
    ENABLE_TEMPLATE_CONTENT: true,
    ENABLE_CLONE_NODE: true,
    ENABLE_CONTAINS: true,
    ENABLE_MUTATION_OBSERVER: true,
  },
  clearMocks: true,
  coverageDirectory: "coverage",
  moduleNameMapper: {
    "@tarojs/taro": "@tarojs/taro-h5",
    "@tarojs/components": "@tarojs/components/lib/react",
  },
  setupFilesAfterEnv: ["<rootDir>/jest/jest-setup.ts"],
  testEnvironment: "jest-environment-jsdom",
  testMatch: [
    "<rootDir>/packages/**/__tests__/**/*.[jt]s?(x)",
    "<rootDir>/packages/**/?(*.)+(spec|test).[tj]s?(x)",
  ],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest",
  },
  transformIgnorePatterns: [
    "<rootDir>/node_modules/.pnpm/(?!(?:@taro[^@]*|lodash-es|nanoid)@)",
    "<rootDir>/node_modules/(?!\\.pnpm|@taro|lodash-es|nanoid)",
    "^.+\\.(css|sass|scss|less)$",
  ],
}
