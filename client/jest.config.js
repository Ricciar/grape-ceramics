export default {
  // Talar om för Jest att vi använder TypeScript
  preset: 'ts-jest',

  // Skapar en simulerad webbläsarmiljö för React
  testEnvironment: 'jsdom',

  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',

    '^@/(.*)$': '<rootDir>/src/$1',
  },

  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },

  // Talar om var vår setup-fil finns
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],

  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
  ],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{ts,tsx}',
  ],
};
