import baseConfig from '@repo/eslint-config';

export default [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  ...(Array.isArray(baseConfig) ? baseConfig : [baseConfig]),
];
