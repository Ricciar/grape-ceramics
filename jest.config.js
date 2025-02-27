export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  projects: [
    '<rootDir>/server/jest.config.js',
    '<rootDir>/client/jest.config.js',
  ],
};
