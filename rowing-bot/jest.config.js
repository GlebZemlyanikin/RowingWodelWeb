/** @type {import('jest').Config} */
module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.js'],
    collectCoverageFrom: [
        '**/*.js',
        '!**/node_modules/**',
        '!**/tests/**',
        '!**/jest.config.js',
        '!**/index.js', // Исключаем главный файл из покрытия
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    verbose: true,
    testTimeout: 10000,
};

