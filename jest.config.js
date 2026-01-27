/** @type {import('jest').Config} */
module.exports = {
  preset: "react-native",
  testEnvironment: "node",
  roots: ["<rootDir>"],
  testMatch: [
    "**/__tests__/unit/**/*.test.{ts,tsx}",
    "**/__tests__/ui/**/*.test.{ts,tsx}",
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    "stores/useSessionStore.ts",
    "stores/useExerciseStore.ts",
    "utils/validationSchemas.ts",
    "components/ui/badge.tsx",
    "components/session/SessionCard.tsx",
    "src/components/Button.tsx",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!**/__tests__/**",
  ],
  coverageDirectory: "<rootDir>/coverage",
  coverageReporters: ["text", "lcov", "html", "json-summary"],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },
  setupFilesAfterEnv: ["<rootDir>/__tests__/setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(react-native|@react-native|expo|@expo|expo-linear-gradient|expo-haptics|expo-router|expo-sqlite|@expo/vector-icons|react-native-reanimated|react-native-gesture-handler|react-native-screens|react-native-safe-area-context|zustand)/)",
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/.expo/",
    "<rootDir>/e2e/",
  ],
  verbose: true,
  clearMocks: true,
  resetMocks: true,
};
