import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest', 
      {
        tsconfig: 'tsconfig.json', // Ścieżka do pliku tsconfig
        diagnostics: false, // Opcjonalnie, możesz wyłączyć diagnostykę
      },
    ],
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'], // Obsługuje TypeScript jako ESM, jeśli tego wymagasz
  transformIgnorePatterns: [
    '/node_modules/(?!node-mocks-http)/', // Jeśli używasz node-mocks-http, ignorujemy inne paczki w node_modules
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Upewnij się, że aliasy ścieżek działają poprawnie
  },
  moduleDirectories: ['node_modules', 'src'], // Ustawienie odpowiednich katalogów
};

export default config;
