import type { Config } from 'jest';

// noinspection JSUnusedGlobalSymbols
export default async (): Promise<Config> => {
    return {
        verbose: true,
        testMatch: ['**/?(*.)+(spec|test).+(ts)'],
        preset: 'ts-jest',
        testEnvironment: 'node',
        collectCoverage: true,
        coverageDirectory: '<rootDir>/coverage',
        roots: ['<rootDir>/src']
    };
};
