import baseConfig from '@repo/eslint-config';
import expoConfig from 'eslint-config-expo/flat';

export default [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  ...(Array.isArray(baseConfig) ? baseConfig : [baseConfig]),
  ...expoConfig,
];
