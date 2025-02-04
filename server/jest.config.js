export default {
  // Talar om för Jest att vi använder TypeScript
  preset: 'ts-jest',
  // Detta talar om för Jest att vi kör tester i Node.js-miljö
  testEnvironment: 'node',
  // Hanterar import som använder @ som alias
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  moduleFileExtensions: ['ts', 'js'],
  // Explicit sägs var root är
  rootDir: './',
  // Var Jest ska leta efter testfiler
  testMatch: ['**/__tests__/**/*.ts', '**/*.test.ts'],
  // Mappar att ignorera när Jest letar efter tester
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};
